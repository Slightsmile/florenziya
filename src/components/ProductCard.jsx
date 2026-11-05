import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import ImageLightbox from "./ImageLightbox";

const AUTO_ROTATE_MS = 3500;
const SWIPE_THRESHOLD = 40;

export default function ProductCard({ product }) {
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const gallery = product.images?.length ? product.images : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const activeImage = gallery[activeIndex];

  useEffect(() => {
    if (gallery.length <= 1 || paused || lightboxOpen) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % gallery.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [gallery.length, paused, lightboxOpen]);

  const goTo = (index) => {
    setActiveIndex((index + gallery.length) % gallery.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
      setPaused(true);
    }
    touchStartX.current = null;
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1500);
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
          className="block w-full h-full cursor-zoom-in"
          aria-label={`Enlarge ${product.name} photo`}
        >
          <img
            src={activeImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {gallery.map((img, i) => (
              <button
                key={img}
                onClick={() => {
                  goTo(i);
                  setPaused(true);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === activeIndex ? "bg-ink" : "bg-ink/30 hover:bg-ink/50"
                }`}
                aria-label="Show image"
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="font-serif text-base sm:text-xl font-semibold text-ink mb-1 truncate">
          {product.name}
        </h3>
        {product.description && (
          <p className="hidden sm:block text-sm text-ink/60 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <p className="text-gold font-bold text-base sm:text-lg mb-3 sm:mb-4">
          ৳{product.price.toLocaleString()}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="order-1 sm:order-1 flex items-center justify-between sm:justify-start border border-sand rounded-full overflow-hidden w-full sm:w-auto">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex-1 sm:flex-none sm:w-9 h-10 sm:h-9 flex items-center justify-center text-ink hover:bg-sand transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="flex-1 sm:flex-none sm:w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex-1 sm:flex-none sm:w-9 h-10 sm:h-9 flex items-center justify-center text-ink hover:bg-sand transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`order-2 sm:order-2 flex-1 h-10 sm:h-auto font-semibold py-0 sm:py-2.5 text-sm sm:text-base rounded-full transition-all ${
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
