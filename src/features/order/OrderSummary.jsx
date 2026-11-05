import { Receipt } from "lucide-react";
import SimpleCartItem from "../cart/SimpleCartItem";
import { formatPrice, TAX_RATE } from "../../utils/pricing";

// `totals` comes from computeOrderTotals() in utils/pricing.js — the same
// function the order action uses, so this summary always matches the
// saved order.
const OrderSummary = ({ cart, totalQuantity, totals }) => {
  const {
    subtotal,
    standardShipping,
    expressSurcharge,
    tax,
    total,
    isFreeStandardShipping,
  } = totals;

  return (
    <div className="lg:col-span-1">
      <div className="bg-cream border-2 border-dashed border-stone p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="xl:text-2xl text-lg font-serif font-medium text-espresso flex items-center">
            <Receipt className="w-6 h-6 mr-2 text-brass" aria-hidden="true" />
            <span>Order Summary</span>
          </h2>
          <span className="ml-auto text-sm text-taupe">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="space-y-4 mb-6 overflow-y-auto">
          {cart.map((item) => (
            <SimpleCartItem key={item.sku} item={item} />
          ))}
        </div>

        <div className="space-y-3 border-t border-stone pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-taupe">Subtotal</span>
            <span className="font-medium text-charcoal">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-taupe">Standard Shipping</span>
            <span className="font-medium text-charcoal">
              {isFreeStandardShipping
                ? "Complimentary"
                : formatPrice(standardShipping)}
            </span>
          </div>

          {expressSurcharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-taupe">Express Shipping</span>
              <span className="font-medium text-brass-ink">
                + {formatPrice(expressSurcharge)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-taupe">Tax ({Math.round(TAX_RATE * 100)}%)</span>
            <span className="font-medium text-charcoal">
              {formatPrice(tax)}
            </span>
          </div>

          <div className="flex justify-between text-lg font-semibold pt-3 border-t border-stone">
            <span className="text-charcoal">Total</span>
            <span className="text-espresso">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
