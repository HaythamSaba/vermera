function SimpleCartItem({ item }) {
  return (
    <div key={item.sku} className="flex gap-3 pb-4 border-b border-stone">
      <img
        src={item.image}
        alt={item.productName}
        className="w-16 h-16 object-cover border border-stone"
      />
      <div className="flex-1">
        <h3 className="font-medium text-sm text-charcoal line-clamp-1">
          {item.productName}
        </h3>
        <p className="text-xs text-taupe capitalize">{item.category}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-taupe">Qty: {item.quantity}</span>
          <span className="font-semibold text-espresso">
            ${item.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SimpleCartItem;
