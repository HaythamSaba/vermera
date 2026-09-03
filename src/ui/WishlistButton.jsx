import { useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { EASE } from "../utils/motion";

const MotionSpan = motion.span;

// Shared wishlist heart toggle used on both the product-card quick-add
// overlay (ProductItem) and the product detail page (ProductPage) — same
// bounce-on-toggle behavior in both places, only the button chrome
// (className/iconSize) differs per call site.
//
// The fill/color swap is instant (a plain className change, synced with the
// click since Redux updates synchronously) — the scale bounce on top of it
// is deliberately shaped differently for add vs. remove so the reverse case
// doesn't just read as the fill animation played backwards: adding overshoots
// past 1 (a "pop"), removing undershoots below 1 (a brief "deflate") before
// both settle back to 1.
const WishlistButton = ({
  isActive,
  onToggle,
  className = "",
  iconSize = 18,
}) => {
  const [scope, animate] = useAnimate();
  const prefersReducedMotion = useReducedMotion();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      // Skip the very first render — this should only play on an actual
      // toggle, never on mount (e.g. a card that loads already wishlisted).
      mountedRef.current = true;
      return;
    }
    if (prefersReducedMotion) return;

    animate(
      scope.current,
      { scale: isActive ? [1, 1.25, 1] : [1, 0.82, 1] },
      { duration: isActive ? 0.28 : 0.22, ease: EASE.out },
    );
  }, [isActive, animate, prefersReducedMotion, scope]);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isActive}
      className={className}
    >
      <MotionSpan ref={scope} className="inline-flex">
        <Heart
          className={isActive ? "fill-brass text-brass" : ""}
          size={iconSize}
          aria-hidden="true"
        />
      </MotionSpan>
    </button>
  );
};

export default WishlistButton;
