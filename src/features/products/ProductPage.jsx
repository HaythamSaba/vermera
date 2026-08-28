import { useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import { addItem, toCartItem } from "../cart/cartSlice";
import MainButton from "../../ui/MainButton";
import ProductGallery from "./ProductGallery";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const ProductPage = () => {
  const product = useLoaderData();
  useDocumentTitle(product.productName);
  const dispatch = useDispatch();

  const {
    productName,
    description,
    NewPrice,
    OldPrice,
    images,
    category,
    woodType,
    dimensions,
    stock,
  } = product;

  let formattedCategory = category.replace(/-/g, " ");

  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(addItem(toCartItem(product)));
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
          <p className="mb-8 text-charcoal">
            <strong className="font-medium">Stock:</strong>{" "}
            {isOutOfStock ? "Out of stock" : `${stock} available`}
          </p>

          <MainButton
            content={isOutOfStock ? "Sold Out" : "Add to Cart"}
            variant="quiet"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
