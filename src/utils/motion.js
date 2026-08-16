// Shared timing constants for the site's restrained scroll/entrance motion
// system. CSS-transition pieces use Tailwind's built-in ease-out/ease-in-out
// utilities directly; EASE below is only needed for framer-motion's JS
// `transition` prop, which can't reference Tailwind's CSS keywords.

export const DURATION = {
  small: 200, // micro-interactions (badges, icon states)
  component: 400, // component-level transitions (dialogs, panels)
  editorial: 800, // section-level entrance reveals
};

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
};

export const STAGGER_MS = 60;
