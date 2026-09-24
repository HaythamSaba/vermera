import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageOff } from "lucide-react";
import MainButton from "./MainButton";
import Reveal from "./Reveal";
import useParallax from "../hooks/useParallax";
import { STAGGER_MS } from "../utils/motion";
import useTextReveal from "../hooks/useTextReveal";

const Hero = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  // Applied to a wrapper around the <img>, not the image itself, so this
  // doesn't fight the image's own hover/CSS transforms (GSAP's inline
  // transform would otherwise always win over a CSS class). scale-[1.15]
  // gives the wrapper buffer room so the parallax translate never reveals
  // empty space at the section's edges.
  const parallaxRef = useParallax({ speed: 0.1, scrub: 0.8 });

  const { ref: nameRef } = useTextReveal({ staggerMs: 40 });

  return (
    // w-full, not w-screen: this section already sits in an unconstrained,
    // unpadded ancestor chain (MainPageContent -> main -> AppLayout), so
    // w-full fills the exact same visual width — but unlike w-screen
    // (100vw), it doesn't include the vertical scrollbar's gutter, which
    // would otherwise push the section a few pixels past the real
    // viewport edge and force the whole page to scroll horizontally.
    <section className="relative w-full h-[calc(100vh-90px)] overflow-hidden bg-stone/30">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-stone border-t-brass rounded-full animate-spin" />
        </div>
      )}

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
        <div ref={parallaxRef} className="absolute inset-0 scale-[1.15]">
          <img
            src="/images/test-image.png"
            alt="A softly styled flatlay of a leather bag, watch, necklace, folded knit, sunglasses, and amber bottles against a sunlit travertine wall, reflecting Vermera's quiet, considered aesthetic."
            fetchPriority="high"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      )}

      <div className="relative z-10 h-full flex mt-10 md:mt-0 md:items-center container-foundation">
        <div className="flex flex-col max-w-xl">
          <div className="flex flex-col">
            <Reveal
              as="p"
              delay={0}
              className="font-semibold text-sm uppercase tracking-[3px] text-brass-ink mb-4"
            >
              The Vermera Edit
            </Reveal>
            <h1
              ref={nameRef}
              className="font-serif text-espresso font-semibold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
            >
              Timeless Pieces,
              <br /> Thoughtfully
              <br /> Chosen
            </h1>
          </div>
          <div className="flex flex-col mt-auto mb-30 md:mb-0 md:mt-0">
            <Reveal
              as="p"
              delay={STAGGER_MS * 6}
              className="text-taupe text-lg leading-relaxed mb-10 max-w-md"
            >
              A curated edit of bags, jewelry, watches, and beauty essentials,
              each piece selected for its quality and quiet character.
            </Reveal>
            <Reveal delay={STAGGER_MS * 8}>
              <MainButton
                content="Shop the Collection"
                variant="primary"
                onClick={() => navigate("/products")}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
