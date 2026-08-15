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
    <div className="flex items-center gap-2 border border-stone bg-cream rounded-md">
      <button
        type="button"
        onClick={handleDecrease}
        className="p-1 hover:bg-stone/30 transition"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>
      <span className="px-3 font-medium text-charcoal">{quantity}</span>
      <button
        type="button"
        onClick={handleIncrease}
        className="p-1 hover:bg-stone/30 transition"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default UpdateItemQuantity;
