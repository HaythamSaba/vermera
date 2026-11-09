// Shared timing constants for the site's restrained scroll/entrance motion
// system. CSS-transition pieces use Tailwind's built-in ease-out/ease-in-out
// utilities directly; EASE below is only needed for framer-motion's JS
// `transition` prop, which can't reference Tailwind's CSS keywords.

export const DURATION = {
  small: 200, // micro-interactions (badges, icon states)
  component: 400, // component-level transitions (dialogs, panels)
  reveal: 600, // above-the-fold content and product-card entrances
  editorial: 800, // section-level entrance reveals
};

// framer-motion's `ease` prop accepts a cubic-bezier array directly.
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
};

export const STAGGER_MS = 120;

// Scroll-entrance variants for a staggered group (see RevealGroup.jsx): the
// container only orchestrates; each child declares `variants` built with
// revealItemVariants() and inherits the hidden/visible state from it.
export const revealGroupVariants = (staggerMs = STAGGER_MS) => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerMs / 1000 } },
});

export const revealItemVariants = ({
  distance = 32,
  durationMs = DURATION.editorial,
} = {}) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationMs / 1000, ease: EASE.out },
  },
});

// Product grids: a short stagger that restarts every GRID_STAGGER_CAP cards,
// so a long grid (or a "Load More" batch) never builds up a long queue.
export const GRID_STAGGER_MS = 70;
export const GRID_STAGGER_CAP = 8;

// Shared by the small card grids (ServiceValues, About's contact cards).
export const CARD_REVEAL_VARIANTS = revealItemVariants({ durationMs: 500 });

export const SIZE_CLASSES = {
  primary: "text-4xl",
  default: "text-3xl",
  compact: "text-2xl",
};

export const MARK_SIZE_CLASSES = {
  primary: "h-9",
  default: "h-7",
  compact: "h-5",
};