import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once at module scope — ES modules only evaluate a given file
// once, so every hook importing from here shares the same registration
// rather than re-registering the plugin on every mount.
gsap.registerPlugin(ScrollTrigger);

// Async content (images without a reserved aspect-ratio box, web fonts,
// etc.) can shift layout after a trigger's start/end positions were first
// measured. A one-time refresh once every resource has finished loading
// keeps trigger positions accurate without a recurring cost.
if (typeof window !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh(), {
    once: true,
  });
}

export { gsap, ScrollTrigger };
