function SimpleCartItem({ item }) {
  return (
    <div key={item.sku} className="flex gap-3 pb-4 border-b border-gray-200">
      <img
        src={item.image}
        alt={item.productName}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
          {item.productName}
        </h3>
        <p className="text-xs text-gray-500 capitalize">{item.category}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
          <span className="font-semibold text-primary-500">
            ${item.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SimpleCartItem;
