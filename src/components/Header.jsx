import { useCart } from "../context/CartContext";

export default function Header() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-3 items-center h-16 sm:h-20">
        <a href="/" className="flex items-center justify-start">
          <img src="/logo-mark.png" alt="" width={56} height={56} className="h-10 sm:h-14 object-contain" />
        </a>

        <a href="/" className="flex items-center justify-center" aria-label="Florenziya home">
          <img src="/logo-wordmark.png" alt="Florenziya" width={120} height={24} className="h-5 sm:h-6 object-contain" />
        </a>

        <div className="flex items-center justify-end">
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-sand transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.693 2.595-7.151.133-.544-.263-1.099-.822-1.099H5.106M7.5 14.25L5.106 5.272M6 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18.75 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span aria-hidden="true" className="absolute -top-1 -right-1 bg-gold text-white text-[11px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}


