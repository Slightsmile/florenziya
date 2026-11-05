import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import ImageLightbox from "./ImageLightbox";
import { formatBDT, MAX_QUANTITY_PER_ITEM } from "../lib/money";

const AUTO_ROTATE_MS = 3500;
const SWIPE_THRESHOLD = 40;

export default function ProductCard({ product }) {
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const gallery = product.images?.length ? product.images : [product.image];
  const activeImage = gallery[activeIndex];

  useEffect(() => {
    if (gallery.length <= 1 || paused || lightboxOpen || prefersReducedMotion) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % gallery.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [gallery.length, paused, lightboxOpen, prefersReducedMotion]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const goTo = (index) => {
    setActiveIndex((index + gallery.length) % gallery.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
    touchStartX.current = null;
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    setQuantity(1);
    setAdded(true);
    openCart();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-sand">
      <div
        className="relative overflow-hidden aspect-square bg-sand"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={() => setLightboxOpen(true)}
          className="block w-full h-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-gold focus:ring-inset"
          aria-label={`Enlarge ${product.name} photo`}
        >
          <img
            src={activeImage}
            alt={product.name}
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {gallery.map((img, i) => (
              <button
                key={img}
                onClick={() => {
                  goTo(i);
                  setPaused(true);
                }}
                aria-current={i === activeIndex}
                className={`w-5 h-5 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold ${
                  i === activeIndex ? "bg-ink" : "bg-ink/30 hover:bg-ink/50"
                }`}
                aria-label={`Show image ${i + 1} of ${gallery.length} for ${product.name}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col">
        <h3 className="font-serif text-base sm:text-xl font-semibold text-ink mb-1 truncate" title={product.name}>
          {product.name}
        </h3>
        {product.description && (
          <p className="hidden sm:block text-sm text-ink/60 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <p className="text-gold font-bold text-base sm:text-lg mb-4">
          {formatBDT(product.price)}
        </p>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-stretch gap-2">
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start border border-sand rounded-full overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex-1 sm:flex-none sm:w-9 h-10 sm:h-9 flex items-center justify-center text-ink hover:bg-sand transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              −
            </button>
            <span className="flex-1 sm:flex-none sm:w-7 text-center font-medium text-sm" aria-label={`Quantity: ${quantity}`}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY_PER_ITEM, q + 1))}
              className="flex-1 sm:flex-none sm:w-9 h-10 sm:h-9 flex items-center justify-center text-ink hover:bg-sand transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label={`Increase quantity of ${product.name}`}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`w-full sm:w-auto sm:flex-1 h-10 sm:h-auto sm:py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all flex items-center justify-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
              added
                ? "bg-green-600 text-white"
                : "bg-ink text-cream hover:bg-gold hover:text-ink"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={gallery}
          activeImage={activeImage}
          onChange={(img) => goTo(gallery.indexOf(img))}
          onClose={() => setLightboxOpen(false)}
          alt={product.name}
        />
      )}
    </div>
  );
}
