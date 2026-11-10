// Every localStorage key the app uses, in one place. They were originally
// `furniture_*` (left over from the furniture-store template);
// migrateStorage.js moves saved data from those legacy keys once.
export const STORAGE_KEYS = {
  cart: "vermera_cart",
  orders: "vermera_orders",
  profile: "vermera_profile",
};

export const LEGACY_STORAGE_KEYS = {
  cart: "furniture_cart",
  orders: "furniture_orders",
  profile: "furniture_profile",
};
