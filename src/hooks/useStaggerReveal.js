import { useLayoutEffect, useRef } from "react";
import { gsap } from "../utils/gsapSetup";
import usePrefersReducedMotion from "./usePrefersReducedMotion";
import { GSAP_EASE, STAGGER_MS } from "../utils/motion";

// Reveals a group of child elements (matched by `itemSelector`, queried
// within the returned containerRef) as one coordinated scroll entrance,
// staggered — one ScrollTrigger for the whole group rather than one per
// item. Include whatever data drives the item list in `deps` (e.g. a
// products array) so the effect re-runs once real content actually exists
// in the DOM — GSAP can't animate nodes that haven't rendered yet.
//
// Deliberately does NOT re-run on every downstream state change (e.g.
// pagination) — only on the identity change of what's in `deps` — so
// already-revealed items are never replayed/flickered.
export default function useStaggerReveal(
  itemSelector,
  deps = [],
  {
    enabled = true,
    distance = 32,
    durationMs = 850,
    staggerMs = STAGGER_MS,
    ease = GSAP_EASE.out,
    // See useScrollReveal for why this is "top bottom" rather than a
    // stricter threshold — avoids stranding already-on-screen content.
    start = "top bottom",
  } = {},
) {
  const containerRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    let ctx;
    try {
      ctx = gsap.context(() => {
        const items = container.querySelectorAll(itemSelector);
        if (!items.length) return;

        if (prefersReducedMotion) {
          gsap.set(items, { opacity: 1, y: 0 });
          return;
        }

        const tweenVars = {
          opacity: 1,
          y: 0,
          duration: durationMs / 1000,
          stagger: staggerMs / 1000,
          ease,
          clearProps: "transform",
        };

        // See useScrollReveal for why: a container already inside its
        // trigger zone at creation never gets a genuine scroll-driven
        // enter transition, so toggleActions would never fire — detect
        // that case and just play immediately instead of via ScrollTrigger.
        const rect = container.getBoundingClientRect();
        const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (alreadyInView) {
          gsap.fromTo(items, { opacity: 0, y: distance }, tweenVars);
          return;
        }

        gsap.fromTo(
          items,
          { opacity: 0, y: distance },
          {
            ...tweenVars,
            scrollTrigger: {
              trigger: container,
              start,
              toggleActions: "play none none none",
            },
          },
        );
      }, container);
    } catch {
      gsap.set(container.querySelectorAll(itemSelector), { clearProps: "all" });
      return;
    }

    return () => ctx.revert();
    // deps intentionally drives re-setup when the item list's underlying
    // data changes; eslint can't verify a spread array statically.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, prefersReducedMotion, itemSelector, distance, durationMs, staggerMs, ease, start, ...deps]);

  return { containerRef };
}
