import { ImageOff, Info, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import MainButton from "../../ui/MainButton";
import AddToCartButton from "../../ui/AddToCartButton";
import WishlistButton from "../../ui/WishlistButton";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  getCurrentQuantityBySku,
  isInCart,
  toCartItem,
} from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "../../utils/motion";
import { useToast } from "../../hooks/useToast";
import useAddedConfirmation from "../../hooks/useAddedConfirmation";
import {
  addItem as addWishlistItem,
  isInWishlist,
  removeItem as removeWishlistItem,
  toWishlistItem,
} from "../wishlist/wishlistSlice";

const MotionDiv = motion.div;
const MotionImg = motion.img;

const imageVariants = {
  initial: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const showToast = useToast();

  const {
    productName,
    NewPrice,
    OldPrice,
    image,
    isNew,
    isDiscount,
    DiscountPercentage,
    stock,
    availabilityStatus,
    category,
    sku,
  } = product;

  const isItemInCart = useSelector(isInCart(product.sku));
  const currentQuantity = useSelector(getCurrentQuantityBySku(product.sku));
  const isItemInWishlist = useSelector(isInWishlist(product.sku));

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [justAddedToCart, confirmAddedToCart] = useAddedConfirmation();

  const navigate = useNavigate();

  const isOutOfStock = stock === 0;
  const isLowStock = !isOutOfStock && availabilityStatus === "Low Stock";

  const prefersReducedMotion = useReducedMotion();
  // Timing/distance only — no per-index delay here. Stagger order across
  // the grid is entirely the parent's job (Products.jsx's cardParentVariants
  // staggerChildren); adding a second, independent delay here would compound
  // with it into a much slower reveal than either config alone implies.
  const cardVariants = {
    initial: prefersReducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: DURATION.editorial / 1000, ease: EASE.out },
    },
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    dispatch(addItem(toCartItem(product)));
    showToast(`${productName} added to cart`);
    // Briefly confirms "Added" on this same button before the card swaps to
    // the permanent quantity stepper below (see the isItemInCart branch),
    // so the click gets an immediate local confirmation instead of the
    // stepper just appearing in its place with no transition.
    confirmAddedToCart();
  };

  const handleOpenProductPage = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;

    navigate(`/products/${sku}`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (isItemInWishlist) {
      dispatch(removeWishlistItem(sku));
      showToast(`${productName} removed from wishlist`);
    } else {
      dispatch(addWishlistItem(toWishlistItem(product)));
      showToast(`${productName} added to wishlist`);
    }
  };

  // Solid, non-translucent badge backgrounds only — every one of these sits
  // directly on a photo, so contrast can't depend on what's underneath.
  const badgeClass =
    "rounded-full py-1.5 px-3 text-xs font-semibold uppercase tracking-wider shadow-soft";

  return (
    <MotionDiv
      className="product-card relative group flex flex-col"
      variants={cardVariants}
    >
      {/* Wishlist toggle */}
      <WishlistButton
        isActive={isItemInWishlist}
        onToggle={handleToggleWishlist}
        iconSize={18}
        className="absolute top-4 left-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-cream/90 text-charcoal hover:text-brass transition-colors cursor-pointer"
      />

      {/* Status badges — stacked, solid colors, always visible (not hover-only) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        {isOutOfStock ? (
          <span className={`${badgeClass} bg-espresso text-cream`}>
            Sold Out
          </span>
        ) : (
          <>
            {isDiscount && (
              <span className={`${badgeClass} bg-brass text-cream`}>
                -{Math.round(DiscountPercentage)}%
              </span>
            )}
            {isLowStock && (
              <span className={`${badgeClass} bg-taupe text-cream`}>
                Low Stock
              </span>
            )}
            {isNew && (
              <span
                className={`${badgeClass} bg-cream text-charcoal border border-stone`}
              >
                New
              </span>
            )}
          </>
        )}
      </div>

      {/* Image + hover overlay */}
      <div className="relative overflow-hidden bg-stone/20 aspect-4/5">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-stone border-t-brass rounded-full animate-spin" />
          </div>
        )}

        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-taupe">
            <div className="text-center">
              <ImageOff
                size={40}
                className="mx-auto mb-2 opacity-60"
                aria-hidden="true"
              />
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        ) : (
          <MotionImg
            src={image}
            variants={imageVariants}
            initial="initial"
            animate="visible"
            exit="initial"
            alt={productName}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Category chip — solid espresso, echoes the lookbook caption
            language without sitting translucent over a photo of unknown
            background color. */}
        {category && (
          <span className="absolute bottom-3 left-3 z-10 bg-espresso/90 text-cream text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
            {category}
          </span>
        )}

        {/* Hover overlay — actions only, no product info duplicated here */}
        <div className="absolute inset-0 bg-espresso/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex flex-col items-center justify-center gap-6">
          {isOutOfStock ? (
            <span className="text-espresso text-sm font-semibold uppercase tracking-wider bg-cream px-4 py-2 rounded-full">
              Out of Stock
            </span>
          ) : (
            <>
              <MainButton
                onClick={handleOpenProductPage}
                disabled={isOutOfStock}
                variant="light"
                content="More Info"
              >
                <Info size={22} />
              </MainButton>
              {isItemInCart && !justAddedToCart ? (
                <div className="flex items-center gap-3">
                  <UpdateItemQuantity sku={sku} quantity={currentQuantity} />
                  <DeleteItem sku={sku} />
                </div>
              ) : (
                <AddToCartButton
                  justAdded={justAddedToCart}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  variant="light"
                  icon={<ShoppingCart size={22} aria-hidden="true" />}
                  label="Add to Cart"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Info panel — fixed min-height so grid rows stay aligned regardless
          of title length or whether OldPrice is present. */}
      <div
        role={isOutOfStock ? undefined : "link"}
        tabIndex={isOutOfStock ? undefined : 0}
        onClick={handleOpenProductPage}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleOpenProductPage(e);
        }}
        className={`bg-white px-4 py-3.5 min-h-[92px] flex flex-col justify-between ${
          isOutOfStock ? "opacity-60" : "cursor-pointer"
        }`}
      >
        <h3
          className="font-serif font-medium text-lg leading-snug text-charcoal line-clamp-1"
          title={productName}
        >
          {productName}
        </h3>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-semibold text-lg text-charcoal">
            ${NewPrice.toFixed(2)}
          </span>
          {OldPrice && (
            <span className="text-sm text-taupe line-through">
              ${OldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

export default ProductItem;
