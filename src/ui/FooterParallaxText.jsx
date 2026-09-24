import useParallax from "../hooks/useParallax";

// The oversized "VERMERA" watermark behind the footer content. Split into
// its own module (lazy-loaded from Footer.jsx via React.lazy) rather than
// having Footer import useParallax directly — GSAP/ScrollTrigger is
// otherwise only ever reachable through lazy route chunks (Hero, About,
// etc.), and Footer renders on every route via AppLayout, so a direct
// import here would drag all of GSAP into the eager main bundle just for
// this decorative flourish.
const FooterParallaxText = () => {
  const parallaxRef = useParallax({ speed: 0.12, scrub: 0.6 });

  return (
    // Fluid font-size, not a fixed 200px: at 200px "VERMERA" renders ~1018px
    // wide in Fraunces, well past any phone/tablet viewport, and nothing in
    // the ancestor chain clips overflow-x — a fixed size caused real
    // horizontal page-scroll on mobile. clamp(3.25rem,14vw,12.5rem) keeps
    // ~30px+ of margin down to a 320px viewport while still hitting the
    // original 200px look from ~1428px viewport up (unchanged on desktop).
    <p
      ref={parallaxRef}
      aria-hidden="true"
      className="absolute top-[12%] md:top-[2%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(3.25rem,14vw,12.5rem)] text-taupe/40 text-center tracking-widest select-none pointer-events-none -z-10 whitespace-nowrap"
    >
      VERMERA
    </p>
  );
};

export default FooterParallaxText;
