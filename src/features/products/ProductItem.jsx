import { ImageOff, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
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
import { DURATION, EASE, GRID_STAGGER_MS } from "../../utils/motion";
import { useToast } from "../../hooks/useToast";
import useAddedConfirmation from "../../hooks/useAddedConfirmation";
import {
  addItem as addWishlistItem,
  isInWishlist,
  removeItem as removeWishlistItem,
  toWishlistItem,
} from "../wishlist/wishlistSlice";
import { formatPrice } from "../../utils/pricing";
import { getCategoryLabel } from "./categories";

const MotionDiv = motion.div;

// staggerIndex: position within the grid's current stagger group (set by
// Products.jsx); only matters where a parent drives the "visible" variant.
const ProductItem = ({ product, staggerIndex = 0 }) => {
  const dispatch = useDispatch();
  const showToast = useToast();

  const {
    productName,
    NewPrice,
    OldPrice,
    image,
    isNew,
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

  const isOutOfStock = stock === 0;
  const isLowStock = !isOutOfStock && availabilityStatus === "Low Stock";

  const prefersReducedMotion = useReducedMotion();
  // Card fade + short rise, staggered GRID_STAGGER_MS per position. The
  // stagger lives only here (the parent grid no longer staggers), so the two
  // can't compound into a slow queue.
  const cardVariants = {
    initial: prefersReducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            duration: DURATION.reveal / 1000,
            ease: EASE.out,
            delay: (staggerIndex * GRID_STAGGER_MS) / 1000,
          },
    },
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    dispatch(addItem(toCartItem(product)));
    showToast(`${productName} added to cart`, {
      action: { label: "View cart", to: "/cart" },
    });
    // Briefly confirms "Added" on this same button before the card swaps to
    // the permanent quantity stepper below (see the isItemInCart branch),
    // so the click gets an immediate local confirmation instead of the
    // stepper just appearing in its place with no transition.
    confirmAddedToCart();
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
  // Square-cornered small caps tags, not pills (quiet-luxury card, audit V13).
  const badgeClass =
    "rounded-none py-1 px-2 text-[11px] font-medium uppercase tracking-wider";

  return (
    <MotionDiv
      className="product-card relative flex flex-col"
      variants={cardVariants}
    >
      {/* Outside the <Link> below: interactive controls can't be nested
          inside a link. Absolutely positioned over its top-left corner. */}
      <WishlistButton
        isActive={isItemInWishlist}
        onToggle={handleToggleWishlist}
        iconSize={18}
        className="absolute top-4 left-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-cream/90 text-charcoal hover:text-brass transition-colors cursor-pointer"
      />

      {/* The whole image + name + price block is one real link, so it gets
          an href (open in new tab, middle-click, Enter), the sitewide focus
          ring, and works for sold-out items too (the PDP handles them).
          `group` lives here rather than on the card so the hover treatment
          only fires over the link itself, not over the Add to Cart row. */}
      <Link
        to={`/products/${sku}`}
        className="group relative flex flex-col flex-1"
      >
        {/* Status badges — stacked, solid colors, always visible (not hover-only).
            No percentage-off badge: discounts show only as the struck-through
            original price below (audit decision D6). */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          {isOutOfStock ? (
            <span className={`${badgeClass} bg-espresso text-cream`}>
              Sold Out
            </span>
          ) : (
            <>
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

        {/* Flat image, no frame. While loading, the bg-stone/20 box itself is
            the placeholder (no spinner); the image fades in over it. */}
        <div className="relative overflow-hidden bg-stone/20 aspect-4/5">

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
            <img
              src={image}
              // Decorative inside the link: the <h3> below already names it,
              // so a filled alt would make the link announce the name twice.
              alt=""
              // Hover is a gentle 1.02 zoom only. motion-safe/motion-reduce
              // gate the zoom and fade on the OS reduced-motion setting, since
              // CSS transitions aren't covered by framer's MotionConfig.
              // Tailwind v4's scale-* sets the `scale` property (not
              // `transform`), so that's what the transition must list.
              className={`w-full h-full object-cover transition-[opacity,scale] duration-500 ease-out motion-safe:group-hover:scale-[1.02] motion-reduce:transition-none ${
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
            <span className="absolute bottom-3 left-3 z-10 bg-espresso/90 text-cream text-[11px] font-medium uppercase tracking-wider px-2 py-1 rounded-none">
              {getCategoryLabel(category)}
            </span>
          )}

        </div>

        {/* Info — sits straight on the page, no panel or hover inversion;
            the hover cue is a hairline underline on the name. Fixed
            min-height so grid rows stay aligned regardless of title length
            or whether OldPrice is present. */}
        <div
          className={`pt-3 min-h-[72px] flex flex-col justify-between ${
            isOutOfStock ? "opacity-60" : ""
          }`}
        >
          <h3
            className="font-serif font-medium text-lg leading-snug text-charcoal line-clamp-1 decoration-1 underline-offset-4 group-hover:underline"
            title={productName}
          >
            {productName}
          </h3>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-medium text-base text-charcoal">
              {formatPrice(NewPrice)}
            </span>
            {OldPrice && (
              <span className="text-sm text-taupe line-through">
                {formatPrice(OldPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Always-visible secondary action, outside the link — replaces the
          old hover-only overlay, which was invisible on touch and to
          keyboard focus but still clickable. min-h-11 keeps every card's
          row the same height (44px tap target) whatever state it's in. */}
      <div className="mt-3 min-h-11 flex items-center">
        {isOutOfStock ? (
          <p className="text-sm text-taupe">Currently unavailable</p>
        ) : isItemInCart && !justAddedToCart ? (
          <div className="flex items-center gap-3">
            <UpdateItemQuantity
              sku={sku}
              quantity={currentQuantity}
              max={stock}
            />
            <DeleteItem sku={sku} />
          </div>
        ) : (
          <AddToCartButton
            justAdded={justAddedToCart}
            onClick={handleAddToCart}
            variant="outline"
            size="small"
            className="w-full min-h-11"
            icon={<ShoppingCart size={18} aria-hidden="true" />}
            label="Add to Cart"
          />
        )}
      </div>
    </MotionDiv>
  );
};

export default ProductItem;
