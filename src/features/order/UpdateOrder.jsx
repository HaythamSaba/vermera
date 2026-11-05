/* eslint-disable react-refresh/only-export-components */

import { useFetcher } from "react-router";
import { Truck, Zap } from "lucide-react";
import {
  computeOrderTotals,
  formatPrice,
  getSubtotal,
} from "../../utils/pricing";

const formatShipping = (amount) =>
  amount === 0 ? "Complimentary" : formatPrice(amount);

const UpdateOrder = ({ order }) => {
  const fetcher = useFetcher();

  const isUpdating = fetcher.state === "submitting";
  const currentlyExpress = order.fastOrder;

  // Priced from this order's own subtotal, so the free-delivery threshold
  // applies here exactly as it did at checkout.
  const subtotal = getSubtotal(order.items);
  const standardShipping = computeOrderTotals(subtotal).shipping;
  const expressShipping = computeOrderTotals(subtotal, {
    express: true,
  }).shipping;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-charcoal">Shipping Speed:</p>

      <div className="flex gap-3 flex-wrap">
        <fetcher.Form method="PATCH">
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="shippingType" value="standard" />
          <button
            type="submit"
            disabled={isUpdating || !currentlyExpress}
            className={`flex items-center gap-2 px-4 py-2 border transition-all ${
              !currentlyExpress
                ? "border-brass bg-brass/10 text-espresso"
                : "border-stone bg-cream text-charcoal hover:border-brass"
            } ${
              isUpdating || !currentlyExpress
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <Truck className="w-4 h-4" aria-hidden="true" />
            <div className="text-left">
              <p className="font-semibold text-sm">Standard</p>
              <p className="text-xs">
                5-7 days • {formatShipping(standardShipping)}
              </p>
            </div>
            {!currentlyExpress && (
              <span className="ml-2 text-xs bg-brass/20 text-espresso px-2 py-0.5 rounded">
                Active
              </span>
            )}
          </button>
        </fetcher.Form>

        <fetcher.Form method="PATCH">
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="shippingType" value="express" />
          <button
            type="submit"
            disabled={isUpdating || currentlyExpress}
            className={`flex items-center gap-2 px-4 py-2 border transition-all ${
              currentlyExpress
                ? "border-brass bg-brass/10 text-espresso"
                : "border-stone bg-cream text-charcoal hover:border-brass"
            } ${
              isUpdating || currentlyExpress
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <Zap className="w-4 h-4" aria-hidden="true" />
            <div className="text-left">
              <p className="font-semibold text-sm">Express</p>
              <p className="text-xs">
                1-2 days • {formatShipping(expressShipping)}
              </p>
            </div>
            {currentlyExpress && (
              <span className="ml-2 text-xs bg-brass/20 text-espresso px-2 py-0.5 rounded">
                Active
              </span>
            )}
          </button>
        </fetcher.Form>
      </div>

      {isUpdating && (
        <p className="text-sm text-taupe animate-pulse">
          Updating shipping method...
        </p>
      )}
    </div>
  );
};

// Action to handle the order update
export async function action({ request, params }) {
  const formData = await request.formData();
  const orderId = formData.get("orderId") || params.orderId;
  const shippingType = formData.get("shippingType"); // "standard" or "express"

  // Get orders from localStorage
  const ordersJSON = localStorage.getItem("furniture_orders");
  if (!ordersJSON) {
    throw new Error("No orders found");
  }

  const orders = JSON.parse(ordersJSON);

  // Find the order to update
  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) {
    throw new Error("Order not found");
  }

  // Re-price through the shared pricing module so the stored shipping and
  // total stay consistent with checkout (including free standard delivery).
  const isExpress = shippingType === "express";
  const totals = computeOrderTotals(getSubtotal(orders[orderIndex].items), {
    express: isExpress,
  });

  // Update the order
  const updatedOrder = {
    ...orders[orderIndex],
    fastOrder: isExpress,
    shipping: totals.shipping,
    tax: totals.tax,
    total: totals.total,
    updatedAt: new Date().toISOString(),
  };

  // Replace the old order with updated one
  orders[orderIndex] = updatedOrder;

  // Save back to localStorage
  localStorage.setItem("furniture_orders", JSON.stringify(orders));

  // Return the updated order to refresh the page
  return updatedOrder;
}

export default UpdateOrder;
