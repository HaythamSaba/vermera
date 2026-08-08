import { useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import { addItem } from "../cart/cartSlice";

const ProductPage = () => {
  const product = useLoaderData();
  const dispatch = useDispatch();

  const {
    productName,
    description,
    NewPrice,
    OldPrice,
    image,
    category,
    woodType,
    dimensions,
    stock,
  } = product;

  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(addItem(product));
  };

  return (
    <div className="container mx-auto p-8 mt-12 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <img
            src={image}
            alt={productName}
            className=" w-[550px] object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{productName}</h1>
          <p className="text-gray-600 mb-4 capitalize">Category: {category}</p>
          <p className="text-2xl font-bold mb-4">
            ${NewPrice.toFixed(2)}
            {OldPrice && (
              <span className="text-gray-500 line-through ml-2">
                ${OldPrice.toFixed(2)}
              </span>
            )}
          </p>
          <p className="text-gray-700 mb-6">{description}</p>

          {woodType && (
            <p className="mb-2">
              <strong>Wood Type:</strong> {woodType}
            </p>
          )}
          {dimensions && (
            <p className="mb-2">
              <strong>Dimensions:</strong> {dimensions.width}W x{" "}
              {dimensions.height}H x {dimensions.depth}D cm
            </p>
          )}
          <p className="mb-4">
            <strong>Stock:</strong> {stock} available
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
