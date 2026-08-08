import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import MainButton from "../../ui/MainButton";
import { useDispatch, useSelector } from "react-redux";
import { addItem, getCurrentQuantityBySku, isInCart } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();

  const {
    productName,
    description,
    NewPrice,
    OldPrice,
    image,
    isNew,
    isDiscount,
    DiscountPercentage,
    stock,
    category,
    sku,
  } = product;

  const isItemInCart = useSelector(isInCart(product.sku));
  const currentQuantity = useSelector(getCurrentQuantityBySku(product.sku));

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();

  const isOutOfStock = stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    dispatch(addItem(product));
  };

  const handleOpenProductPage = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;

    // Add your product page logic here
    navigate(`/products/${sku}`);
  };

  // const handleLike = (e) => {
  //   e.preventDefault();
  //   // Add like/wishlist functionality
  //   console.log("Liked:", product);
  // };

  return (
    <div className="relative group">
      {/* Status Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="bg-[#2EC1AC] rounded-full text-white py-3 px-[7px] text-sm font-semibold shadow-md">
            New
          </span>
        )}
        {isDiscount && (
          <span className="bg-[#E97171] rounded-full text-white py-3 px-1 text-sm font-semibold shadow-md">
            -{Math.round(DiscountPercentage)}%
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-800 rounded-full text-white py-3 px-2 text-sm font-semibold shadow-md">
            Sold Out
          </span>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-6 z-10">
        {isOutOfStock ? (
          <span className="text-white text-lg font-semibold bg-red-600 px-4 py-2 rounded-lg">
            Out of Stock
          </span>
        ) : (
          <>
            <MainButton
              onClick={handleOpenProductPage}
              disabled={isOutOfStock}
              variant="secondary"
              content={"More Info"}
            >
              <ShoppingCart size={18} />
            </MainButton>
            {isItemInCart ? (
              <>
                <UpdateItemQuantity sku={sku} quantity={currentQuantity} />
                <DeleteItem sku={sku} />
              </>
            ) : (
              <MainButton
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant="secondary"
                content={"Add to Cart"}
              >
                <ShoppingCart size={18} />
              </MainButton>
            )}
          </>
        )}
      </div>

      {/* Product Image */}
      <div className="overflow-hidden bg-gray-100 relative">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        )}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ShoppingCart size={48} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={image}
            alt={productName}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="bg-[#F4F5F7] p-4 pr-6 min-w-[285px] h-[200px] flex flex-col justify-between">
        <div>
          <h3
            className="font-semibold text-2xl text-[#3A3A3A] mb-2 line-clamp-1"
            title={productName}
          >
            {productName}
          </h3>
          <p className="text-sm text-[#898989] mb-1 capitalize">{category}</p>
          <p
            className="text-base text-[#898989] line-clamp-2"
            title={description}
          >
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <span className="font-semibold text-xl text-[#3A3A3A]">
            ${NewPrice.toFixed(2)}
          </span>
          {OldPrice && (
            <span className="text-base font-normal text-[#B0B0B0] line-through">
              ${OldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
