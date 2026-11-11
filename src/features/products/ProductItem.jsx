import { ImageOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import WishlistButton from "../../ui/WishlistButton";
import { useDispatch, useSelector } from "react-redux";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE, GRID_STAGGER_MS } from "../../utils/motion";
import { useToast } from "../../hooks/useToast";
import {
  addItem as addWishlistItem,
  isInWishlist,
  removeItem as removeWishlistItem,
  toWishlistItem,
} from "../wishlist/wishlistSlice";
import { formatPrice } from "../../utils/pricing";

const MotionDiv = motion.div;

// staggerIndex: position within the grid's current stagger group (set by
// Products.jsx); only matters where a parent drives the "visible" variant.
const ProductItem = ({ product, staggerIndex = 0 }) => {
  const dispatch = useDispatch();
  const showToast = useToast();

  const { productName, NewPrice, OldPrice, image, stock, sku } = product;

  const isItemInWishlist = useSelector(isInWishlist(product.sku));

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = stock === 0;

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

      {/* The card is image, name and price as one real link, plus the
          wishlist heart (round-2 decision A): no add-to-bag control or
          quantity stepper here; buying happens on the product page and the
          stepper lives only in the bag. The link gets an href (open in new
          tab, middle-click, Enter) and the sitewide focus ring, and works
          for sold-out items too (the PDP handles them). */}
      <Link
        to={`/products/${sku}`}
        className="group relative flex flex-col flex-1"
      >
        {/* The one status kept on the card: shoppers shouldn't open an
            unavailable piece unaware. Solid background, since it sits on a
            photo of unknown colour. Low stock is shown on the product page
            only. */}
        {isOutOfStock && (
          <span className="absolute top-4 right-4 z-20 rounded-none py-1 px-2 text-[11px] font-medium uppercase tracking-wider bg-espresso text-cream">
            Sold out
          </span>
        )}

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
              // Cards appear in grids of up to 8+ (Shop, The Edit, related,
              // recently viewed), mostly below the fold. Lazy loading defers
              // those; the 4:5 box above reserves the space, so there's no
              // layout shift, and on-screen cards still load immediately.
              loading="lazy"
              decoding="async"
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
    </MotionDiv>
  );
};

export default ProductItem;
