import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-sand">
      <div className="relative overflow-hidden aspect-square bg-sand">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-ink mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-ink/60 mb-3 line-clamp-2">{product.description}</p>
        )}
        <p className="text-gold font-bold text-lg mb-4">৳{product.price.toLocaleString()}</p>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-sand rounded-full overflow-hidden">
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

          <button
            onClick={handleAdd}
            className={`flex-1 font-semibold py-2.5 rounded-full transition-all ${
              added
                ? "bg-green-600 text-white"
                : "bg-ink text-cream hover:bg-gold hover:text-ink"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
