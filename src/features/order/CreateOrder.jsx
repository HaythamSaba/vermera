import { STORAGE_KEYS } from "../../utils/storageKeys";
/* eslint-disable react-refresh/only-export-components */
import {
  Form,
  useActionData,
  useNavigation,
  redirect,
} from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getCart,
  getTotalCartPrice,
  getTotalCartQuantity,
} from "../cart/cartSlice";
import store from "../../store";
import EmptyCart from "../cart/EmptyCart";
import generateOrderId from "../../utils/helpers";
import MainButton from "../../ui/MainButton";

import CustomerInfo from "./CustomerInfo";
import ShippingAddress from "./ShippingAddress";
import ShippingOptions from "./ShippingOptions";
import OrderSummary from "./OrderSummary";
import { computeOrderTotals, getSubtotal } from "../../utils/pricing";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useMetaDescription from "../../hooks/useMetaDescription";
import { loadStoredProfile } from "../users/profileStorage";
import {
  CHECKOUT_FIELDS,
  validateCheckout,
  validateField,
} from "./checkoutValidation";

// Field ids equal their names, so the first invalid one can be focused.
const focusFirstInvalid = (errors) => {
  const first = CHECKOUT_FIELDS.find((name) => errors[name]);
  if (first) document.getElementById(first)?.focus();
};

const CreateOrder = () => {
  useDocumentTitle("Checkout");
  useMetaDescription(
    "Enter your contact details, shipping address, and shipping option to place your Vermera order.",
  );
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // Server-side errors from the action — only reachable if client-side
  // validation was bypassed; shown the same way.
  const actionErrors = useActionData();

  const dispatch = useDispatch();

  const {
    status: addressStatus,
    position,
    addressComponents,
    error: addressError,
  } = useSelector((state) => state.user);

  const cart = useSelector(getCart);
  const totalPrice = useSelector(getTotalCartPrice);
  const totalQuantity = useSelector(getTotalCartQuantity);

  // Guest checkout (audit decision D1): no name gate. Details saved on the
  // Profile page, if any, only prefill the form; read once on mount.
  const [savedProfile] = useState(loadStoredProfile);

  // Set in the form's onSubmit (a discrete event, so it's committed before
  // the async action runs). The action empties the cart via a synchronous
  // Redux update while the router's own navigation state is still pending
  // in a transition, so navigation.state can't be used to tell "order just
  // placed" apart from "cart genuinely empty".
  const [hasSubmittedOrder, setHasSubmittedOrder] = useState(false);

  const [shippingMethod, setShippingMethod] = useState("standard");
  const isExpressShipping = shippingMethod === "express";
  // Client-side results per field: a message, or "" once a field has been
  // checked and is valid (which also hides a stale action error for it).
  const [fieldErrors, setFieldErrors] = useState({});
  const errors = Object.fromEntries(
    CHECKOUT_FIELDS.map((name) => [
      name,
      name in fieldErrors ? fieldErrors[name] : actionErrors?.[name],
    ]),
  );

  useEffect(() => {
    if (actionErrors) focusFirstInvalid(actionErrors);
  }, [actionErrors]);

  // Validate a field when it loses focus; while it's showing an error,
  // re-check on every change so the message clears as soon as it's fixed.
  // Both handlers sit on the <Form>: React's blur/change events bubble.
  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    if (!CHECKOUT_FIELDS.includes(name)) return;
    setFieldErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (!errors[name]) return;
    setFieldErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const submitErrors = validateCheckout(values);
    if (Object.keys(submitErrors).length > 0) {
      e.preventDefault();
      setFieldErrors(
        Object.fromEntries(
          CHECKOUT_FIELDS.map((name) => [name, submitErrors[name] ?? ""]),
        ),
      );
      focusFirstInvalid(submitErrors);
      return;
    }
    setHasSubmittedOrder(true);
  };

  const totals = computeOrderTotals(totalPrice, {
    express: isExpressShipping,
  });

  const isLoadingAddress = addressStatus === "loading";

  if (cart.length === 0) {
    // The action below empties the cart as soon as the order is saved, but
    // this page stays mounted while the router loads the confirmation
    // route — show a neutral holding state instead of flashing "Your cart
    // is empty" during that hand-off.
    if (hasSubmittedOrder) {
      return (
        <div className="container-foundation section text-center">
          <p className="text-taupe" role="status">
            Confirming your order…
          </p>
        </div>
      );
    }
    return <EmptyCart />;
  }

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
          <div className="lg:col-span-2">
            {/* noValidate: native "Please fill in this field" bubbles are
                replaced by each field's inline error. Submission is only
                blocked (preventDefault) when validation fails; React
                Router's <Form> respects that. */}
            <Form
              method="POST"
              className="space-y-6"
              noValidate
              onSubmit={handleSubmit}
              onBlur={handleFieldBlur}
              onChange={handleFieldChange}
            >
              <p className="text-sm text-taupe">
                All fields are required unless marked optional.
              </p>

              <CustomerInfo
                errors={errors}
                defaultName={savedProfile.name}
                defaultPhone={savedProfile.phone}
                defaultEmail={savedProfile.email}
              />

              <ShippingAddress
                dispatch={dispatch}
                addressStatus={addressStatus}
                addressComponents={addressComponents}
                isLoadingAddress={isLoadingAddress}
                addressError={addressError}
                position={position}
                savedAddress={savedProfile.address}
                errors={errors}
              />

              <ShippingOptions
                method={shippingMethod}
                onMethodChange={setShippingMethod}
                isFreeStandardShipping={totals.isFreeStandardShipping}
              />

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

          <OrderSummary
            cart={cart}
            totalPrice={totalPrice}
            totalQuantity={totalQuantity}
            totals={totals}
          />
        </div>
      </div>
    </div>
  );
};

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Same rules the form runs client-side (a backstop if JS validation is
  // bypassed); errors come back through useActionData.
  const errors = validateCheckout(data);
  if (Object.keys(errors).length > 0) return errors;

  const orderId = generateOrderId();
  const cartItems = JSON.parse(data.cart);
  const isExpress = data.shipping === "express";
  // Same function the checkout summary used, so the saved order always
  // matches the total the shopper saw before clicking "Place Order".
  const totals = computeOrderTotals(getSubtotal(cartItems), {
    express: isExpress,
  });

  const completeOrder = {
    id: orderId,
    customer: {
      name: data.fullName,
      email: data.email,
      phone: data.phoneNumber || undefined,
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
    fastOrder: isExpress,
    shipping: totals.shipping,
    tax: totals.tax,
    total: totals.total,
    createdAt: new Date().toISOString(),
  };

  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || "[]");
  orders.unshift(completeOrder);
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));

  // Clear through the store, not localStorage directly: removing only the
  // persisted key left the in-memory cart full (header badge, /cart), and
  // the next cart action re-saved those stale items. clearCart also
  // persists the empty cart. Actions run outside React, hence store.dispatch.
  store.dispatch(clearCart());

  return redirect(`/order/${orderId}`);
}

export default CreateOrder;
