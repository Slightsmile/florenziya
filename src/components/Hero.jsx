export default function Hero() {
  const scrollToProducts = (e) => {
    e.preventDefault();
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-charcoal text-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-up text-center md:text-left">
          <p className="uppercase tracking-[0.2em] text-gold-light text-xs sm:text-sm font-semibold mb-4">
            New Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-semibold mb-6">
            See the World in
            <br />
            <span className="text-gold-light">Florenziya Style</span>
          </h1>
          <p className="text-cream/80 text-base sm:text-lg max-w-md mx-auto md:mx-0 mb-8">
            Premium sunglasses crafted for bold personalities. Elevate every
            look with frames designed for Bangladesh's fashion-forward
            generation.
          </p>
          <button
            onClick={scrollToProducts}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold/20"
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </button>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
          <img
            src="/products/black-funky.webp"
            alt="Florenziya sunglasses"
            className="relative rounded-3xl w-full h-72 sm:h-96 object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
