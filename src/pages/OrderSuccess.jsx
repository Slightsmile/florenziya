import { Link, useLocation } from "react-router-dom";
import { formatBDT } from "../lib/money";

function readLastOrder(location) {
  if (location.state?.orderId) return location.state;
  try {
    const raw = sessionStorage.getItem("florenziya_last_order");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Ignore stale confirmations older than 7 days.
    if (Date.now() - (parsed.at || 0) > 7 * 24 * 60 * 60 * 1000) {
      sessionStorage.removeItem("florenziya_last_order");
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default function OrderSuccess() {
  const location = useLocation();
  const last = readLastOrder(location);
  const orderId = last?.orderId;
  const total = last?.total;

  if (!orderId) {
    return (
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold mb-3">No recent order</h1>
        <p className="text-ink/60 mb-8">We couldn't find a recent order on this device.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-ink text-cream font-semibold px-8 py-3 rounded-full hover:bg-gold hover:text-ink transition-colors"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="font-serif text-3xl font-semibold mb-3">Thank You!</h1>
      <p className="text-ink/70 mb-2">
        We have received your order successfully and will contact you soon to confirm it.
      </p>
      <p className="text-ink/60 mb-8">
        Order ID: <span className="font-semibold text-gold">{orderId}</span>
        {typeof total === "number" && (
          <>
            {" "}· Total: <span className="font-semibold text-gold">{formatBDT(total)}</span> (pay on delivery)
          </>
        )}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-ink text-cream font-semibold px-8 py-3 rounded-full hover:bg-gold hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
      >
        Continue Shopping
      </Link>
    </section>
  );
}
