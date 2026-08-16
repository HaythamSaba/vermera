// Shared timing constants for the site's restrained scroll/entrance motion
// system. CSS-transition pieces use Tailwind's built-in ease-out/ease-in-out
// utilities directly; EASE below is only needed for framer-motion's JS
// `transition` prop, which can't reference Tailwind's CSS keywords.

export const DURATION = {
  small: 200, // micro-interactions (badges, icon states)
  component: 400, // component-level transitions (dialogs, panels)
  editorial: 800, // section-level entrance reveals
};

// framer-motion pieces only (dialog/panel exit animations — mobile drawer,
// CartOverview, AnnouncementBar). framer-motion's `ease` prop accepts a
// cubic-bezier array directly.
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
};

// GSAP pieces only (useScrollReveal, useStaggerReveal, useParallax).
// GSAP's `ease` option takes its own named-ease strings, not CSS/framer
// values — power curves read as smooth deceleration without ever feeling
// bouncy or "template-y"; never use back/elastic/bounce here.
export const GSAP_EASE = {
  out: "power3.out",
  inOut: "sine.inOut",
  linear: "none",
};

export const STAGGER_MS = 60;
