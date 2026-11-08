import { useDispatch, useSelector } from "react-redux";
import { deleteItem, getCart, restoreItem } from "./cartSlice";
import { useToast } from "../../hooks/useToast";

// Quiet text "Remove" (not a red trash pill) with an Undo toast: removal is
// instant, so the toast's Undo puts the exact line back in its old position.
const DeleteItem = ({ sku }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  const cart = useSelector(getCart);

  const handleDelete = () => {
    const index = cart.findIndex((line) => line.sku === sku);
    if (index === -1) return;
    const item = cart[index];
    dispatch(deleteItem(sku));
    showToast(`${item.productName} removed`, {
      action: {
        label: "Undo",
        onClick: () => dispatch(restoreItem({ item, index })),
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      aria-label={`Remove ${cart.find((line) => line.sku === sku)?.productName ?? "item"} from cart`}
      className="min-h-11 px-1 text-sm text-taupe underline underline-offset-4 decoration-stone hover:text-charcoal hover:decoration-charcoal transition-colors cursor-pointer"
    >
      Remove
    </button>
  );
};

export default DeleteItem;
