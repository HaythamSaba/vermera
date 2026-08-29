import { useState } from "react";
import { useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { addItem, toCartItem } from "../cart/cartSlice";
import MainButton from "../../ui/MainButton";
import ProductGallery from "./ProductGallery";
import ProductItem from "./ProductItem";
import QuantitySelector from "./QuantitySelector";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useToast } from "../../hooks/useToast";

// Quantity state lives here, keyed by sku at the call site below — React
// Router keeps ProductPage mounted across a sku change (only loader data
// changes), so keying this component forces a remount (and so a reset back
// to 1) whenever the user lands on a different product, without needing an
// effect to reset state imperatively.
const AddToCartControls = ({ product, isOutOfStock, onAdd }) => {
  const [quantity, setQuantity] = useState(1);
  const max = product.stock;

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
      <MainButton
        content={isOutOfStock ? "Sold Out" : "Add to Cart"}
        variant="quiet"
        disabled={isOutOfStock}
        onClick={() => onAdd(quantity)}
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
    productName,
    description,
    NewPrice,
    OldPrice,
    images,
    category,
    brand,
    tags,
    woodType,
    dimensions,
    stock,
    availabilityStatus,
    shippingInformation,
    warrantyInformation,
    returnPolicy,
  } = product;

  let formattedCategory = category.replace(/-/g, " ");

  const isOutOfStock = stock === 0;
  const isLowStock = !isOutOfStock && availabilityStatus === "Low Stock";

  const handleAddToCart = (quantity) => {
    if (isOutOfStock) return;
    dispatch(addItem(toCartItem(product, quantity)));
    showToast(`${productName} added to cart`);
  };

  return (
    <div className="container-foundation section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery images={images} productName={productName} />

        <div>
          <p className="text-taupe capitalize mb-2">{formattedCategory}</p>
          <h1 className="font-serif text-espresso font-semibold text-3xl sm:text-4xl leading-tight mb-4">
            {productName}
          </h1>
          <p className="text-2xl font-semibold text-charcoal mb-6">
            ${NewPrice.toFixed(2)}
            {OldPrice && (
              <span className="text-taupe line-through ml-3 text-lg font-normal">
                ${OldPrice.toFixed(2)}
              </span>
            )}
          </p>
          <p className="text-taupe leading-relaxed mb-8">{description}</p>

          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-8" aria-label="Product tags">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-stone px-3 py-1 text-xs text-taupe capitalize"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {brand && (
            <p className="mb-2 text-charcoal">
              <strong className="font-medium">Brand:</strong> {brand}
            </p>
          )}
          {woodType && (
            <p className="mb-2 text-charcoal">
              <strong className="font-medium">Wood Type:</strong> {woodType}
            </p>
          )}
          {dimensions && (
            <p className="mb-2 text-charcoal">
              <strong className="font-medium">Dimensions:</strong>{" "}
              {dimensions.width}W x {dimensions.height}H x {dimensions.depth}D
              cm
            </p>
          )}
          <p className="mb-8 text-charcoal flex items-center gap-3">
            <span>
              <strong className="font-medium">Stock:</strong>{" "}
              {isOutOfStock ? "Out of stock" : `${stock} available`}
            </span>
            {isLowStock && (
              <span className="rounded-full bg-taupe text-cream py-1 px-3 text-xs font-semibold uppercase tracking-wider">
                Low Stock
              </span>
            )}
          </p>

          <AddToCartControls
            key={product.sku}
            product={product}
            isOutOfStock={isOutOfStock}
            onAdd={handleAddToCart}
          />

          {(shippingInformation || warrantyInformation || returnPolicy) && (
            <ul className="mt-8 pt-8 border-t border-stone flex flex-col gap-3">
              {shippingInformation && (
                <li className="flex items-center gap-3 text-charcoal">
                  <Truck
                    className="w-5 h-5 text-brass shrink-0"
                    aria-hidden="true"
                  />
                  {shippingInformation}
                </li>
              )}
              {warrantyInformation && (
                <li className="flex items-center gap-3 text-charcoal">
                  <ShieldCheck
                    className="w-5 h-5 text-brass shrink-0"
                    aria-hidden="true"
                  />
                  {warrantyInformation}
                </li>
              )}
              {returnPolicy && (
                <li className="flex items-center gap-3 text-charcoal">
                  <RotateCcw
                    className="w-5 h-5 text-brass shrink-0"
                    aria-hidden="true"
                  />
                  {returnPolicy}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-espresso font-semibold text-2xl sm:text-3xl mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((related) => (
              <ProductItem
                key={related.sku || related.id}
                product={related}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
