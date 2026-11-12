import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { addItem, toCartItem } from "../cart/cartSlice";
import AddToCartButton from "../../ui/AddToCartButton";
import Breadcrumb from "../../ui/Breadcrumb";
import WishlistButton from "../../ui/WishlistButton";
import ProductGallery from "./ProductGallery";
import ProductItem from "./ProductItem";
import QuantitySelector from "./QuantitySelector";
import { getCategoryLabel, isSizedCategory } from "./categories";

// Decision D: an honest note in Details, never invented sizes.
const ONE_SIZE_NOTE = "One size — sizing isn't available in this demo catalog.";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useMetaDescription from "../../hooks/useMetaDescription";
import { useToast } from "../../hooks/useToast";
import useAddedConfirmation from "../../hooks/useAddedConfirmation";
import {
  getRecentlyViewed,
  recordProductView,
} from "../../services/recentlyViewed";
import {
  addItem as addWishlistItem,
  isInWishlist,
  removeItem as removeWishlistItem,
  toWishlistItem,
} from "../wishlist/wishlistSlice";
import { formatPrice } from "../../utils/pricing";

const eyebrowClass =
  "text-xs font-medium uppercase tracking-[0.2em] text-taupe";

// Quantity state lives here, keyed by sku at the call site below — React
// Router keeps ProductPage mounted across a sku change (only loader data
// changes), so keying this component forces a remount (and so a reset back
// to 1) whenever the user lands on a different product, without needing an
// effect to reset state imperatively.
const AddToCartControls = ({
  product,
  isOutOfStock,
  onAdd,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);
  const max = product.stock;
  const [justAdded, confirmAdded] = useAddedConfirmation();

  const handleAdd = () => {
    onAdd(quantity);
    confirmAdded();
  };

  return (
    <div className="flex items-center gap-4">
      {!isOutOfStock && (
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => setQuantity((q) => Math.min(q + 1, max))}
          onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
          min={1}
          max={max}
        />
      )}
      <AddToCartButton
        justAdded={justAdded}
        label={isOutOfStock ? "Sold Out" : "Add to Bag"}
        variant="quiet"
        disabled={isOutOfStock}
        onClick={handleAdd}
      />
      <WishlistButton
        isActive={isWishlisted}
        onToggle={onToggleWishlist}
        iconSize={20}
        className="w-14 h-14 shrink-0 flex items-center justify-center rounded-full border border-stone text-charcoal hover:text-brass hover:border-brass transition-colors cursor-pointer"
      />
    </div>
  );
};

// Native <details>/<summary>: keyboard and screen-reader support for free,
// no JS state. The chevron only rotates (motion-safe) — no height animation.
const Accordion = ({ title, defaultOpen = false, children }) => (
  <details className="group border-b border-stone" open={defaultOpen}>
    <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-sm font-medium uppercase tracking-[0.15em] text-charcoal">
      {title}
      <ChevronDown
        className="w-4 h-4 shrink-0 text-taupe motion-safe:transition-transform group-open:rotate-180"
        aria-hidden="true"
      />
    </summary>
    <div className="pb-5">{children}</div>
  </details>
);

// rows: [label, value] pairs; empty values are skipped.
const FactList = ({ rows }) => (
  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
    {rows
      .filter(([, value]) => value)
      .map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-taupe">{label}</dt>
          <dd className="text-charcoal">{value}</dd>
        </div>
      ))}
  </dl>
);

// Mobile-only (<lg) bar with price + Add to Cart, shown while the main
// controls are off-screen (on phones they start below the gallery) and
// hidden again past the end of the product content, so it never covers the
// footer. `inert` takes it out of the tab order/accessibility tree while
// hidden. Adds a quantity of 1; the main controls handle larger amounts.
const MobileBuyBar = ({ isVisible, productName, price, onAdd }) => {
  const [justAdded, confirmAdded] = useAddedConfirmation();

  return (
    <div
      inert={!isVisible}
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 bg-cream border-t border-stone px-4 py-3 flex items-center gap-4 motion-safe:transition-transform motion-safe:duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm text-charcoal line-clamp-1">{productName}</p>
        <p className="text-sm font-medium text-espresso">{price}</p>
      </div>
      <AddToCartButton
        justAdded={justAdded}
        label="Add to Bag"
        variant="quiet"
        size="small"
        className="min-h-11 shrink-0"
        onClick={() => {
          onAdd(1);
          confirmAdded();
        }}
      />
    </div>
  );
};

