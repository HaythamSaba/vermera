import { Link } from "react-router";
import { motion } from "framer-motion";
import { navLinkClass } from "./HeaderDesktopNav";
import { EASE } from "../utils/motion";

// Matches the codebase convention elsewhere (Header, CartOverview) —
// aliasing to a plain identifier before using it as a JSX tag is what lets
// no-unused-vars recognize the import as used.
const MotionSpan = motion.span;

const SIZE_CLASSES = {
  default: "text-4xl",
  compact: "text-2xl",
};

// Vermera's brand mark — a restrained typographic wordmark (Fraunces,
// medium weight, slightly tracked-out) rather than an icon+text lockup:
// this is a quiet-luxury fashion brand, and an invented pictorial symbol
// would work against that positioning. Color is intentionally not set here
// — it inherits `currentColor` from whichever text-* class the header/
// footer already applies (text-charcoal on the light primary header and
// footer, text-cream on the dark floating header), so this one component
// renders correctly in every context it's used in. The brass underline-on-
// hover (the exact treatment HeaderDesktopNav's links already use) is
// brass's one "accent" role here, per the design brief.
//
// `size`: "default" is the full-width primary header's 36px; "compact" is
// the condensed floating header's and the footer's 24px — both stayed
// fully legible in testing, so no separate monogram treatment was needed.
// `animate`: a single, short fade-and-rise on mount, via framer-motion
// rather than the site's GSAP-driven Reveal — Reveal pulls in GSAP, which
// is otherwise only reachable through lazy route chunks; importing it here
// would drag all of GSAP into the eager main bundle (confirmed: +124 KB)
// just for a decorative one-time fade. framer-motion costs nothing extra
// here since HeaderFloating already loads it eagerly. Intended for the
// primary header only, which truly mounts once per page load; the floating
// header mounts/unmounts on every scroll-threshold crossing, where
// replaying this each time would read as fidgety rather than quiet.
const Logo = ({ size = "default", animate = false, className = "" }) => {
  const text = (
    <span
      className={`font-serif font-medium tracking-[0.04em] ${SIZE_CLASSES[size]}`}
    >
      Vermera
    </span>
  );

  return (
    <Link
      to="/"
      className={`${navLinkClass} inline-flex items-center ${className}`}
    >
      {animate ? (
        <MotionSpan
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE.out }}
        >
          {text}
        </MotionSpan>
      ) : (
        text
      )}
    </Link>
  );
};

export default Logo;
