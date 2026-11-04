import { Link, Navigate, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="font-serif text-3xl font-semibold mb-3">Thank You!</h1>
      <p className="text-ink/70 mb-2">
        We have received your order successfully and will contact you soon to confirm it.
      </p>
      <p className="text-ink/60 mb-8">
        Order ID: <span className="font-semibold text-gold">{orderId}</span>
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-ink text-cream font-semibold px-8 py-3 rounded-full hover:bg-gold hover:text-ink transition-colors"
      >
        Continue Shopping
      </Link>
    </section>
  );
}
