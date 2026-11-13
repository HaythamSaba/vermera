import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

// Lookbook carousel on a native CSS scroll-snap track: swipe/trackpad/
// keyboard scrolling come from the browser, each look is rendered exactly
// once (no looping clones in the accessibility tree or extra image
// requests), and slide sizes are responsive classes rather than
// matchMedia-driven pixel values. Prev/next/dots scroll the track to a real
// slide; the active dot follows the scroll position.
const SLIDE_WIDTH = "w-[240px] sm:w-[330px] lg:w-[404px]";

const Carousel = ({ looks }) => {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // The active look is the slide whose left edge is nearest the track's
  // scroll position (or the last one once scrolled to the end, since the
  // final slides can't snap to the start).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const atEnd =
        track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      if (atEnd) {
        setActiveIndex(looks.length - 1);
        return;
      }
      const offsets = slideRefs.current.map(
        (slide) => slide.offsetLeft - track.offsetLeft,
      );
      const nearest = offsets.reduce(
        (best, offset, index) =>
          Math.abs(offset - track.scrollLeft) <
          Math.abs(offsets[best] - track.scrollLeft)
            ? index
            : best,
        0,
      );
      setActiveIndex(nearest);
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [looks.length]);

  const goTo = (index) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    // Set immediately so the dots respond even when the target can't be
    // scrolled to the start (the last slides on wide screens).
    setActiveIndex(index);
  };

  const handlePrevious = () =>
    goTo(activeIndex === 0 ? looks.length - 1 : activeIndex - 1);
  const handleNext = () =>
    goTo(activeIndex === looks.length - 1 ? 0 : activeIndex + 1);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Lookbook"
      className="relative"
    >
      {/* tabIndex: a scrollable region must be keyboard-focusable so arrow
          keys can scroll it. The scrollbar is hidden because the buttons
          and dots below are the visible controls. */}
      <div
        ref={trackRef}
        tabIndex={0}
        className="flex gap-4 sm:gap-8 lg:gap-12 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {looks.map((look, index) => {
          const number = String(index + 1).padStart(2, "0");
          return (
            <div
              key={look.categorySlug}
              ref={(el) => (slideRefs.current[index] = el)}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${looks.length}: ${look.title}`}
              className={`${SLIDE_WIDTH} shrink-0 snap-start relative aspect-4/5 bg-stone/20`}
            >
              <img
                src={look.image}
                srcSet={`${look.image.replace(".webp", "-480.webp")} 480w, ${look.image} 900w`}
                // Matches SLIDE_WIDTH at each breakpoint.
                sizes="(min-width: 1024px) 404px, (min-width: 640px) 330px, 240px"
                alt={look.alt}
                width="480"
                height="600"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-babyblue/60 backdrop-blur-sm p-4 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-3 mb-1 text-espresso text-sm font-medium">
                    <span>{number}</span>
                    <span aria-hidden="true">—</span>
                    <span>{look.category}</span>
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
                    {look.title}
                  </h3>
                </div>
                <Link
                  to={`/products?category=${look.categorySlug}`}
                  aria-label={`Shop ${look.category}`}
                  className="shrink-0 bg-brass hover:bg-brass/80 text-charcoal p-3 transition-colors inline-flex items-center justify-center"
                >
                  <ChevronRight className="w-6 h-6" aria-hidden="true" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center lg:justify-start gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous look"
          className="bg-cream hover:bg-stone/40 p-3 rounded-full shadow-soft transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-brass-ink" aria-hidden="true" />
        </button>
        <div role="group" aria-label="Choose a look" className="flex gap-1">
          {looks.map((look, index) => (
            <button
              key={look.categorySlug}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to look ${index + 1}: ${look.title}`}
              aria-pressed={activeIndex === index}
              className={`cursor-pointer p-3 rounded-full ${
                activeIndex === index ? "border border-brass" : ""
              }`}
            >
              <span
                className={`block w-3 h-3 rounded-full ${
                  activeIndex === index ? "bg-brass" : "bg-stone"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next look"
          className="bg-cream hover:bg-stone/40 p-3 rounded-full shadow-soft transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-brass-ink" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
