import { STORAGE_KEYS } from "../../utils/storageKeys";
// The shopper's saved details (Profile page → "Edit"), persisted to
// localStorage like the cart and orders. Shared by UserProfile (reads and
// writes it) and checkout (prefills the form from it — guest checkout, so
// nothing here is required to place an order).
export const PROFILE_STORAGE_KEY = STORAGE_KEYS.profile;

export const emptyProfile = { name: "", email: "", phone: "", address: "" };

// Never throws: missing, malformed or non-object data falls back to an
// empty profile, so a corrupt entry can't break the Profile or Checkout page.
export function loadStoredProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
    return stored && typeof stored === "object"
      ? { ...emptyProfile, ...stored }
      : emptyProfile;
  } catch {
    return emptyProfile;
  }
}
