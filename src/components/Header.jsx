import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { itemCount, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const goToTop = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-3 items-center h-16 sm:h-20">
        <a href="/" onClick={goToTop} className="flex items-center justify-start">
          <img src="/logo.png" alt="Florenziya" className="h-9 sm:h-11 object-contain" />
        </a>

        <a href="/" onClick={goToTop} className="flex items-center justify-center">
          <img src="/logo-text.png" alt="Florenziya" className="h-6 sm:h-7 object-contain" />
        </a>

        <div className="flex items-center justify-end">
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-sand transition-colors"
            aria-label="Open cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.693 2.595-7.151.133-.544-.263-1.099-.822-1.099H5.106M7.5 14.25L5.106 5.272M6 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18.75 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
