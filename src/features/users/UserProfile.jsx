import { useState } from "react";
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import CreateUser from "./CreateUser";
import Cart from "../cart/Cart";
import MainButton from "../../ui/MainButton";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const orderTotal = (order) =>
  order.items.reduce((sum, item) => sum + item.totalPrice, 0) +
  order.shipping +
  order.tax;

const PROFILE_STORAGE_KEY = "furniture_profile";
const emptyProfile = { name: "", email: "", phone: "", address: "" };

function loadStoredProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
    return stored && typeof stored === "object"
      ? { ...emptyProfile, ...stored }
      : emptyProfile;
  } catch {
    return emptyProfile;
  }
}

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
        localStorage.getItem("furniture_orders") || "[]"
      );
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
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

  if (!username) return <CreateUser />;

  return (
    <div className="container-foundation section">
      {/* Header */}
      <div className="bg-cream border border-stone p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-stone/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-brass" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-espresso">
                {username}
              </h1>
            </div>
          </div>
          {!isEditing && (
            <MainButton
              variant="quiet"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </MainButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-cream border border-stone p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-medium text-espresso">
                Personal Information
              </h2>
              {isEditing && (
                <div className="flex gap-2">
                  <MainButton size="small" variant="quiet" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save
                  </MainButton>
                  <MainButton
                    size="small"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </MainButton>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-taupe mt-1" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-taupe">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          email: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-stone bg-cream outline-none"
                    />
                  ) : (
                    <p className="text-charcoal">{user.email || "—"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-taupe mt-1" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-taupe">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          phone: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-stone bg-cream outline-none"
                    />
                  ) : (
                    <p className="text-charcoal">{user.phone || "—"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-taupe mt-1" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-taupe">Address</p>
                  {isEditing ? (
                    <textarea
                      value={editedUser.address}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          address: e.target.value,
                        })
                      }
                      rows="2"
                      className="mt-1 w-full px-3 py-2 border border-stone bg-cream outline-none"
                    />
                  ) : (
                    <p className="text-charcoal">{user.address || "—"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
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
                        ${orderTotal(order).toFixed(2)}
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

        {/* Right Column - Cart Summary */}
        <div className="space-y-6">
          <Cart embedded />
        </div>
      </div>
    </div>
  );
};

export default Profile;
