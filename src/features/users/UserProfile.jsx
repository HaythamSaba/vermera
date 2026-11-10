import { STORAGE_KEYS } from "../../utils/storageKeys";
import { useEffect, useRef, useState } from "react";
import { Package, MapPin, Phone, Mail, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import CreateUser from "./CreateUser";
import OrderLookup from "../order/OrderLookup";
import Cart from "../cart/Cart";
import MainButton from "../../ui/MainButton";
import InputField from "../../ui/InputField";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useMetaDescription from "../../hooks/useMetaDescription";
import { computeOrderTotals, formatPrice, getSubtotal } from "../../utils/pricing";
import { PROFILE_STORAGE_KEY, loadStoredProfile } from "./profileStorage";

// Prefer the total saved with the order; older orders without one are
// re-priced the same way the confirmation page does.
const orderTotal = (order) => {
  if (order.total != null) return order.total;
  const subtotal = getSubtotal(order.items);
  const fallback = computeOrderTotals(subtotal, { express: order.fastOrder });
  return subtotal + (order.shipping ?? fallback.shipping) + (order.tax ?? fallback.tax);
};

const Profile = () => {
  const username = useSelector((state) => state.user.username);

  useDocumentTitle(username ? "Profile" : "Welcome");

  // Persisted to localStorage on save, same pattern as cart/orders — reads
  // back on mount so edits survive a reload.
  const [user, setUser] = useState(loadStoredProfile);

  // Real order history, read from the same localStorage key CreateOrder.jsx
  // writes to — not mock data.
  const [orders] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.orders) || "[]"
      );
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  useMetaDescription(
    username
      ? `Your Vermera profile — saved shipping details and ${orders.length} order${orders.length === 1 ? "" : "s"}.`
      : "Enter your name to start shopping with Vermera and keep track of your orders.",
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  // Keyboard focus follows the mode switch: into the first field when
  // editing starts, back to the Edit button when it ends (save or cancel),
  // so focus is never dropped onto <body> when the form unmounts.
  const firstFieldRef = useRef(null);
  const editButtonRef = useRef(null);
  const hasToggledRef = useRef(false);
  useEffect(() => {
    if (!hasToggledRef.current) return;
    (isEditing ? firstFieldRef : editButtonRef).current?.focus();
  }, [isEditing]);

  const startEditing = () => {
    hasToggledRef.current = true;
    setEditedUser(user);
    setIsEditing(true);
  };

  const updateField = (field) => (e) =>
    setEditedUser({ ...editedUser, [field]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setUser(editedUser);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(editedUser));
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  // Order lookup sits outside the name prompt too, so the footer's "Track
  // an order" link (/profile#track-order) works without entering a name.
  if (!username)
    return (
      <>
        <CreateUser />
        <div className="container-foundation pb-16">
          <div className="max-w-md mx-auto">
            <OrderLookup />
          </div>
        </div>
      </>
    );

  const initial = username.trim().charAt(0).toUpperCase();

  const details = [
    { label: "Email", icon: Mail, value: user.email },
    { label: "Phone", icon: Phone, value: user.phone },
    { label: "Address", icon: MapPin, value: user.address },
  ];

  return (
    <div className="container-foundation section">
      <div className="bg-cream border border-stone p-6 mb-6 flex items-center gap-4">
        {/* Quiet monogram instead of a generic user icon. Decorative: the
            name is right beside it. */}
        <div
          aria-hidden="true"
          className="w-16 h-16 shrink-0 rounded-full border border-stone flex items-center justify-center font-serif text-2xl text-espresso"
        >
          {initial}
        </div>
        <h1 className="text-3xl font-serif font-semibold text-espresso">
          {username}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section
            aria-labelledby="personal-info-heading"
            className="bg-cream border border-stone p-6"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2
                id="personal-info-heading"
                className="text-xl font-serif font-medium text-espresso"
              >
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  ref={editButtonRef}
                  type="button"
                  onClick={startEditing}
                  className="min-h-11 inline-flex items-center gap-2 text-sm text-charcoal underline underline-offset-4 decoration-stone hover:decoration-charcoal transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                  Edit details
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <InputField
                  ref={firstFieldRef}
                  id="profile-email"
                  type="email"
                  name="email"
                  hasLabel
                  labelText="Email"
                  autoComplete="email"
                  value={editedUser.email}
                  onChange={updateField("email")}
                />
                <InputField
                  id="profile-phone"
                  type="tel"
                  name="phone"
                  hasLabel
                  labelText="Phone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={editedUser.phone}
                  onChange={updateField("phone")}
                />
                <div>
                  <label
                    htmlFor="profile-address"
                    className="block text-sm font-medium text-charcoal mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    id="profile-address"
                    name="address"
                    autoComplete="street-address"
                    rows="2"
                    value={editedUser.address}
                    onChange={updateField("address")}
                    className="w-full border border-stone bg-cream p-3 transition"
                  />
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <MainButton type="submit" size="small" variant="quiet">
                    Save
                  </MainButton>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="min-h-11 px-1 text-sm text-taupe underline underline-offset-4 decoration-stone hover:text-charcoal cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="space-y-4">
                {details.map(({ label, icon, value }) => {
                  // Capitalised local so ESLint sees the JSX usage (same
                  // pattern as ContactChannelCard).
                  const Icon = icon;
                  return (
                    <div key={label} className="flex items-start gap-3">
                      <dt className="flex items-center gap-3 w-28 shrink-0 text-sm text-taupe pt-0.5">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        {label}
                      </dt>
                      <dd className="text-charcoal min-w-0 break-words">
                        {value || "—"}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </section>

          <div className="bg-cream border border-stone p-6">
            <h2 className="text-xl font-serif font-medium text-espresso mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-brass" aria-hidden="true" />
              Order History
            </h2>
            <div className="space-y-3">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/order/${order.id}`}
                    className="block border border-stone p-4 hover:border-brass transition-colors duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-charcoal">
                          #{order.id}
                        </p>
                        <p className="text-sm text-taupe">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone">
                      <p className="text-sm text-taupe">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                        items
                      </p>
                      <p className="font-semibold text-espresso">
                        {formatPrice(orderTotal(order))}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-taupe">No orders found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Cart embedded />
          <OrderLookup />
        </div>
      </div>
    </div>
  );
};

export default Profile;
