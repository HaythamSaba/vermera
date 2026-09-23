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
    <p
      ref={parallaxRef}
      aria-hidden="true"
      className="absolute top-[2%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[200px] text-taupe/40 text-center tracking-widest select-none pointer-events-none -z-10"
    >
      VERMERA
    </p>
  );
};

export default FooterParallaxText;
