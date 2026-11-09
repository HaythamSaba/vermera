import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// Single source of truth for the JS-side reduced-motion signal. Anything
// MotionConfig(reducedMotion="user") doesn't govern must consume this
// directly: CSS-class motion, and framer-motion values bound through `style`
// (e.g. useParallax's scroll-linked transform).
export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    try {
      return window.matchMedia(QUERY).matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let mql;
    try {
      mql = window.matchMedia(QUERY);
    } catch {
      return;
    }

    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
