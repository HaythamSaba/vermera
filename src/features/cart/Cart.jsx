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

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-taupe">{label}</span>
    <span className="font-medium text-charcoal">{value}</span>
  </div>
);

// Totals + checkout actions. Same shared pricing as checkout (standard
// delivery), so shipping and tax aren't a surprise there. Express is chosen
// at checkout.
const CartSummary = ({ itemCount, cartTotal, onCheckout, onContinue }) => {
  const estimate = computeOrderTotals(cartTotal);
  const deliveryValue = estimate.isFreeStandardShipping
    ? "Free"
    : formatPrice(estimate.standardShipping);
  const deliveryNote = estimate.isFreeStandardShipping
    ? "Free standard delivery applied."
    : `Free standard delivery on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD, { wholeUnits: true })}.`;

  return (
    <>
      <div className="space-y-2">
        <SummaryRow label="Items" value={itemCount} />
        <SummaryRow label="Subtotal" value={formatPrice(estimate.subtotal)} />
        <SummaryRow label="Standard delivery" value={deliveryValue} />
        <SummaryRow label="Estimated tax" value={formatPrice(estimate.tax)} />
        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone">
          <span className="text-charcoal">Estimated total</span>
          <span className="text-espresso">{formatPrice(estimate.total)}</span>
        </div>
        <p className="text-xs text-taupe">
          {deliveryNote} Express delivery can be chosen at checkout.
        </p>
      </div>

      <MainButton
        fullWidth
        variant="quiet"
        content="Proceed to Checkout"
        onClick={onCheckout}
        className="mt-6"
      >
        <ShoppingBag size={18} aria-hidden="true" />
      </MainButton>

      <MainButton
        variant="outline"
        fullWidth
        content="Continue Shopping"
        className="mt-4"
        onClick={onContinue}
      />
    </>
  );
};

// `embedded`: render just one stacked card, without the standalone-page
// layout, for reuse inside another page's own layout. When embedded, the host
// page owns the document title, so skip setting our own.
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

  if (cart.length === 0) return <EmptyCart embedded={embedded} />;

  // The page's <h1> on /cart; a section heading when embedded.
  const Heading = embedded ? "h2" : "h1";

  const heading = (
    <Heading
      className={`font-serif font-medium text-espresso flex items-center ${
        embedded ? "text-xl mb-4" : "text-3xl mb-6"
      }`}
    >
      <ShoppingBag
        className={`${embedded ? "w-5 h-5" : "w-6 h-6"} mr-2 text-brass`}
        aria-hidden="true"
      />
      Your bag
    </Heading>
  );

  const lines = (
    <div className="space-y-4">
      {cart.map((item) => (
        <CartItem key={item.sku} item={item} />
      ))}
    </div>
  );

  const summary = (
    <CartSummary
      itemCount={cartItemCount}
      cartTotal={cartTotal}
      onCheckout={() => navigate("/order/newOrder")}
      onContinue={() => navigate("/products")}
    />
  );

  if (embedded) {
    return (
      <div className="bg-cream border border-stone p-6 sm:p-8">
        {heading}
        {lines}
        <div className="border-t border-stone pt-4 mt-6">{summary}</div>
      </div>
    );
  }

  // lg+: lines on the left, a sticky summary on the right so the totals and
  // checkout stay in view on a long bag. Below lg it stacks, summary last.
  return (
    <div className="container-foundation section">
      {heading}
      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">{lines}</div>
        <section
          aria-labelledby="bag-summary-heading"
          className="bg-cream border border-stone p-6 sm:p-8 lg:sticky lg:top-24"
        >
          <h2
            id="bag-summary-heading"
            className="font-serif text-xl font-medium text-espresso mb-4"
          >
            Order summary
          </h2>
          {summary}
        </section>
      </div>
    </div>
  );
};

export default Cart;
