import { useLayoutEffect, useRef } from "react";
import { gsap } from "../utils/gsapSetup";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

// Subtle scroll-linked parallax on a single element (typically an image
// wrapper — apply to a wrapper around an <img>, not the <img> itself, so
// any existing hover/CSS transform on the image stays independent rather
// than fighting GSAP's inline transform). `speed` is a fraction of the
// element's own height it travels across its scroll range — keep small
// (0.08-0.2) for a restrained effect, and give the element some CSS
// oversize (e.g. scale-[1.15]) so it never reveals empty space at its
// edges while translating. Caller's outer container should have
// overflow-hidden.
//
// Fully skipped under reduced motion — no instant-jump fallback needed
// since a parallax offset isn't meaningful content, just decoration.
export default function useParallax({ speed = 0.1, scrub = 0.8 } = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion) return;

    let ctx;
    try {
      ctx = gsap.context(() => {
        gsap.to(node, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "bottom top",
            scrub,
          },
        });
      }, node);
    } catch {
      return;
    }

    return () => ctx.revert();
  }, [prefersReducedMotion, speed, scrub]);

  return ref;
}
