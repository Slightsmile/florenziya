import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="uppercase tracking-[0.2em] text-gold text-xs font-semibold mb-3">404</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-3">Page Not Found</h1>
      <p className="text-ink/60 mb-8">That page doesn't exist. Try the products instead.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-ink text-cream font-semibold px-8 py-3 rounded-full hover:bg-gold hover:text-ink transition-colors"
      >
        Back to Shop
      </Link>
    </section>
  );
}
