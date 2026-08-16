import { useLayoutEffect, useRef } from "react";
import { gsap } from "../utils/gsapSetup";
import usePrefersReducedMotion from "./usePrefersReducedMotion";
import { GSAP_EASE } from "../utils/motion";

// Single-element scroll-entrance reveal, GSAP + ScrollTrigger driven, scoped
// via gsap.context() so the tween/trigger it creates are fully torn down on
// unmount (context.revert()) — no leaked ScrollTriggers across route changes
// or re-renders.
//
// Opt-in hiding, not opt-out revealing: if reduced motion is on, or if GSAP
// setup itself throws for any reason, the element is set to its final
// visible state immediately rather than risking it being stranded hidden.
export default function useScrollReveal({
  distance = 40,
  durationMs = 800,
  delayMs = 0,
  ease = GSAP_EASE.out,
  // Fires as soon as any part of the element enters the viewport — not a
  // stricter "top 85%"-style threshold, which can fail to fire at all for
  // above-the-fold content sitting low in a shorter viewport (e.g. a hero
  // CTA below a tall heading): at scrollY 0 that content may already be
  // on-screen but still below the threshold line, so it would otherwise
  // never trigger until the user scrolls — silently stranding it hidden.
  start = "top bottom",
  once = true,
} = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    let ctx;
    try {
      ctx = gsap.context(() => {
        if (prefersReducedMotion) {
          gsap.set(node, { opacity: 1, y: 0 });
          return;
        }

        const tweenVars = {
          opacity: 1,
          y: 0,
          duration: durationMs / 1000,
          delay: delayMs / 1000,
          ease,
          clearProps: "transform",
        };

        // ScrollTrigger's enter/leave toggleActions only fire on a genuine
        // scroll-driven transition — an element already inside its trigger
        // zone at creation (e.g. above-the-fold hero content, which starts
        // "active" with no scroll ever needed to reach it) never gets that
        // transition and would otherwise sit frozen at its "from" state
        // forever. Detect that case and just play immediately instead.
        const rect = node.getBoundingClientRect();
        const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (alreadyInView) {
          gsap.fromTo(node, { opacity: 0, y: distance }, tweenVars);
          return;
        }

        gsap.fromTo(
          node,
          { opacity: 0, y: distance },
          {
            ...tweenVars,
            scrollTrigger: {
              trigger: node,
              start,
              toggleActions: once ? "play none none none" : "play none none reverse",
            },
          },
        );
      }, node);
    } catch {
      gsap.set(node, { clearProps: "all" });
      return;
    }

    return () => ctx.revert();
  }, [prefersReducedMotion, distance, durationMs, delayMs, ease, start, once]);

  return { ref, prefersReducedMotion };
}
