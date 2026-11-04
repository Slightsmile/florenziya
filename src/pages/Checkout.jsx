import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const DELIVERY_OPTIONS = {
  inside: { label: "Inside Dhaka", note: "2-3 business days", charge: 70 },
  outside: { label: "Outside Dhaka", note: "4-6 business days", charge: 130 },
};

const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    location: "inside",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  const deliveryCharge = DELIVERY_OPTIONS[form.location].charge;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e2) => ({ ...e2, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!BD_PHONE_REGEX.test(form.phone.trim())) {
      next.phone = "Enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX).";
    }
    if (!form.address.trim()) next.address = "Full address is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            location: form.location,
          },
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          deliveryCharge,
          total,
        }),
      });

      if (!res.ok) throw new Error("Order submission failed");
      const data = await res.json();

      clearCart();
      navigate("/order-success", { state: { orderId: data.orderId } });
    } catch (err) {
      setSubmitError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-cream">
      <div className="bg-charcoal text-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <p className="uppercase tracking-[0.2em] text-gold-light text-xs sm:text-sm font-semibold mb-3">
            Almost There
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">
            Complete Your Order
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-5 gap-8 md:gap-10">
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-6 order-2 md:order-1">
            <div>
              <p className="uppercase tracking-[0.15em] text-gold text-xs font-semibold mb-4">
                01 — Contact Details
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5" htmlFor="name">
                    Customer Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
                      errors.name ? "border-red-400" : "border-sand"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
                      errors.phone ? "border-red-400" : "border-sand"
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1.5">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5" htmlFor="address">
                    Full Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full border rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-gold transition-colors resize-none ${
                      errors.address ? "border-red-400" : "border-sand"
                    }`}
                    placeholder="House, road, area, city"
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1.5">{errors.address}</p>}
                </div>
              </div>
            </div>

            <div>
              <p className="uppercase tracking-[0.15em] text-gold text-xs font-semibold mb-4">
                02 — Delivery
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(DELIVERY_OPTIONS).map(([key, opt]) => (
                  <label
                    key={key}
                    className={`relative flex flex-col gap-1 border rounded-xl px-4 py-4 cursor-pointer transition-colors ${
                      form.location === key
                        ? "border-gold bg-gold/10 ring-1 ring-gold"
                        : "border-sand bg-white hover:border-ink/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={key}
                      checked={form.location === key}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between">
                      <span className="font-semibold text-ink">{opt.label}</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                          form.location === key ? "border-gold bg-gold" : "border-ink/30"
                        }`}
                      />
                    </span>
                    <span className="text-xs text-ink/50">{opt.note}</span>
                    <span className="text-sm font-semibold text-gold mt-1">৳{opt.charge}</span>
                  </label>
                ))}
              </div>
            </div>

            {submitError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ink text-cream font-semibold py-4 rounded-full hover:bg-gold hover:text-ink transition-colors disabled:opacity-60 shadow-lg shadow-ink/10"
            >
              {submitting ? "Placing Order..." : `Place Order — ৳${total.toLocaleString()}`}
            </button>
          </form>

          <div className="md:col-span-2 order-1 md:order-2">
            <div className="bg-charcoal text-cream rounded-2xl p-6 sm:p-7 sticky top-24">
              <h2 className="font-serif text-xl font-semibold mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-cream/15"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-cream/50 text-xs">Qty {item.quantity}</p>
                    </div>
                    <span className="font-semibold">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream/15 pt-4 space-y-2.5 text-sm text-cream/80">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>৳{deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-cream/15 text-cream">
                  <span>Total</span>
                  <span className="text-gold-light">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
