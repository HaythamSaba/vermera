import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MotionSpan = motion.span;

// Small "tick" pop played when a header badge count changes (cart/wishlist
// add or remove) — kept subtle and short since this fires on every mutation.
// mode="popLayout" removes the outgoing digit from layout during its exit so
// the incoming one appears immediately rather than waiting for it.
const AnimatedCount = ({ value }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return value;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <MotionSpan
        key={value}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.18 }}
        className="inline-block"
      >
        {value}
      </MotionSpan>
    </AnimatePresence>
  );
};

export default AnimatedCount;
