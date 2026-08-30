import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import MainButton from "../../ui/MainButton";
import RemoveWishlistItem from "./RemoveWishlistItem";
import { useToast } from "../../hooks/useToast";
import { addItem, isInCart, toCartItem } from "../cart/cartSlice";

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
    showToast(`${productName} added to cart`);
  };

  return (
    <div className="flex gap-4 p-3 border border-stone hover:shadow-soft transition-shadow duration-300">
      <Link to={`/products/${sku}`} className="shrink-0">
        <img
          src={image}
          alt={productName}
          className="w-20 h-20 object-cover border border-stone"
        />
      </Link>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/products/${sku}`}>
            <h3 className="font-medium text-charcoal line-clamp-1">
              {productName}
            </h3>
          </Link>
          <RemoveWishlistItem sku={sku} />
        </div>

        <p className="text-sm text-taupe capitalize mb-2">{category}</p>

        <div className="flex justify-between items-center gap-3">
          <div>
            <span className="font-semibold text-espresso">
              ${NewPrice.toFixed(2)}
            </span>
            {OldPrice && (
              <span className="text-sm text-taupe line-through ml-2">
                ${OldPrice.toFixed(2)}
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
