import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Footer() {
  const navigate = useNavigate();
  const { closeCart } = useCart();
  const currentYear = new Date().getFullYear();

  const goToProducts = (e) => {
    e.preventDefault();
    closeCart();
    navigate("/", { state: { scrollToProducts: true } });
    // Let ScrollToTop + Home handle scroll after navigation.
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  return (
    <footer className="bg-charcoal text-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <img src="/logo-full-tight.png" alt="Florenziya" width={200} height={80} loading="lazy" className="h-20 mb-4 brightness-0 invert" />
          <p className="text-cream/70 text-sm max-w-xs">
            Florenziya brings premium, fashion-forward sunglasses to Bangladesh —
            crafted for those who dare to stand out.
          </p>
        </div>

        <div className="sm:text-center">
          <h3 className="font-semibold text-gold-light mb-3">Quick Links</h3>
          <ul className="space-y-2 text-cream/70 text-sm">
            <li>
              <a href="/#products" onClick={goToProducts} className="hover:text-gold-light transition-colors focus:outline-none focus:ring-2 focus:ring-gold rounded">
                Products
              </a>
            </li>
          </ul>
        </div>

        <div className="sm:text-right">
          <h3 className="font-semibold text-gold-light mb-3">Follow Us</h3>
          <div className="flex gap-3 sm:justify-end">
            <a
              href="https://www.facebook.com/florenziya.official"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Florenziya on Facebook"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-cream/10 hover:bg-gold hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/shop.florenziya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Florenziya on Instagram"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-cream/10 hover:bg-gold hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 1.802c-3.15 0-3.502.012-4.738.069-2.265.103-3.29 1.146-3.393 3.393-.057 1.235-.068 1.587-.068 4.738 0 3.15.012 3.503.068 4.738.103 2.245 1.126 3.29 3.393 3.393 1.236.057 1.587.069 4.738.069 3.151 0 3.503-.012 4.738-.069 2.264-.103 3.29-1.146 3.393-3.393.057-1.235.069-1.587.069-4.738 0-3.151-.012-3.502-.069-4.738-.103-2.247-1.129-3.29-3.393-3.393-1.235-.057-1.587-.069-4.738-.069zm0 3.064a5.971 5.971 0 110 11.942 5.971 5.971 0 010-11.942zm0 1.802a4.17 4.17 0 100 8.338 4.17 4.17 0 000-8.338zm6.406-1.95a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-cream/50 text-xs">
        © {currentYear} Florenziya. All rights reserved.
      </div>
    </footer>
  );
}
