import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

// One slide's image with its own load/error state (each slide is its own
// component instance, so a fallback shown for one image never lingers over
// another).
// fetchPriority/loading: the first image is the PDP's LCP element, so it's
// fetched eagerly at high priority; the rest load lazily as they near view.
const GalleryImage = ({ src, alt, isFirst }) => {
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

  // No spinner: the slide's own bg-stone/20 tint is the placeholder, and the
  // image fades in over it once loaded.
  return (
    <img
      src={src}
      alt={alt}
      fetchPriority={isFirst ? "high" : "auto"}
      loading={isFirst ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageError(true)}
      className={`w-full h-full object-cover transition-opacity duration-300 ${
        imageLoaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

// 44px square arrows. Only on devices with a precise pointer that can hover
// (touch users swipe), and only while the gallery is hovered or an arrow has
// keyboard focus, so they don't sit on the photo.
const arrowClass =
  "absolute top-1/2 -translate-y-1/2 size-11 hidden [@media(hover:hover)_and_(pointer:fine)]:flex items-center justify-center bg-cream/90 hover:bg-cream border border-stone text-charcoal opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 cursor-pointer";

// Product-detail image gallery: a native CSS scroll-snap strip for the main
// image (swipe, trackpad and arrow keys come from the browser, like the
// lookbook Carousel) plus a thumbnail tablist. The active image follows the
// scroll position; arrows and thumbnails scroll the strip to a slide.
// Reduced motion: CSS transitions are zeroed by the site-wide rule in
// index.css, but programmatic smooth scrolling isn't, so it checks
// usePrefersReducedMotion() itself.
const ProductGallery = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const thumbRefs = useRef([]);
  // Slide index an arrow/thumbnail/key scroll is heading to. While set,
  // scroll events don't move the highlight, so a smooth scroll (e.g. the
  // wrap from the first image to the last) doesn't flash every thumbnail in
  // between. Cleared on arrival, or when the shopper takes over the scroll.
  const pendingTargetRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const hasMultiple = images.length > 1;

  // Slides are exactly the track's width, so the active one is the nearest
  // whole multiple of it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !hasMultiple) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const width = track.clientWidth;
      if (!width) return;
      const pending = pendingTargetRef.current;
      if (pending !== null) {
        if (Math.abs(track.scrollLeft - pending * width) < 2) {
          pendingTargetRef.current = null;
        }
        return;
      }
      const index = Math.round(track.scrollLeft / width);
      setActiveIndex(Math.min(Math.max(index, 0), images.length - 1));
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const handleUserScroll = () => {
      pendingTargetRef.current = null;
    };

    const userInputEvents = ["pointerdown", "wheel", "touchstart"];
    track.addEventListener("scroll", handleScroll, { passive: true });
    userInputEvents.forEach((type) =>
      track.addEventListener(type, handleUserScroll, { passive: true }),
    );
    return () => {
      track.removeEventListener("scroll", handleScroll);
      userInputEvents.forEach((type) =>
        track.removeEventListener(type, handleUserScroll),
      );
      if (frame) cancelAnimationFrame(frame);
    };
  }, [hasMultiple, images.length]);

  const goTo = (index) => {
    const wrapped = ((index % images.length) + images.length) % images.length;
    const track = trackRef.current;
    if (track) {
      const left = wrapped * track.clientWidth;
      // Only hold the highlight if a scroll will actually happen (and so
      // a scroll event will arrive to clear the hold).
      pendingTargetRef.current =
        Math.abs(track.scrollLeft - left) < 2 ? null : wrapped;
      track.scrollTo({
        left,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
    // Set immediately so thumbnails respond before the scroll settles.
    setActiveIndex(wrapped);
  };

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  // Handled here (rather than left to native scrolling) so arrow keys wrap
  // around like the buttons do.
  const handleTrackKeyDown = (e) => {
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
    const targets = {
      ArrowLeft: (index - 1 + images.length) % images.length,
      ArrowRight: (index + 1) % images.length,
      Home: 0,
      End: images.length - 1,
    };
    if (!(e.key in targets)) return;
    e.preventDefault();
    goTo(targets[e.key]);
    focusThumb(targets[e.key]);
  };

  return (
    <div role="group" aria-label="Product images">
      <div className="group relative">
        {/* tabIndex: a scrollable region must be keyboard-focusable. The
            scrollbar is hidden; thumbnails and arrows are the visible
            controls. Only the active slide is exposed to assistive tech. */}
        <div
          ref={trackRef}
          role="tabpanel"
          id="gallery-panel"
          aria-labelledby={hasMultiple ? `gallery-thumb-${activeIndex}` : undefined}
          aria-label={hasMultiple ? undefined : productName}
          tabIndex={0}
          onKeyDown={handleTrackKeyDown}
          className="flex aspect-square overflow-x-auto snap-x snap-mandatory overscroll-x-contain border border-stone [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              aria-hidden={index === activeIndex ? undefined : "true"}
              className="relative w-full h-full shrink-0 snap-start snap-always bg-stone/20"
            >
              <GalleryImage
                src={src}
                alt={
                  hasMultiple
                    ? `${productName}, image ${index + 1} of ${images.length}`
                    : productName
                }
                isFirst={index === 0}
              />
            </div>
          ))}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={goPrev}
              className={`${arrowClass} left-3`}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={goNext}
              className={`${arrowClass} right-3`}
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
          className="flex gap-2 mt-3 overflow-x-auto pb-1 snap-x snap-proximity"
        >
          {images.map((src, index) => (
            <button
              type="button"
              key={`${src}-${index}`}
              ref={(el) => (thumbRefs.current[index] = el)}
              role="tab"
              id={`gallery-thumb-${index}`}
              aria-label={`Image ${index + 1} of ${images.length}`}
              aria-selected={index === activeIndex}
              aria-controls="gallery-panel"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => goTo(index)}
              onKeyDown={(e) => handleThumbKeyDown(e, index)}
              className={`shrink-0 snap-start w-16 h-16 border overflow-hidden transition-colors duration-300 cursor-pointer ${
                index === activeIndex
                  ? "border-brass"
                  : "border-stone hover:border-taupe"
              }`}
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
