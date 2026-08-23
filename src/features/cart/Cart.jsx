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
import useDocumentTitle from "../../hooks/useDocumentTitle";

// `embedded`: render just the card, without the standalone-page container, for
// reuse inside another page's own layout (e.g. the Profile sidebar). When
// embedded, the host page owns the document title, so skip setting our own.
const Cart = ({ embedded = false }) => {
  useDocumentTitle(embedded ? null : "Cart");
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
  if (cart.length === 0) return <EmptyCart embedded={embedded} />;

  const card = (
    <div className="bg-cream border border-stone p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-medium text-espresso flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-brass" aria-hidden="true" />
            Cart Summary{!embedded && username && `, ${username}`}
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

        <div className="border-t border-stone pt-4 space-y-2 max-w-xl w-full flex flex-col m-auto">
          <div className="flex justify-between text-sm">
            <span className="text-taupe">Items</span>
            <span className="font-medium text-charcoal">{cartItemCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-taupe">Subtotal</span>
            <span className="font-medium text-charcoal">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone">
            <span className="text-charcoal">Total</span>
            <span className="text-espresso">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <MainButton
          fullWidth
          variant="quiet"
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

  if (embedded) return card;

  return (
    <div className="container-foundation section max-w-2xl mx-auto">{card}</div>
  );
};

export default Cart;
