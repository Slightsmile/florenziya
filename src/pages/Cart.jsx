import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, increment, decrement, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-ink/60 mb-8">Looks like you haven't added any sunglasses yet.</p>
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
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-8 text-center sm:text-left">
        Your Cart
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-sand p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ink truncate">{item.name}</h3>
              <p className="text-gold font-bold">৳{item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center border border-sand rounded-full overflow-hidden">
              <button
                onClick={() => decrement(item.id)}
                className="w-8 h-8 flex items-center justify-center hover:bg-sand transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => increment(item.id)}
                className="w-8 h-8 flex items-center justify-center hover:bg-sand transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-semibold hidden sm:block">
              ৳{(item.price * item.quantity).toLocaleString()}
            </p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-ink/40 hover:text-red-600 transition-colors p-2"
              aria-label="Remove item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-sand p-6">
        <div className="flex justify-between text-lg font-semibold mb-6">
          <span>Subtotal</span>
          <span className="text-gold">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 text-center border border-ink/20 font-semibold py-3 rounded-full hover:bg-sand transition-colors"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => navigate("/checkout")}
            className="flex-1 bg-ink text-cream font-semibold py-3 rounded-full hover:bg-gold hover:text-ink transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
