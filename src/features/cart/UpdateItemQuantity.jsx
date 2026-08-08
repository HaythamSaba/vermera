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
    <div className="flex items-center gap-2 border border-gray-300 bg-white rounded-md">
      <button
        onClick={handleDecrease}
        className="p-1 hover:bg-gray-100 transition"
        title="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="px-3 font-medium">{quantity}</span>
      <button
        onClick={handleIncrease}
        className="p-1 hover:bg-gray-100 transition"
        title="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UpdateItemQuantity;
