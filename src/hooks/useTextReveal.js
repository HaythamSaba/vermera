import { useLayoutEffect, useRef } from "react";
import { gsap, SplitText } from "../utils/gsapSetup";
import usePrefersReducedMotion from "./usePrefersReducedMotion";
import { GSAP_EASE } from "../utils/motion";

// Per-letter (or per-word) scroll-entrance reveal: each piece fades up out of
// a blur, staggered, for an editorial "settling into place" feel. SplitText
// handles the accessible split — with `aria: "auto"` it puts an aria-label on
// the element and aria-hidden on every generated piece, so screen readers
// still get the phrase as one string.
//
// Same opt-in-hiding contract as useScrollReveal: if reduced motion is on, or
// SplitText/GSAP setup throws for any reason, the text is shown immediately
// rather than risking it being stranded invisible. The target element should
// start at opacity-0 in markup so there's no pre-animation flash.
export default function useTextReveal({
  by = "chars", // "chars" | "words"
  distance = 24,
  blur = 10, // keep modest — animating blur() is a repaint per frame
  durationMs = 800,
  delayMs = 0,
  staggerMs = 22,
  ease = GSAP_EASE.out,
  // See useScrollReveal for why "top bottom" rather than a stricter
  // threshold — avoids stranding already-on-screen content.
  start = "top bottom",
  once = true,
} = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    let ctx;
    let split;
    try {
      ctx = gsap.context(() => {
        if (prefersReducedMotion) {
          gsap.set(node, { opacity: 1 });
          return;
        }

        split = new SplitText(node, { type: by, aria: "auto" });
        const targets = by === "words" ? split.words : split.chars;
        if (!targets.length) {
          gsap.set(node, { opacity: 1 });
          return;
        }

        gsap.set(node, { opacity: 1 });

        const tweenVars = {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: durationMs / 1000,
          delay: delayMs / 1000,
          ease,
          stagger: staggerMs / 1000,
          onComplete: () =>
            gsap.set(targets, { clearProps: "filter,transform,willChange" }),
        };

        // See useScrollReveal: an element already inside its trigger zone at
        // creation never gets a genuine scroll-driven enter transition, so
        // toggleActions would never fire — play immediately in that case.
        const rect = node.getBoundingClientRect();
        const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;

        gsap.fromTo(
          targets,
          {
            opacity: 0,
            y: distance,
            filter: `blur(${blur}px)`,
            willChange: "filter, transform",
          },
          alreadyInView
            ? tweenVars
            : {
                ...tweenVars,
                scrollTrigger: {
                  trigger: node,
                  start,
                  toggleActions: once
                    ? "play none none none"
                    : "play none none reverse",
                },
              },
        );
      }, node);
    } catch {
      gsap.set(node, { clearProps: "all", opacity: 1 });
      return;
    }

    return () => {
      ctx?.revert();
      split?.revert();
    };
  }, [
    prefersReducedMotion,
    by,
    distance,
    blur,
    durationMs,
    delayMs,
    staggerMs,
    ease,
    start,
    once,
  ]);

  return { ref, prefersReducedMotion };
}
