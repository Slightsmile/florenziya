import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { DELIVERY_OPTIONS, BD_PHONE_REGEX, formatBDT, normalizePhone } from "../lib/money";

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
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (items.length === 0) {
    return (
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold mb-3">Your cart is empty</h1>
        <p className="text-ink/60 mb-8">Add some sunglasses before checking out.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-ink text-cream font-semibold px-8 py-3 rounded-full hover:bg-gold hover:text-ink transition-colors"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  const deliveryCharge = DELIVERY_OPTIONS[form.location].charge;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e2) => ({ ...e2, [name]: undefined }));
    setSubmitError("");
  };

  const validate = () => {
    const next = {};
    const cleanName = form.name.trim();
    const cleanPhone = normalizePhone(form.phone.trim());
    const cleanAddress = form.address.trim();
    if (!cleanName) next.name = "Name is required.";
    else if (cleanName.length > 100) next.name = "Name must be 100 characters or fewer.";
    if (!cleanPhone) {
      next.phone = "Phone number is required.";
    } else if (!BD_PHONE_REGEX.test(cleanPhone)) {
      next.phone = "Enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX).";
    }
    if (!cleanAddress) next.address = "Full address is required.";
    else if (cleanAddress.length < 8) next.address = "Please enter a more complete address so we can deliver.";
    else if (cleanAddress.length > 500) next.address = "Address must be 500 characters or fewer.";
    setErrors(next);
    return next;
  };

  const focusFirstError = (next) => {
    const order = ["name", "phone", "address"];
    const refs = { name: nameRef, phone: phoneRef, address: addressRef };
    const first = order.find((k) => next[k]);
    if (first) refs[first].current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const next = validate();
    if (Object.keys(next).length > 0) {
      focusFirstError(next);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          customer: {
            name: form.name.trim(),
            phone: normalizePhone(form.phone.trim()),
            address: form.address.trim(),
            location: form.location,
          },
          // Send ids + quantities only. The API prices the order from its
          // own catalog and never trusts client-supplied prices.
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.error;
        throw new Error(msg || "Order submission failed. Please try again.");
      }

      const orderId = data?.orderId;
      const orderTotal = data?.total;
      sessionStorage.setItem(
        "florenziya_last_order",
        JSON.stringify({ orderId, total: orderTotal, at: Date.now() })
      );
      clearCart();
      navigate("/order-success", { state: { orderId, total: orderTotal } });
    } catch (err) {
      if (err?.name === "AbortError") {
        setSubmitError("The request timed out. Please check your connection and try again.");
      } else {
        setSubmitError(err?.message || "Something went wrong placing your order. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
      setSubmitting(false);
    }
  };

  const fieldError = (key) =>
    errors[key] ? (
      <p id={`${key}-error`} className="text-red-600 text-xs mt-1.5" role="alert">
        {errors[key]}
      </p>
    ) : null;

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
      hasError ? "border-red-400" : "border-sand"
    }`;

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
          <p className="text-cream/60 text-sm mt-3">Pay on delivery. We'll call to confirm before shipping.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-5 gap-8 md:gap-10">
          <form onSubmit={handleSubmit} noValidate className="md:col-span-3 space-y-6 order-2 md:order-1">
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
                    ref={nameRef}
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    maxLength={100}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass(errors.name)}
                    placeholder="Your full name"
                  />
                  {fieldError("name")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    ref={phoneRef}
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={inputClass(errors.phone)}
                    placeholder="01XXXXXXXXX"
                  />
                  {fieldError("phone")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5" htmlFor="address">
                    Full Address
                  </label>
                  <textarea
                    ref={addressRef}
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    autoComplete="street-address"
                    maxLength={500}
                    required
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? "address-error" : undefined}
                    className={`${inputClass(errors.address)} resize-none`}
                    placeholder="House, road, area, city"
                  />
                  {fieldError("address")}
                </div>
              </div>
            </div>

            <fieldset>
              <legend className="uppercase tracking-[0.15em] text-gold text-xs font-semibold mb-4">
                02 — Delivery
              </legend>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(DELIVERY_OPTIONS).map(([key, opt]) => (
                  <label
                    key={key}
                    className={`relative flex flex-col gap-1 border rounded-xl px-4 py-4 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-gold ${
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
                    <span className="text-sm font-semibold text-gold mt-1">{formatBDT(opt.charge)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {submitError && (
              <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ink text-cream font-semibold py-4 rounded-full hover:bg-gold hover:text-ink transition-colors disabled:opacity-60 shadow-lg shadow-ink/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
            >
              {submitting ? "Placing Order..." : `Place Order — ${formatBDT(total)}`}
            </button>
          </form>

          <div className="md:col-span-2 order-1 md:order-2">
            <div className="bg-charcoal text-cream rounded-2xl p-6 sm:p-7 md:sticky md:top-24">
              <h2 className="font-serif text-xl font-semibold mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-cream/15"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-cream/50 text-xs">Qty {item.quantity}</p>
                    </div>
                    <span className="font-semibold">
                      {formatBDT(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream/15 pt-4 space-y-2.5 text-sm text-cream/80">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span>{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{formatBDT(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-cream/15 text-cream">
                  <span>Total</span>
                  <span className="text-gold-light">{formatBDT(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
