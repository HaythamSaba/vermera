import { useDispatch } from "react-redux";
import { Trash2 } from "lucide-react";
import { removeItem } from "./wishlistSlice";

const RemoveWishlistItem = ({ sku }) => {
  const dispatch = useDispatch();
  const handleRemove = () => {
    dispatch(removeItem(sku));
  };
  return (
    <button
      type="button"
      onClick={handleRemove}
      className="text-red-500 hover:text-red-700 transition ml-2 p-4 bg-cream rounded-full hover:bg-red-100"
      aria-label="Remove from wishlist"
    >
      <Trash2 className="w-4 h-4" aria-hidden="true" />
    </button>
  );
};

export default RemoveWishlistItem;
