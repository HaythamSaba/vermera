import { Minus, Plus } from "lucide-react";

// Controlled quantity stepper — visually matches the cart's
// UpdateItemQuantity control, but this one operates on local state before
// anything is added to the cart, so it takes plain value/handlers rather
// than dispatching cart actions directly.
const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max,
}) => {
  const atMin = quantity <= min;
  const atMax = max != null && quantity >= max;

  return (
    <div
      role="group"
      aria-label="Quantity"
      className="flex items-center gap-2 border border-stone bg-cream"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={atMin}
        aria-label="Decrease quantity"
        className="py-5 px-2 hover:bg-stone/30 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>
      <span
        className="px-2 font-medium text-lg text-charcoal min-w-[2ch] text-center"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={atMax}
        aria-label="Increase quantity"
        className="py-5 px-2 hover:bg-stone/30 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default QuantitySelector;
