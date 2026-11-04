import { useState } from "react";
import { useCart } from "../context/CartContext";
import ImageLightbox from "./ImageLightbox";

export default function ProductCard({ product }) {
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const gallery = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-sand">
      <div className="relative overflow-hidden aspect-square bg-sand">
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
            {gallery.map((img) => (
              <button
                key={img}
                onClick={() => setActiveImage(img)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  activeImage === img ? "bg-ink" : "bg-ink/30 hover:bg-ink/50"
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
          <button
            onClick={handleAdd}
            className={`order-1 sm:order-2 flex-1 font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-full transition-all ${
              added
                ? "bg-green-600 text-white"
                : "bg-ink text-cream hover:bg-gold hover:text-ink"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>

          <div className="order-2 sm:order-1 flex items-center justify-center sm:justify-start border border-sand rounded-full overflow-hidden self-center sm:self-auto">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-ink hover:bg-sand transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 flex items-center justify-center text-ink hover:bg-sand transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={gallery}
          activeImage={activeImage}
          onChange={setActiveImage}
          onClose={() => setLightboxOpen(false)}
          alt={product.name}
        />
      )}
    </div>
  );
}
