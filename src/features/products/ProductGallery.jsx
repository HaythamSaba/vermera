import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

// Large primary image with its own load/error state. Keying this component
// by `src` at the call site (rather than resetting state in an effect) makes
// React remount it — and so reset imageLoaded/imageError — whenever the
// active image changes, so a fallback shown for one image never lingers
// over the next.
const GalleryPrimaryImage = ({ src, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-taupe">
        <div className="text-center px-6">
          <ImageOff size={40} className="mx-auto mb-2 opacity-60" aria-hidden="true" />
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-stone border-t-brass rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
};

// Product-detail image gallery: one large primary image plus a thumbnail
// strip. All motion here is plain CSS transitions (opacity fade on image
// swap, border/opacity on thumbnail active state) — no observer/JS-driven
// animation — so the site-wide `prefers-reduced-motion` rule in index.css
// (which zeroes every transition/animation duration) already neutralizes it
// without this component needing its own reduced-motion branching.
const ProductGallery = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasMultiple = images.length > 1;
  const activeSrc = images[activeIndex];
  const thumbRefs = useRef([]);

  const goTo = (index) => {
    setActiveIndex(((index % images.length) + images.length) % images.length);
  };

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const handlePanelKeyDown = (e) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const focusThumb = (index) => thumbRefs.current[index]?.focus();

  const handleThumbKeyDown = (e, index) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + images.length) % images.length;
      goTo(prev);
      focusThumb(prev);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % images.length;
      goTo(next);
      focusThumb(next);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
      focusThumb(0);
    } else if (e.key === "End") {
      e.preventDefault();
      const last = images.length - 1;
      goTo(last);
      focusThumb(last);
    }
  };

  return (
    <div role="group" aria-label="Product images">
      <div
        className="relative aspect-square bg-stone/20 border border-stone overflow-hidden"
        role="tabpanel"
        id="gallery-panel"
        tabIndex={0}
        onKeyDown={handlePanelKeyDown}
      >
        <GalleryPrimaryImage key={activeIndex} src={activeSrc} alt={productName} />

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-charcoal/60 hover:bg-charcoal/80 text-ivory flex items-center justify-center transition-colors duration-300"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-charcoal/60 hover:bg-charcoal/80 text-ivory flex items-center justify-center transition-colors duration-300"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div
          role="tablist"
          aria-label="Product image thumbnails"
          className="flex gap-2 mt-3 overflow-x-auto pb-1"
          style={{ scrollSnapType: "x proximity" }}
        >
          {images.map((src, index) => (
            <button
              type="button"
              key={`${src}-${index}`}
              ref={(el) => (thumbRefs.current[index] = el)}
              role="tab"
              id={`gallery-thumb-${index}`}
              aria-selected={index === activeIndex}
              aria-controls="gallery-panel"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => goTo(index)}
              onKeyDown={(e) => handleThumbKeyDown(e, index)}
              className={`shrink-0 w-16 h-16 border overflow-hidden transition-colors duration-300 ${
                index === activeIndex
                  ? "border-brass"
                  : "border-stone hover:border-taupe"
              }`}
              style={{ scrollSnapAlign: "start" }}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
