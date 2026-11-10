import { STORAGE_KEYS } from "../../utils/storageKeys";
/* eslint-disable react-refresh/only-export-components */

import { useLoaderData, useNavigate } from "react-router";
import MainButton from "../../ui/MainButton";
import UpdateOrder from "./UpdateOrder";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useMetaDescription from "../../hooks/useMetaDescription";
import {
  computeOrderTotals,
  formatPrice,
  getSubtotal,
} from "../../utils/pricing";

const OrderConfirmation = () => {
  const order = useLoaderData();
  const navigate = useNavigate();

  useDocumentTitle(order?.items ? `Order #${order.id}` : "Order Not Found");
  useMetaDescription(
    order?.items
      ? `Order #${order.id} confirmed — ${order.items.length} item${order.items.length === 1 ? "" : "s"}.`
      : "We couldn't find this order — check the link and try again.",
  );

  // Safely check if order and items exist
  if (!order || !order.items) {
    return (
      <div className="container-foundation section text-center">
        <h1 className="text-2xl font-serif font-semibold text-espresso mb-4">
          Order Not Found
        </h1>
        <p className="text-taupe mb-6">We couldn't find this order.</p>
        <MainButton
          variant="quiet"
          content="Go to Products"
          onClick={() => navigate("/products")}
        />
      </div>
    );
  }

  // Show the amounts saved with the order (what the shopper agreed to at
  // checkout). Only orders saved before those fields existed fall back to
  // recomputing. `??`, not `||`, so complimentary shipping (0) stays 0.
  const subtotal = getSubtotal(order.items);
  const fallback = computeOrderTotals(subtotal, { express: order.fastOrder });
  const shipping = order.shipping ?? fallback.shipping;
  const tax = order.tax ?? fallback.tax;
  const total = order.total ?? subtotal + shipping + tax;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Estimated delivery date (5-7 days from now, or 1-2 for express)
  const deliveryDays = order.fastOrder ? 2 : 7;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);
  const deliveryDate = estimatedDelivery.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="container-foundation section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-taupe mb-3">Order confirmed</p>
          <h1 className="text-4xl font-serif font-medium text-espresso mb-3">
            Thank you, {order.customer.name}.
          </h1>
          <p className="text-taupe">
            Your order number is{" "}
            <span className="font-serif text-xl text-espresso">
              #{order.id}
            </span>
          </p>
        </div>

        <div className="bg-cream border border-stone p-6 mb-6">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-taupe mb-4">Order details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-taupe">Order date</p>
              <p className="font-medium text-charcoal">{orderDate}</p>
            </div>

            <div>
              <div>
                <p className="text-sm text-taupe">Estimated delivery</p>
                <p className="font-medium text-charcoal">
                  {deliveryDate}
                  {order.fastOrder && (
                    <span className="ml-2 text-xs bg-brass/15 text-espresso px-2 py-1 rounded">
                      Express
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-cream border border-stone p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-taupe mb-4">Contact</h2>
            <div className="space-y-2 text-sm">
              <p className="text-charcoal font-medium">{order.customer.name}</p>
              <p className="text-taupe">{order.customer.phone}</p>
              {order.customer.email && (
                <p className="text-taupe">{order.customer.email}</p>
              )}
            </div>
          </div>

          <div className="bg-cream border border-stone p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-taupe mb-4">Shipping address</h2>
            <div className="space-y-1 text-sm text-taupe">
              <p>{order.customer.address}</p>
              <p>
                {order.customer.city}, {order.customer.zipCode}
              </p>
              <p>{order.customer.country}</p>
            </div>
          </div>
        </div>

        <div className="bg-cream border border-stone p-6 mb-6">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-taupe mb-4">Items ({order.items.length})</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.sku}
                className="flex gap-4 pb-4 border-b border-stone last:border-0"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 object-cover border border-stone"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-charcoal">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-taupe capitalize">
                    Category: {item.category}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-taupe">
                      {formatPrice(item.price)} × {item.quantity}
                    </span>
                    <span className="font-semibold text-espresso">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cream border border-stone p-6 mb-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-taupe">Payment summary</h2>
            <UpdateOrder order={order} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-taupe">Subtotal</span>
              <span className="font-medium text-charcoal">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-taupe">
                Shipping {order.fastOrder && "(Express)"}
              </span>
              <span className="font-medium text-charcoal">
                {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-taupe">Tax</span>
              <span className="font-medium text-charcoal">
                {formatPrice(tax)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-stone">
              <p className="text-charcoal">
                Total Price{" "}
                <span className="text-sm text-taupe font-normal">
                  (you will pay this amount on delivery)
                </span>
              </p>
              <span className="text-espresso">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <MainButton
          fullWidth
          variant="outline"
          content="Continue Shopping"
          onClick={() => navigate("/products")}
        />
      </div>
    </div>
  );
};

export async function loader({ params }) {
  const { orderId } = params;

  const ordersJSON = localStorage.getItem(STORAGE_KEYS.orders);

  if (!ordersJSON) {
    throw new Response("No orders found", { status: 404 });
  }

  const orders = JSON.parse(ordersJSON);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    throw new Response("Order not found", { status: 404 });
  }

  return order;
}

export default OrderConfirmation;
