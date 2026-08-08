import { Receipt } from "lucide-react";

const OrderSummary = ({
  cart,
  totalPrice,
  totalQuantity,
  baseShipping,
  expressCost,
  tax,
  finalTotal,
  isExpressShipping,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="xl:text-2xl text-lg font-semibold text-gray-900 flex items-center">
            <Receipt className="w-6 h-6 mr-2 text-primary-500" />
            <span>Order Summary</span>
          </h2>
          <span className="ml-auto text-sm text-gray-600">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="space-y-4 mb-6 overflow-y-auto">
          {cart.map((item) => (
            <div
              key={item.sku}
              className="flex gap-3 pb-4 border-b border-gray-200"
            >
              <img
                src={item.image}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                  {item.productName}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                  {item.category}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-semibold text-primary-500">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Standard Shipping</span>
            <span className="font-medium">${baseShipping.toFixed(2)}</span>
          </div>

          {isExpressShipping && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Express Shipping</span>
              <span className="font-medium text-primary-500">
                + ${expressCost.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (8%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
            <span>Total</span>
            <span className="text-primary-500">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
