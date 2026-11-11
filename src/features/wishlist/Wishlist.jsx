import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import WishlistItem from "./WishlistItem";
import EmptyWishlist from "./EmptyWishlist";
import { clearWishlist, getWishlist, restoreItems } from "./wishlistSlice";
import MainButton from "../../ui/MainButton";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useMetaDescription from "../../hooks/useMetaDescription";
import { useToast } from "../../hooks/useToast";

const Wishlist = () => {
  useDocumentTitle("Wishlist");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();

  const wishlist = useSelector(getWishlist);
  useMetaDescription(
    wishlist.length > 0
      ? `Your saved Vermera pieces — ${wishlist.length} item${wishlist.length === 1 ? "" : "s"} favorited, ready to revisit or add to your bag.`
      : "Your Vermera wishlist is empty — browse the shop and save pieces you want to revisit.",
  );

  // No confirm() dialog: clearing is instant and reversible from the
  // toast's Undo, the same pattern as removing a single piece.
  const handleClearWishlist = () => {
    const previous = wishlist;
    dispatch(clearWishlist());
    showToast("Wishlist cleared", {
      action: {
        label: "Undo",
        onClick: () => dispatch(restoreItems(previous)),
      },
    });
  };

  if (wishlist.length === 0) return <EmptyWishlist />;

  return (
    <div className="container-foundation section max-w-2xl mx-auto">
      <div className="bg-cream border border-stone p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-serif font-medium text-espresso flex items-center">
            <Heart className="w-6 h-6 mr-2 text-brass" aria-hidden="true" />
            Wishlist
          </h1>
          <button
            type="button"
            onClick={handleClearWishlist}
            className="min-h-11 px-1 text-sm text-taupe underline underline-offset-4 decoration-stone hover:text-charcoal hover:decoration-charcoal transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-4 mb-6 overflow-y-auto">
          {wishlist.map((item) => (
            <WishlistItem key={item.sku} item={item} />
          ))}
        </div>

        <MainButton
          variant="outline"
          fullWidth
          content="Continue Shopping"
          className="mt-4"
          onClick={() => navigate("/products")}
        />
      </div>
    </div>
  );
};

export default Wishlist;
