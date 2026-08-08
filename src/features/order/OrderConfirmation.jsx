/* eslint-disable react-refresh/only-export-components */

import { useLoaderData, useNavigate } from "react-router";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  CreditCard,
  Calendar,
  ChartNoAxesColumn,
} from "lucide-react";
import MainButton from "../../ui/MainButton";
import UpdateOrder from "./UpdateOrder";

const OrderConfirmation = () => {
  const order = useLoaderData();
  const navigate = useNavigate();

  // Debug: Log the order to see what we got
  console.log("Order data:", order);

  // Safely check if order and items exist
  if (!order || !order.items) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">We couldn't find this order.</p>
          <MainButton
            content="Go to Products"
            onClick={() => navigate("/products")}
          />
        </div>
      </div>
    );
  }

  // Calculate totals from order data
  const subtotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = order.shipping || 15.0;
  const tax = order.tax || subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Format date
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase, {order.customer.name}
          </p>
          {order.orderNumber && (
            <p className="text-sm text-gray-500 mt-2">
              Order #{order.orderNumber}
            </p>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartNoAxesColumn className="w-5 h-5 mr-2 text-primary-500" />
            Order Status #{order.id}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-gray-900">{orderDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-medium text-gray-900">
                  {deliveryDate}
                  {order.fastOrder && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      Express
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-500" />
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900 font-medium">
                Customer Name: {order.customer.name}
              </p>
              <p className="text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {order.customer.phone}
              </p>
              {order.customer.email && (
                <p className="text-gray-600">📧 {order.customer.email}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-500" />
              Shipping Address
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{order.customer.address}</p>
              <p>
                {order.customer.city}, {order.customer.zipCode}
              </p>
              <p>{order.customer.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary-500" />
            Order Items ({order.items.length})
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.sku}
                className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {item.productName}
                  </h4>
                  <p className="text-sm text-gray-500 capitalize">
                    Category: {item.category}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </span>
                    <span className="font-semibold text-primary-500">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary-500" />
              Payment Summary
            </h3>
            <UpdateOrder order={order} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Shipping {order.fastOrder && "(Express)"}
              </span>
              <span className="font-medium">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
              <p>Total Price <span className="text-md text-gray-500 font-light">(you will pay this amount on delivery)</span></p>
              <span className="text-primary-500">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <MainButton
          fullWidth
          content="Continue Shopping"
          onClick={() => navigate("/products")}
        >
          <Package size={18} />
        </MainButton>
      </div>
    </div>
  );
};

// Loader to get order data
export async function loader({ params }) {
  const { orderId } = params;

  // Get orders from localStorage
  const ordersJSON = localStorage.getItem("furniture_orders");

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
