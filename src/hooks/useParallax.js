import { useScroll, useSpring, useTransform } from "framer-motion";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

// Subtle scroll-linked parallax on a single element (typically an image
// wrapper — apply to a wrapper around an <img>, not the <img> itself, so any
// hover/CSS transform on the image stays independent). `speed` is the
// fraction of the element's own height it travels across its scroll range —
// keep small (0.08-0.2), and give the element some CSS oversize (e.g.
// scale-[1.15]) so it never reveals empty edges. The outer container should
// have overflow-hidden, and the element must be positioned (non-static).
//
// Pass the motion element's ref (owned by the caller); returns the `style`
// to spread onto that same element. A style-bound motion value
// is not governed by MotionConfig's reducedMotion, so reduced motion is
// checked here and the parallax is skipped entirely (it's pure decoration).
export default function useParallax(ref, { speed = 0.1 } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Light smoothing so the image trails the scroll slightly.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const y = useTransform(smoothProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return prefersReducedMotion ? undefined : { y };
}
