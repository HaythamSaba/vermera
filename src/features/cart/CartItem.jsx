import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { formatPrice } from "../../utils/pricing";

const CartItem = ({ item }) => {
  const { sku, productName, category, NewPrice, quantity, totalPrice, image } =
    item;

  return (
    <div className="flex gap-4 p-3 border border-stone hover:shadow-soft transition-shadow duration-300">
      <img
        src={image}
        alt={productName}
        className="w-20 h-20 object-cover border border-stone"
      />

      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-charcoal line-clamp-1">
            {productName}
          </h3>
          <DeleteItem sku={sku} />
        </div>

        <p className="text-sm text-taupe capitalize mb-2">{category}</p>

        <div className="flex justify-between items-center">
          <UpdateItemQuantity sku={sku} quantity={quantity} />

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
