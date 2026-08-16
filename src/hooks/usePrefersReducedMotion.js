import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// Single source of truth for the JS-side reduced-motion signal. Every
// non-framer-motion animation mechanism (useScrollReveal, hover transforms,
// etc.) must consume this directly — framer-motion's own MotionConfig only
// governs framer-motion-driven components, not CSS classes or
// IntersectionObserver-based reveals.
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
