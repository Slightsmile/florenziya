// Single source of truth for pricing, shared by cart/checkout and the API.
// The API (api/orders.js) keeps its own copy because serverless functions
// cannot import from src/ once bundled by Vite.

export const DELIVERY_OPTIONS = {
  inside: { label: "Inside Dhaka", note: "2-3 business days", charge: 70 },
  outside: { label: "Outside Dhaka", note: "4-6 business days", charge: 130 },
};

export const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;

export const MAX_QUANTITY_PER_ITEM = 10;

export function formatBDT(value) {
  return `৳${Number(value || 0).toLocaleString("en-IN")}`;
}

export function normalizePhone(phone) {
  return String(phone || "").replace(/[\s-]/g, "");
}
