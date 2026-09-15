import { Link } from "react-router";
import { motion } from "framer-motion";
import { navLinkClass } from "./HeaderDesktopNav";
import { EASE } from "../utils/motion";
import BrandMark from "./BrandMark";

// Matches the codebase convention elsewhere (Header, CartOverview) —
// aliasing to a plain identifier before using it as a JSX tag is what lets
// no-unused-vars recognize the import as used.
const MotionSpan = motion.span;

const SIZE_CLASSES = {
  primary: "text-4xl",
  default: "text-3xl",
  compact: "text-2xl",
};

// Paired with SIZE_CLASSES' wordmark sizes (36px / 24px) — picked by eye
// against the live header/footer, not the font-size 1:1, since the mark's
// bold ribbon strokes read heavier than the wordmark's x-height at an
// equal pixel size.
const MARK_SIZE_CLASSES = {
  primary: "h-9",
  default: "h-7",
  compact: "h-5",
};

// Vermera's brand mark — an abstract calligraphic "V" (BrandMark.jsx) sits
// beside the wordmark (Fraunces, medium weight, slightly tracked-out)
// rather than replacing it, per the approved mark lockup. The wordmark's
// color is intentionally not set here — it inherits `currentColor` from
// whichever text-* class the header/footer already applies (text-charcoal
// on the light primary header and footer, text-cream on the dark floating
// header), so this one component renders correctly in every context it's
// used in. BrandMark keeps its own fixed brass tone regardless of context —
// that's its one "accent" role here, per the design brief — so only the
// wordmark needs to track the surrounding surface.
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
const Logo = ({
  size = "primary",
  animate = false,
  className = "",
  onClick,
}) => {
  const lockup = (
    <span className="inline-flex items-center">
      <BrandMark className={`${MARK_SIZE_CLASSES[size]} w-auto shrink-0`} />
      <span
        className={`hidden md:inline font-serif font-medium tracking-[0.04em] ${SIZE_CLASSES[size]}`}
      >
        ermera
      </span>
    </span>
  );

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`${navLinkClass} inline-flex items-center ${className}`}
    >
      {animate ? (
        <MotionSpan
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE.out }}
        >
          {lockup}
        </MotionSpan>
      ) : (
        lockup
      )}
    </Link>
  );
};

export default Logo;