const ProductPage = () => {
  const { product, relatedProducts } = useLoaderData();
  useDocumentTitle(product.productName);
  const dispatch = useDispatch();
  const showToast = useToast();

  const {
    sku,
    productName,
    description,
    NewPrice,
    OldPrice,
    images,
    category,
    brand,
    woodType,
    dimensions,
    stock,
    availabilityStatus,
    shippingInformation,
    warrantyInformation,
    returnPolicy,
  } = product;

  const categoryLabel = getCategoryLabel(category);

  const isOutOfStock = stock === 0;
  const isLowStock = !isOutOfStock && availabilityStatus === "Low Stock";
  const priceFact = OldPrice
    ? `Price: ${formatPrice(NewPrice)} (was ${formatPrice(OldPrice)})`
    : `Price: ${formatPrice(NewPrice)}`;
  // First sentence of the real product description, plus the same
  // category/price/stock facts already shown on the page — structured facts
  // read better here than a vague one-liner, per meta description best
  // practice.
  useMetaDescription(
    `${description ? description.split(".")[0].trim() + ". " : ""}Category: ${categoryLabel}, ${priceFact}, ${isOutOfStock ? "Out of Stock" : "In Stock"}.`,
  );
  const isWishlisted = useSelector(isInWishlist(sku));

  // Read for display before recording this visit, so the current product
  // never appears in its own "Recently Viewed" list.
  const recentlyViewed = getRecentlyViewed(sku);

  useEffect(() => {
    recordProductView(product);
  }, [product]);

  // Drives MobileBuyBar: is the main Add to Cart row on screen, and has the
  // end of the product content (a sentinel after Recently Viewed) been
  // reached or scrolled past? Starts as "CTA visible" so the bar never
  // flashes in before the observer's first report.
  const ctaRef = useRef(null);
  const contentEndRef = useRef(null);
  const [isCtaVisible, setIsCtaVisible] = useState(true);
  const [isPastContent, setIsPastContent] = useState(false);

  useEffect(() => {
    const cta = ctaRef.current;
    const contentEnd = contentEndRef.current;
    if (!cta || !contentEnd || !("IntersectionObserver" in window)) return;
    const ctaObserver = new IntersectionObserver(([entry]) =>
      setIsCtaVisible(entry.isIntersecting),
    );
    // The root is stretched far above the viewport, so the sentinel counts
    // as "intersecting" whenever it's at or above the viewport's bottom
    // edge. With a plain viewport root, a fast scroll or jump (End key,
    // scrollTo) can carry it from below to above without it ever
    // intersecting, and no callback fires.
    const endObserver = new IntersectionObserver(
      ([entry]) => setIsPastContent(entry.isIntersecting),
      { rootMargin: "100000px 0px 0px 0px" },
    );
    ctaObserver.observe(cta);
    endObserver.observe(contentEnd);
    return () => {
      ctaObserver.disconnect();
      endObserver.disconnect();
    };
  }, []);

  const handleAddToCart = (quantity) => {
    if (isOutOfStock) return;
    dispatch(addItem(toCartItem(product, quantity)));
    showToast(`${productName} added to your bag`, {
      action: { label: "View bag", to: "/cart" },
    });
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeWishlistItem(sku));
      showToast(`${productName} removed from wishlist`);
    } else {
      dispatch(addWishlistItem(toWishlistItem(product)));
      showToast(`${productName} added to wishlist`);
    }
  };

  const detailRows = [
    ["Brand", brand],
    ["Size", isSizedCategory(category) && ONE_SIZE_NOTE],
    ["Material", woodType],
    [
      "Dimensions",
      dimensions &&
        `${dimensions.width} W × ${dimensions.height} H × ${dimensions.depth} D cm`,
    ],
  ];
  const shippingRows = [
    ["Delivery", shippingInformation],
    ["Warranty", warrantyInformation],
    ["Returns", returnPolicy],
  ];
  const hasDetails = detailRows.some(([, value]) => value);
  const hasShipping = shippingRows.some(([, value]) => value);

  return (
    <div className="container-foundation section">
      <Breadcrumb
        className="text-sm text-taupe mb-8"
        path={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/products" },
          { label: categoryLabel, to: `/products?category=${category}` },
          productName,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery images={images} productName={productName} />

        {/* Order: category → name → price (+ stock note) → description →
            buy controls → details accordions. */}
        <div>
          <p className={`${eyebrowClass} mb-3`}>{categoryLabel}</p>
          <h1 className="font-serif text-espresso font-medium text-3xl sm:text-4xl leading-tight mb-4">
            {productName}
          </h1>
          <p className="text-2xl font-medium text-charcoal">
            {formatPrice(NewPrice)}
            {OldPrice && (
              <span className="text-taupe line-through ml-3 text-lg font-normal">
                <span className="sr-only">Was </span>
                {formatPrice(OldPrice)}
              </span>
            )}
          </p>
          {/* Stock only as a status, never a raw count. */}
          {(isOutOfStock || isLowStock) && (
            <p className={`${eyebrowClass} mt-2`}>
              {isOutOfStock ? "Sold out" : "Low stock"}
            </p>
          )}
          <p className="text-taupe leading-relaxed mt-6 mb-8">{description}</p>

          <div ref={ctaRef}>
            <AddToCartControls
              key={sku}
              product={product}
              isOutOfStock={isOutOfStock}
              onAdd={handleAddToCart}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>

          {(hasDetails || hasShipping) && (
            <div className="mt-10 border-t border-stone">
              {hasDetails && (
                <Accordion title="Details" defaultOpen>
                  <FactList rows={detailRows} />
                </Accordion>
              )}
              {hasShipping && (
                <Accordion title="Shipping & returns">
                  <FactList rows={shippingRows} />
                </Accordion>
              )}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-espresso font-semibold text-2xl sm:text-3xl mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8">
            {relatedProducts.map((related) => (
              <ProductItem
                key={related.sku || related.id}
                product={related}
              />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-espresso font-semibold text-2xl sm:text-3xl mb-8">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8">
            {recentlyViewed.map((viewed) => (
              <ProductItem key={viewed.sku} product={viewed} />
            ))}
          </div>
        </section>
      )}

      {/* 1px tall: zero-area targets intersect unreliably. */}
      <div ref={contentEndRef} aria-hidden="true" className="h-px" />

      {!isOutOfStock && (
        <MobileBuyBar
          isVisible={!isCtaVisible && !isPastContent}
          productName={productName}
          price={formatPrice(NewPrice)}
          onAdd={handleAddToCart}
        />
      )}
    </div>
  );
};

export default ProductPage;
