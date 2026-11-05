import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatBDT } from "../lib/money";

export default function CartSidebar({ open, onClose }) {
  const { items, increment, decrement, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/50 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
        inert={!open}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream z-[70] shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 h-16 sm:h-20 border-b border-sand">
          <h2 className="font-serif text-xl font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-sand transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <p className="text-ink/60 mb-6">Your cart is empty.</p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-ink text-cream font-semibold px-8 py-3 rounded-full hover:bg-gold hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-sand"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink text-sm truncate">{item.name}</h3>
                    <p className="text-gold font-bold text-sm">{formatBDT(item.price)}</p>
                    <div className="flex items-center border border-sand rounded-full overflow-hidden mt-1.5 w-fit">
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-sand transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>
                      <span className="w-9 text-center font-medium text-sm" aria-label={`Quantity: ${item.quantity}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-sand transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-ink/40 hover:text-red-600 transition-colors p-2 self-start rounded-full focus:outline-none focus:ring-2 focus:ring-gold"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-sand px-5 sm:px-6 py-5 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span className="text-gold">{formatBDT(subtotal)}</span>
              </div>
              <p className="text-xs text-ink/50">Delivery charge calculated at checkout — pay on delivery.</p>
              <button
                onClick={handleCheckout}
                className="w-full bg-ink text-cream font-semibold py-3.5 rounded-full hover:bg-gold hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
