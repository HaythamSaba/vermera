import { useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

const UpdateItemQuantity = ({ sku, quantity }) => {
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(increaseItemQuantity(sku));
  };

  const handleDecrease = () => {
    dispatch(decreaseItemQuantity(sku));
  };
  return (
    // size-11: 44x44 buttons (were ~24px with p-1, hard to hit on a phone).
    <div className="flex items-center border border-stone bg-cream rounded-md">
      <button
        type="button"
        onClick={handleDecrease}
        className="size-11 inline-flex items-center justify-center hover:bg-stone/30 transition"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>
      <span className="px-1 min-w-[2ch] text-center font-medium text-charcoal">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        className="size-11 inline-flex items-center justify-center hover:bg-stone/30 transition"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default UpdateItemQuantity;
