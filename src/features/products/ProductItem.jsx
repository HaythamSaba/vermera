import { ImageOff, Info, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import MainButton from "../../ui/MainButton";
import { useDispatch, useSelector } from "react-redux";
import { addItem, getCurrentQuantityBySku, isInCart } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "../../utils/motion";

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
    dispatch(addItem(product));
  };

  const handleOpenProductPage = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;

    navigate(`/products/${sku}`);
  };

  const badgeClass =
    "rounded-full py-1.5 px-3 text-xs font-semibold uppercase tracking-wider";

  return (
    <MotionDiv className="product-card relative group" variants={cardVariants}>
      {/* Status Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {isNew && (
          <span
            className={`${badgeClass} bg-cream text-charcoal border border-stone`}
          >
            New
          </span>
        )}
        {isDiscount && (
          <span className={`${badgeClass} bg-brass text-cream`}>
            -{Math.round(DiscountPercentage)}%
          </span>
        )}
        {isOutOfStock && (
          <span className={`${badgeClass} bg-espresso text-cream`}>
            Sold Out
          </span>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-espresso/70 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out flex flex-col items-center justify-center gap-6 z-10">
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
              content={"More Info"}
            >
              <Info size={22} />
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
                variant="light"
                content={"Add to Cart"}
              >
                <ShoppingCart size={22} />
              </MainButton>
            )}
          </>
        )}
      </div>

      <div className="border border-stone overflow-hidden">
        {/* Product Image */}
        <div className="relative bg-stone/20">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-stone border-t-brass rounded-full animate-spin"></div>
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
            <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              <MotionImg
                src={image}
                variants={imageVariants}
                initial="initial"
                animate="visible"
                exit="initial"
                alt={productName}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-cream p-4 pr-6 min-w-[285px] h-[200px] flex flex-col justify-between">
          <div>
            <h3
              className="font-semibold text-2xl text-charcoal mb-2 line-clamp-1"
              title={productName}
            >
              {productName}
            </h3>
            <p className="text-sm text-taupe mb-1 capitalize">{category}</p>
            <p
              className="text-base text-taupe line-clamp-2"
              title={description}
            >
              {description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-auto">
            <span className="font-semibold text-xl text-charcoal">
              ${NewPrice.toFixed(2)}
            </span>
            {OldPrice && (
              <span className="text-base font-normal text-taupe line-through">
                ${OldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default ProductItem;