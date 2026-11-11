import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeItem, restoreItem } from "./wishlistSlice";
import { useToast } from "../../hooks/useToast";

// Quiet text "Remove" with an Undo toast, the same pattern as the bag's
// DeleteItem: removal is instant, and Undo puts the exact item back in its
// old position.
const RemoveWishlistItem = ({ sku }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  const wishlist = useSelector(getWishlist);
  const productName =
    wishlist.find((item) => item.sku === sku)?.productName ?? "item";

  const handleRemove = () => {
    const index = wishlist.findIndex((item) => item.sku === sku);
    if (index === -1) return;
    const item = wishlist[index];
    dispatch(removeItem(sku));
    showToast(`${item.productName} removed from wishlist`, {
      action: {
        label: "Undo",
        onClick: () => dispatch(restoreItem({ item, index })),
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleRemove}
      aria-label={`Remove ${productName} from wishlist`}
      className="min-h-11 px-1 text-sm text-taupe underline underline-offset-4 decoration-stone hover:text-charcoal hover:decoration-charcoal transition-colors cursor-pointer"
    >
      Remove
    </button>
  );
};

export default RemoveWishlistItem;
