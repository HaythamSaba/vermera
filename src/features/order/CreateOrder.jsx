/* eslint-disable react-refresh/only-export-components */
import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  useNavigate,
} from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  getTotalCartPrice,
  getTotalCartQuantity,
} from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import generateOrderId from "../../utils/helpers";
import MainButton from "../../ui/MainButton";

import CustomerInfo from "./CustomerInfo";
import ShippingAddress from "./ShippingAddress";
import ShippingOptions from "./ShippingOptions";
import OrderSummary from "./OrderSummary";
import useOrderTotals from "../../hooks/useOrderTotals";

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const CreateOrder = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    username,
    status: addressStatus,
    position,
    addressComponents,
    error: addressError,
  } = useSelector((state) => state.user);

  const cart = useSelector(getCart);
  const totalPrice = useSelector(getTotalCartPrice);
  const totalQuantity = useSelector(getTotalCartQuantity);

  const [isExpressShipping, setIsExpressShipping] = useState(false);

  const { shippingCost, expressCost, tax, finalTotal } = useOrderTotals(
    totalPrice,
    isExpressShipping
  );

  const isLoadingAddress = addressStatus === "loading";

  // Redirect: nicer than navigate inside render
  useEffect(() => {
    if (!username) navigate("/profile");
  }, [username, navigate]);

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="container-foundation section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-semibold text-espresso mb-2">
            Checkout
          </h1>
          <p className="text-taupe">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <Form method="POST" className="space-y-6">
              <CustomerInfo formErrors={formErrors} username={username} />

              <ShippingAddress
                dispatch={dispatch}
                addressStatus={addressStatus}
                addressComponents={addressComponents}
                isLoadingAddress={isLoadingAddress}
                addressError={addressError}
                position={position}
              />

              <ShippingOptions
                isExpressShipping={isExpressShipping}
                setIsExpressShipping={setIsExpressShipping}
              />

              {/* Hidden inputs */}
              <input type="hidden" name="cart" value={JSON.stringify(cart)} />
              <input type="hidden" name="totalPrice" value={totalPrice} />
              <input type="hidden" name="totalQuantity" value={totalQuantity} />
              <input
                type="hidden"
                name="position"
                value={
                  position.latitude && position.longitude
                    ? `${position.latitude},${position.longitude}`
                    : ""
                }
              />

              <MainButton
                type="submit"
                fullWidth
                variant="quiet"
                loading={isSubmitting}
                disabled={
                  isSubmitting || (!isExpressShipping && isLoadingAddress)
                }
                content={isSubmitting ? "Processing..." : "Place Order"}
                size="large"
              />
            </Form>
          </div>

          {/* RIGHT */}
          <OrderSummary
            cart={cart}
            totalPrice={totalPrice}
            totalQuantity={totalQuantity}
            baseShipping={shippingCost}
            expressCost={expressCost}
            tax={tax}
            finalTotal={finalTotal}
            isExpressShipping={isExpressShipping}
          />
        </div>
      </div>
    </div>
  );
};

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    fastOrder: data.fastOrder === "on",
  };

  const errors = {};
  if (!isValidPhone(order.phoneNumber)) {
    errors.phoneNumber = "Invalid phone number format.";
  }

  if (Object.keys(errors).length > 0) return errors;

  const orderId = generateOrderId();
  const cartItems = JSON.parse(data.cart);

  const completeOrder = {
    id: orderId,
    customer: {
      name: data.fullName,
      email: data.email || undefined,
      phone: data.phoneNumber,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      country: data.country,
    },
    items: cartItems.map((item) => ({
      sku: item.sku,
      productName: item.productName,
      image: item.image,
      category: item.category,
      quantity: item.quantity,
      price: parseFloat(item.NewPrice),
      totalPrice: item.totalPrice,
    })),
    fastOrder: data.fastOrder === "on",
    shipping: data.fastOrder === "on" ? 30 : 15,
    tax: cartItems.reduce((sum, item) => sum + item.totalPrice, 0) * 0.08,
    createdAt: new Date().toISOString(),
  };

  const orders = JSON.parse(localStorage.getItem("furniture_orders") || "[]");
  orders.unshift(completeOrder);
  localStorage.setItem("furniture_orders", JSON.stringify(orders));

  localStorage.removeItem("furniture_cart");

  return redirect(`/order/${orderId}`);
}

export default CreateOrder;
