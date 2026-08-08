import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";

const CartItem = ({ item }) => {
  const { sku, productName, category, NewPrice, quantity, totalPrice, image } =
    item;

  return (
    <div className="flex gap-4 p-3 border border-gray-200 rounded-lg hover:shadow-lg transition">
      {/* Product Image */}
      <img
        src={image}
        alt={productName}
        className="w-20 h-20 object-cover rounded-md"
      />

      {/* Product Details */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-900 line-clamp-1">
            {productName}
          </h3>
          <DeleteItem sku={sku} />
        </div>

        <p className="text-sm text-gray-500 capitalize mb-2">{category}</p>

        {/* Price and Quantity Controls */}
        <div className="flex justify-between items-center">
          <UpdateItemQuantity sku={sku} quantity={quantity} />

          <div className="text-right">
            <p className="text-sm text-gray-500">${NewPrice.toFixed(2)} each</p>
            <p className="font-semibold text-primary-600">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
