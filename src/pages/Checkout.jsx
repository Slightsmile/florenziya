import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const DELIVERY_OPTIONS = {
  inside: { label: "Inside Dhaka", charge: 70 },
  outside: { label: "Outside Dhaka", charge: 130 },
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
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-8 text-center sm:text-left">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5 order-2 md:order-1">
          <div>
            <label className="block font-medium mb-1.5" htmlFor="name">
              Customer Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-sand rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold bg-white"
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1.5" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-sand rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold bg-white"
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1.5" htmlFor="address">
              Full Address
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border border-sand rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold bg-white resize-none"
              placeholder="House, road, area, city"
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <span className="block font-medium mb-1.5">Delivery Location</span>
            <div className="space-y-2">
              {Object.entries(DELIVERY_OPTIONS).map(([key, opt]) => (
                <label
                  key={key}
                  className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                    form.location === key
                      ? "border-gold bg-gold/10"
                      : "border-sand bg-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="location"
                      value={key}
                      checked={form.location === key}
                      onChange={handleChange}
                      className="accent-amber-600"
                    />
                    {opt.label}
                  </span>
                  <span className="font-semibold">৳{opt.charge}</span>
                </label>
              ))}
            </div>
          </div>

          {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-cream font-semibold py-3.5 rounded-full hover:bg-gold hover:text-ink transition-colors disabled:opacity-60"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="order-1 md:order-2">
          <div className="bg-white rounded-xl border border-sand p-6 sticky top-24">
            <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-sand"
                  />
                  <span className="flex-1 text-ink/70 min-w-0 truncate">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-sand pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Product Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-sand">
                <span>Total</span>
                <span className="text-gold">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
