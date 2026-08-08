import { ShoppingCart, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import CartItem from "./CartItem";
import {
  getCart,
  getTotalCartQuantity,
  getTotalCartPrice,
  clearCart,
} from "./cartSlice";
import MainButton from "../../ui/MainButton";
import EmptyCart from "./EmptyCart";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state) => state.user.username);
  const cart = useSelector(getCart);
  const cartItemCount = useSelector(getTotalCartQuantity);
  const cartTotal = useSelector(getTotalCartPrice);

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/order/newOrder");
  };

  // Empty cart state
  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8 border border-primary-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-primary-600" />
          Cart Summary{username && `, ${username}`}
        </h2>
        {cart.length > 0 && (
          <MainButton
            variant="danger"
            onClick={handleClearCart}
            title="Clear cart"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </MainButton>
        )}
      </div>

      <div className="space-y-4 mb-6 overflow-y-auto">
        {cart.map((item) => (
          <CartItem key={item.sku} item={item} />
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items</span>
          <span className="font-medium">{cartItemCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          <span className="text-primary-600">${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <MainButton
        fullWidth
        content="Proceed to Checkout"
        onClick={handleCheckout}
        className="mt-6"
      >
        <ShoppingCart size={18} />
      </MainButton>

      <MainButton
        variant="outline"
        fullWidth
        content="Continue Shopping"
        className="mt-4"
        onClick={() => navigate("/products")}
      />
    </div>
  );
};

export default Cart;
