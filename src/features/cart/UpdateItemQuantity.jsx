import { useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

const MIN_QUANTITY = 1;

// `max`: the product's stock, when known — "+" is disabled there (the
// reducer also caps it), matching the PDP's quantity selector. "−" stops at
// 1: removing a line is left to "Remove", which offers Undo.
const UpdateItemQuantity = ({ sku, productName, quantity, max }) => {
  const isAtMin = quantity <= MIN_QUANTITY;
  const isAtMax = Number.isFinite(max) && quantity >= max;
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(increaseItemQuantity(sku));
  };

  const handleDecrease = () => {
    dispatch(decreaseItemQuantity(sku));
  };

  const increaseLabel = isAtMax
    ? `Increase quantity of ${productName} (maximum ${max} in stock)`
    : `Increase quantity of ${productName}`;

  return (
    // size-11: 44x44 buttons (were ~24px with p-1, hard to hit on a phone).
    <div
      role="group"
      aria-label={`Quantity of ${productName}`}
      className="flex items-center border border-stone bg-cream"
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isAtMin}
        className="size-11 inline-flex items-center justify-center hover:bg-stone/30 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label={`Decrease quantity of ${productName}`}
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>
      <span
        className="px-1 min-w-[2ch] text-center font-medium text-charcoal"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={isAtMax}
        className="size-11 inline-flex items-center justify-center hover:bg-stone/30 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label={increaseLabel}
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default UpdateItemQuantity;
