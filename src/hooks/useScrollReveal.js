import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const canObserve =
  typeof window !== "undefined" && typeof IntersectionObserver !== "undefined";

// Opt-in hiding, not opt-out revealing: isVisible is derived so it's true
// whenever we can't/shouldn't animate (reduced motion, no
// IntersectionObserver support) on every render — including if the OS
// reduced-motion setting changes mid-session — rather than relying on an
// effect to sync it, so content is never stranded invisible.
export default function useScrollReveal({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true,
} = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef(null);
  const [observedVisible, setObservedVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || !canObserve) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setObservedVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setObservedVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [prefersReducedMotion, threshold, rootMargin, once]);

  const isVisible = prefersReducedMotion || !canObserve || observedVisible;

  return { ref, isVisible, prefersReducedMotion };
}
