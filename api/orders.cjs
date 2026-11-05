const crypto = require("crypto");

const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;
const SHEET_NAME = "Orders";
const HEADERS = [
  "Order ID",
  "Date and Time",
  "Product Name",
  "Product Quantity",
  "Customer Name",
  "Customer Address",
  "Customer Phone Number",
  "Delivery Location",
  "Delivery Charge",
  "Order Total",
];

// Server-side copy of the catalog. The API never trusts client-supplied
// prices or names - it looks every line up here by product id.
// Keep in sync with src/data/products.js when prices change.
const PRODUCT_CATALOG = {
  1: { name: "Arctic Edge", price: 350 },
  4: { name: "Crystal Edge", price: 350 },
  5: { name: "Leopard Edge", price: 350 },
  6: { name: "Midnight Cateye", price: 250 },
  7: { name: "Noir Bloom", price: 400 },
  2: { name: "Aurora Bloom", price: 400 },
  3: { name: "Cocoa Royale", price: 400 },
  8: { name: "Plum Royale", price: 400 },
};

const DELIVERY_CHARGES = { inside: 70, outside: 130 };
const MAX_ITEMS = 20;
const MAX_QUANTITY = 10;
const MAX_TEXT = { name: 100, address: 500 };

function generateOrderId() {
  return `FLZ-${crypto.randomUUID()}`;
}

function invalid(res, message) {
  return res.status(400).json({ error: message });
}

function normalizePhone(phone) {
  return String(phone).replace(/[\s-]/g, "");
}

async function getSheetsClient() {
  const { google } = require("googleapis");
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

// Cached so we don't check/create the header row on every order.
let headerReady = false;

async function ensureHeaderRow(sheets, spreadsheetId) {
  if (headerReady) return;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:J1`,
  });
  if (!res.data.values || res.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:J1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
  headerReady = true;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    console.error("Orders API: missing GOOGLE_* environment variables.");
    return res.status(503).json({ error: "Ordering is temporarily unavailable." });
  }

  try {
    const body = req.body || {};
    const { customer, items, location } = body;

    if (!customer || typeof customer !== "object" || !Array.isArray(items) || items.length === 0) {
      return invalid(res, "Invalid order payload.");
    }
    if (items.length > MAX_ITEMS) {
      return invalid(res, "Too many items in order.");
    }

    const { name, phone, address } = customer;
    for (const [field, value] of [["name", name], ["phone", phone], ["address", address]]) {
      if (typeof value !== "string" || value.trim().length === 0) {
        return invalid(res, `Missing or invalid customer field: ${field}.`);
      }
      if (field !== "phone" && value.trim().length > MAX_TEXT[field]) {
        return invalid(res, `Customer field too long: ${field}.`);
      }
    }

    const cleanPhone = normalizePhone(phone.trim());
    if (!BD_PHONE_REGEX.test(cleanPhone)) {
      return invalid(res, "Invalid Bangladeshi phone number.");
    }
    if (address.trim().length < 8) {
      return invalid(res, "Please enter a more complete address.");
    }

    if (location !== "inside" && location !== "outside") {
      return invalid(res, "Invalid delivery location.");
    }
    const expectedCharge = DELIVERY_CHARGES[location];

    const lines = [];
    let computedSubtotal = 0;
    for (const item of items) {
      if (!item || typeof item !== "object") return invalid(res, "Invalid item in order.");
      const product = PRODUCT_CATALOG[item.id];
      if (!product) return invalid(res, `Unknown product: ${item.id}.`);
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return invalid(res, `Invalid quantity for ${product.name}.`);
      }
      computedSubtotal += product.price * quantity;
      lines.push({ name: product.name, price: product.price, quantity });
    }

    const computedTotal = computedSubtotal + expectedCharge;

    const orderId = generateOrderId();
    const dateTime = new Date().toISOString();
    const locationLabel = location === "inside" ? "Inside Dhaka" : "Outside Dhaka";

    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await ensureHeaderRow(sheets, spreadsheetId);

    const rows = lines.map((item) => [
      orderId,
      dateTime,
      item.name,
      item.quantity,
      name.trim(),
      address.trim(),
      cleanPhone,
      locationLabel,
      expectedCharge,
      computedTotal,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:J`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: rows },
    });

    return res.status(201).json({ orderId, total: computedTotal });
  } catch (err) {
    console.error("Failed to save order:", err && err.message);
    // Reset the header cache so a transient failure retries the check.
    headerReady = false;
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to save order." });
    }
  }
};
