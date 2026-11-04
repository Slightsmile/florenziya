const { google } = require("googleapis");

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

function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FLZ-${timestamp}-${random}`;
}

async function getSheetsClient() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

async function ensureHeaderRow(sheets, spreadsheetId) {
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
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { customer, items, subtotal, deliveryCharge, total } = req.body || {};

  if (!customer || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order payload." });
  }

  const { name, phone, address, location } = customer;

  if (!name?.trim() || !phone?.trim() || !address?.trim()) {
    return res.status(400).json({ error: "Missing required customer fields." });
  }

  if (!BD_PHONE_REGEX.test(phone.trim())) {
    return res.status(400).json({ error: "Invalid Bangladeshi phone number." });
  }

  if (location !== "inside" && location !== "outside") {
    return res.status(400).json({ error: "Invalid delivery location." });
  }

  const expectedCharge = location === "inside" ? 70 : 130;
  if (deliveryCharge !== expectedCharge) {
    return res.status(400).json({ error: "Delivery charge mismatch." });
  }

  const computedSubtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  if (Math.abs(computedSubtotal - Number(subtotal)) > 0.01) {
    return res.status(400).json({ error: "Subtotal mismatch." });
  }

  const computedTotal = computedSubtotal + expectedCharge;
  if (Math.abs(computedTotal - Number(total)) > 0.01) {
    return res.status(400).json({ error: "Total mismatch." });
  }

  try {
    const orderId = generateOrderId();
    const dateTime = new Date().toISOString();
    const locationLabel = location === "inside" ? "Inside Dhaka" : "Outside Dhaka";

    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await ensureHeaderRow(sheets, spreadsheetId);

    const rows = items.map((item) => [
      orderId,
      dateTime,
      item.name,
      item.quantity,
      name.trim(),
      address.trim(),
      phone.trim(),
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

    return res.status(201).json({ orderId });
  } catch (err) {
    console.error("Failed to save order:", err);
    return res.status(500).json({ error: "Failed to save order." });
  }
};
