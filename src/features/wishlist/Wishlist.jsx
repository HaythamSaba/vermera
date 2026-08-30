import { Heart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import WishlistItem from "./WishlistItem";
import EmptyWishlist from "./EmptyWishlist";
import { clearWishlist, getWishlist } from "./wishlistSlice";
import MainButton from "../../ui/MainButton";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Wishlist = () => {
  useDocumentTitle("Wishlist");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector(getWishlist);

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      dispatch(clearWishlist());
    }
  };

  if (wishlist.length === 0) return <EmptyWishlist />;

  return (
    <div className="container-foundation section max-w-2xl mx-auto">
      <div className="bg-cream border border-stone p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-medium text-espresso flex items-center">
            <Heart className="w-5 h-5 mr-2 text-brass" aria-hidden="true" />
            Wishlist
          </h2>
          <MainButton
            variant="danger"
            onClick={handleClearWishlist}
            title="Clear wishlist"
          >
            <Trash2 className="w-4 h-4" />
            Clear Wishlist
          </MainButton>
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
