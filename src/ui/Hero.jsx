import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ImageOff } from "lucide-react";
import { m } from "framer-motion";
import MainButton from "./MainButton";
import useParallax from "../hooks/useParallax";
import { DURATION, EASE } from "../utils/motion";

const MotionP = m.p;
const MotionH1 = m.h1;
const MotionDiv = m.div;

// Above-the-fold copy enters as whole blocks (fade + 12px rise, 600ms), all
// within 200ms of each other, so the headline and CTA are readable almost
// immediately instead of after a ~2s per-letter reveal. Reduced motion is
// handled by AppLayout's MotionConfig(reducedMotion="user"): the rise is
// dropped and only the opacity fade remains.
const heroEntrance = (delayMs = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: DURATION.reveal / 1000,
    delay: delayMs / 1000,
    ease: EASE.out,
  },
});

const Hero = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  // The site's one parallax (the footer watermark is static).
  const parallaxRef = useRef(null);
  const parallaxStyle = useParallax(parallaxRef, { speed: 0.1 });

  return (
    // While the photo loads, the section's own bg-stone/30 tint is the
    // placeholder: a calm tinted block rather than a loading spinner.
    // svh, not vh: on mobile, 100vh is measured as if the browser toolbars
    // were hidden, so on first load the bottom of the hero (the mobile CTA)
    // sat under the toolbar and the height jumped as the toolbars
    // collapsed. 100svh is the stable toolbars-visible height, and it equals
    // 100vh on desktop, so desktop layout is unchanged.
    <section className="relative w-full h-[calc(100svh-40px)] overflow-hidden bg-stone/30">
      {imageError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-stone/20 text-taupe">
          <div className="text-center px-6">
            <ImageOff
              size={40}
              className="mx-auto mb-2 opacity-60"
              aria-hidden="true"
            />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      ) : (
        <MotionDiv
          ref={parallaxRef}
          style={parallaxStyle}
          className="absolute inset-0 scale-[1.15]"
        >
          {/* Art direction, not resolution switching: the photo is drawn
              >=1570 CSS px wide on every screen (object-cover in a ~100vh
              box), so the full 1672px file is always needed for width. Tall
              screens only ever see its centre, so they get a centre crop
              that renders identically at ~1/4 of the bytes. Keep these
              sources in sync with the preloads in index.html. */}
          <picture className="block w-full h-full">
            <source
              media="(max-aspect-ratio: 3/4)"
              srcSet="/images/hero-image-portrait.webp"
              width="780"
              height="941"
            />
            <img
              src="/images/hero-image.webp"
              width="1672"
              height="941"
              alt="A softly styled flatlay of a leather bag, watch, necklace, folded knit, sunglasses, and amber bottles against a sunlit travertine wall, reflecting Vermera's quiet, considered aesthetic."
              fetchPriority="high"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </picture>
        </MotionDiv>
      )}

      <div className="relative z-10 h-full flex mt-10 md:mt-0 md:items-center container-foundation">
        <div className="flex flex-col max-w-xl">
          <div className="flex flex-col">
            <MotionP
              {...heroEntrance(0)}
              className={`font-semibold text-sm uppercase tracking-[3px] mb-4 ${imageError || !imageLoaded ? "text-taupe" : "text-ivory"}`}
            >
              The Vermera Edit
            </MotionP>
            <MotionH1
              {...heroEntrance(0)}
              className="font-serif text-espresso font-semibold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
            >
              Timeless Pieces,
              <br /> Thoughtfully
              <br /> Chosen
            </MotionH1>
          </div>
          <div className="flex flex-col mt-auto mb-30 md:mb-0 md:mt-0">
            <MotionP
              {...heroEntrance(100)}
              className="text-espresso text-lg leading-relaxed mb-10 max-w-md"
            >
              A curated edit of bags, jewellery, watches, and beauty essentials,
              each piece selected for its quality and quiet character.
            </MotionP>
            <MotionDiv {...heroEntrance(200)}>
              <MainButton
                content="Shop the Collection"
                variant="primary"
                onClick={() => navigate("/products")}
              />
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
