import { useEffect, useRef } from "react";

const SWIPE_THRESHOLD = 40;

export default function ImageLightbox({ images, activeImage, onChange, onClose, alt }) {
  const touchStartX = useRef(null);
  const activeIdx = Math.max(0, images.indexOf(activeImage));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange(images[(activeIdx + 1) % images.length]);
      if (e.key === "ArrowLeft") onChange(images[(activeIdx - 1 + images.length) % images.length]);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onChange, images, activeIdx]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && images.length > 1) {
      if (deltaX < 0) onChange(images[(activeIdx + 1) % images.length]);
      else onChange(images[(activeIdx - 1 + images.length) % images.length]);
    }
    touchStartX.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 bg-ink/90 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-cream transition-colors focus:outline-none focus:ring-2 focus:ring-gold-light"
        aria-label="Close photo viewer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="max-w-3xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={activeImage}
          alt={alt}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl select-none"
          draggable={false}
        />

        {images.length > 1 && (
          <div className="flex gap-2 mt-5">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => onChange(img)}
                aria-current={i === activeIdx}
                aria-label={`View photo ${i + 1}`}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-light ${
                  i === activeIdx ? "border-gold-light" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
