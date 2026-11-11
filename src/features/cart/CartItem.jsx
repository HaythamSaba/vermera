import { Link } from "react-router";
import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { formatPrice } from "../../utils/pricing";
import { getCategoryLabel } from "../products/categories";

const CartItem = ({ item }) => {
  const {
    sku,
    productName,
    category,
    NewPrice,
    quantity,
    totalPrice,
    image,
    stock,
  } = item;

  return (
    <div className="flex gap-4 p-3 border border-stone hover:shadow-soft transition-shadow duration-300">
      {/* Image and name both link back to the product; the image link is
          aria-hidden/untabbable so keyboard and screen-reader users get one
          link per line, not two. */}
      <Link
        to={`/products/${sku}`}
        tabIndex={-1}
        aria-hidden="true"
        className="shrink-0"
      >
        <img
          src={image}
          alt=""
          className="w-20 h-20 object-cover border border-stone"
        />
      </Link>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-charcoal line-clamp-1">
            <Link
              to={`/products/${sku}`}
              className="hover:underline underline-offset-4 decoration-1"
            >
              {productName}
            </Link>
          </h3>
          <DeleteItem sku={sku} />
        </div>

        <p className="text-sm text-taupe mb-2">{getCategoryLabel(category)}</p>

        <div className="flex justify-between items-center">
          <UpdateItemQuantity sku={sku} quantity={quantity} max={stock} />

          <div className="text-right">
            <p className="text-sm text-taupe">{formatPrice(NewPrice)} each</p>
            <p className="font-semibold text-espresso">
              {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
