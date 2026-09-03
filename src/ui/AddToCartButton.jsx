import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import MainButton from "./MainButton";

const MotionSpan = motion.span;

// Wraps MainButton with a brief "Added ✓" crossfade confirmation on a
// successful add — layered on top of (not replacing) the global toast, for
// the case where the toast renders somewhere the user isn't looking (e.g. a
// quick-add card that's about to scroll past). Purely presentational: the
// caller owns `justAdded`'s timing via useAddedConfirmation, so it can
// coordinate with whatever else the click triggers (ProductItem, for
// instance, delays its permanent swap to the quantity stepper until this
// confirmation window ends).
const AddToCartButton = ({
  justAdded,
  onClick,
  disabled = false,
  variant = "primary",
  size = "large",
  icon = null,
  label = "Add to Cart",
  className = "",
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MainButton
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        {justAdded ? (
          <MotionSpan
            key="added"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            className="flex items-center gap-2"
          >
            <Check size={icon ? 22 : 20} aria-hidden="true" />
            <span>Added</span>
          </MotionSpan>
        ) : (
          <MotionSpan
            key="idle"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            className="flex items-center gap-2"
          >
            {icon}
            <span>{label}</span>
          </MotionSpan>
        )}
      </AnimatePresence>
    </MainButton>
  );
};

export default AddToCartButton;
