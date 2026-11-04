import { products } from "../data/products";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <section id="products" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.2em] text-gold text-xs sm:text-sm font-semibold mb-3">
          Our Collection
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink">
          Find Your Signature Look
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
