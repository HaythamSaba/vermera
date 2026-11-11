import { ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CartItem from "./CartItem";
import {
  getCart,
  getTotalCartQuantity,
  getTotalCartPrice,
} from "./cartSlice";
import MainButton from "../../ui/MainButton";
import EmptyCart from "./EmptyCart";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useMetaDescription from "../../hooks/useMetaDescription";
import {
  computeOrderTotals,
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
} from "../../utils/pricing";

// `embedded`: render just the card, without the standalone-page container, for
// reuse inside another page's own layout (e.g. the Profile sidebar). When
// embedded, the host page owns the document title, so skip setting our own.
const Cart = ({ embedded = false }) => {
  useDocumentTitle(embedded ? null : "Bag");
  const navigate = useNavigate();

  const cart = useSelector(getCart);
  const cartItemCount = useSelector(getTotalCartQuantity);
  const cartTotal = useSelector(getTotalCartPrice);
  useMetaDescription(
    embedded
      ? null
      : cart.length > 0
        ? `Your Vermera bag — Items: ${cartItemCount}, Subtotal: ${formatPrice(cartTotal)}. Review and proceed to checkout.`
        : "Your Vermera bag is empty — browse the shop to add bags, dresses, jewellery, shoes, watches, and beauty essentials.",
  );

  const handleCheckout = () => {
    navigate("/order/newOrder");
  };

  if (cart.length === 0) return <EmptyCart embedded={embedded} />;

  // Same shared pricing as checkout (standard delivery), so shipping and
  // tax aren't a surprise there. Express is chosen at checkout.
  const estimate = computeOrderTotals(cartTotal);
  // The page's <h1> on /cart; a section heading when embedded in Profile.
  const Heading = embedded ? "h2" : "h1";

  const card = (
    <div className="bg-cream border border-stone p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <Heading
            className={`font-serif font-medium text-espresso flex items-center ${
              embedded ? "text-xl" : "text-3xl"
            }`}
          >
            <ShoppingBag
              className={`${embedded ? "w-5 h-5" : "w-6 h-6"} mr-2 text-brass`}
              aria-hidden="true"
            />
            Your bag
          </Heading>
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
              {formatPrice(estimate.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-taupe">Standard delivery</span>
            <span className="font-medium text-charcoal">
              {estimate.isFreeStandardShipping
                ? "Free"
                : formatPrice(estimate.standardShipping)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-taupe">Estimated tax</span>
            <span className="font-medium text-charcoal">
              {formatPrice(estimate.tax)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone">
            <span className="text-charcoal">Estimated total</span>
            <span className="text-espresso">{formatPrice(estimate.total)}</span>
          </div>
          <p className="text-xs text-taupe">
            {estimate.isFreeStandardShipping
              ? "Free standard delivery applied."
              : `Free standard delivery on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD, { wholeUnits: true })}.`}{" "}
            Express delivery can be chosen at checkout.
          </p>
        </div>

        <MainButton
          fullWidth
          variant="quiet"
          content="Proceed to Checkout"
          onClick={handleCheckout}
          className="mt-6"
        >
          <ShoppingBag size={18} aria-hidden="true" />
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
