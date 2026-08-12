import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CAROUSEL_TIERS = {
  base: { active: { w: 240, h: 330 }, inactive: { w: 210, h: 290 }, gap: 16 },
  sm: { active: { w: 330, h: 440 }, inactive: { w: 300, h: 400 }, gap: 32 },
  lg: { active: { w: 404, h: 582 }, inactive: { w: 372, h: 486 }, gap: 48 },
};

function useCarouselTier() {
  const [tier, setTier] = useState("base");

  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");

    const update = () => {
      if (mqLg.matches) setTier("lg");
      else if (mqSm.matches) setTier("sm");
      else setTier("base");
    };

    update();
    mqLg.addEventListener("change", update);
    mqSm.addEventListener("change", update);
    return () => {
      mqLg.removeEventListener("change", update);
      mqSm.removeEventListener("change", update);
    };
  }, []);

  return tier;
}
const Carousel = ({ children, clothes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tier = useCarouselTier();
  const { active, inactive, gap } = CAROUSEL_TIERS[tier];
  const pitch = inactive.w + gap;

  const handleNext = () => {
    const isLastSlide = currentIndex === children.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handlePrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? children.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Create extended array to show images in a loop
  const extendedChildren = [...children, ...children, ...children];
  const offset = children.length;

  return (
    <div className="relative">
      <div className="">
        <div
          className="flex transition-transform duration-500 items-start"
          style={{
            gap: `${gap}px`,
            transform: `translateX(-${(currentIndex + offset) * pitch}px)`,
          }}
        >
          {extendedChildren.map((child, index) => {
            const actualIndex = index % children.length;
            const isActive = index === currentIndex + offset;
            const size = isActive ? active : inactive;

            return (
              <div
                key={index}
                className="shrink-0 transition-all duration-500 relative"
                style={{ width: size.w, height: size.h }}
              >
                {child}
                {/* Overlay Card - Only show on active slide */}
                {isActive && clothes && (
                  <div className="absolute bottom-6 left-6 right-6 lg:right-auto bg-white/90 backdrop-blur-sm p-4 ">
                    <div className="flex items-center gap-3 mb-2 text-gray-600 text-sm">
                      <span className="font-medium text-base">
                        {"0"}
                        {clothes[actualIndex].number}
                      </span>
                      <span>—</span>
                      <span className="font-medium text-base">
                        {clothes[actualIndex].category}
                      </span>
                    </div>
                    <h3 className="text-3xl font-semibold text-gray-800">
                      {clothes[actualIndex].title}
                    </h3>
                    <button className="absolute bottom-0 right-0 lg:-right-12 bg-primary-400 hover:bg-primary-400/80 text-white p-3 transition-colors inline-flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14m-7-7l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-1 lg:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors z-10"
      >
        <ChevronLeft className="w-6 h-6 text-[#B88E2F]" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-1 lg:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors z-10"
      >
        <ChevronRight className="w-6 h-6 text-[#B88E2F]" />
      </button>

      {/* Indicator Dots */}
      <div className="mt-4 lg:mt-0 lg:absolute lg:left-[440px] lg:bottom-0 w-full lg:w-fit">
        <div className="flex justify-center lg:justify-start gap-3">
          {children.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`cursor-pointer p-3 rounded-full ${
                currentIndex === index ? "border border-[#B88E2F]" : ""
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-[#B88E2F]" : "bg-gray-300"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;