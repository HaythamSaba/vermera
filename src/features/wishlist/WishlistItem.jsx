import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import MainButton from "../../ui/MainButton";
import RemoveWishlistItem from "./RemoveWishlistItem";
import { useToast } from "../../hooks/useToast";
import { addItem, isInCart, toCartItem } from "../cart/cartSlice";
import { formatPrice } from "../../utils/pricing";
import { getCategoryLabel } from "../products/categories";

const WishlistItem = ({ item }) => {
  const dispatch = useDispatch();
  const showToast = useToast();

  const {
    sku,
    productName,
    category,
    NewPrice,
    OldPrice,
    image,
    stock,
  } = item;

  const isOutOfStock = stock === 0;
  const isItemInCart = useSelector(isInCart(sku));

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(addItem(toCartItem(item)));
    showToast(`${productName} added to cart`, {
      action: { label: "View cart", to: "/cart" },
    });
  };

  return (
    <div className="flex gap-4 p-3 border border-stone">
      {/* Image and name both link to the product; the image link is
          aria-hidden/untabbable so keyboard and screen-reader users get one
          link per row, not two (same as CartItem). */}
      <Link
        to={`/products/${sku}`}
        tabIndex={-1}
        aria-hidden="true"
        className="shrink-0"
      >
        <img
          src={image}
          alt=""
          className="w-20 h-20 object-cover border border-stone"
        />
      </Link>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-charcoal line-clamp-1">
            <Link
              to={`/products/${sku}`}
              className="hover:underline underline-offset-4 decoration-1"
            >
              {productName}
            </Link>
          </h3>
          <RemoveWishlistItem sku={sku} />
        </div>

        <p className="text-sm text-taupe mb-2">{getCategoryLabel(category)}</p>

        <div className="flex justify-between items-center gap-3">
          <div>
            <span className="font-semibold text-espresso">
              {formatPrice(NewPrice)}
            </span>
            {OldPrice && (
              <span className="text-sm text-taupe line-through ml-2">
                {formatPrice(OldPrice)}
              </span>
            )}
          </div>

          <MainButton
            size="small"
            variant={isItemInCart ? "outline" : "quiet"}
            content={
              isOutOfStock ? "Sold Out" : isItemInCart ? "In Cart" : "Add to Cart"
            }
            disabled={isOutOfStock || isItemInCart}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} aria-hidden="true" />
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
