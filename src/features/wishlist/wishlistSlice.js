import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "vermera_wishlist";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save wishlist:", error);
  }
};

const initialState = {
  items: loadFromLocalStorage(),
};

// Wishlist items only need enough of the product to render the wishlist
// card and re-add it to the cart — not the full transformed product
// (description, dimensions, images[], etc.). Mirrors cartSlice's
// toCartItem narrowing so the persisted localStorage payload stays small.
export const toWishlistItem = ({
  sku,
  productName,
  image,
  NewPrice,
  OldPrice,
  category,
  isDiscount,
  DiscountPercentage,
  stock,
  availabilityStatus,
}) => ({
  sku,
  productName,
  image,
  NewPrice,
  OldPrice,
  category,
  isDiscount,
  DiscountPercentage,
  stock,
  availabilityStatus,
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItem: (state, action) => {
      // payload = wishlist item (see toWishlistItem)
      const newItem = action.payload;
      const alreadySaved = state.items.some((item) => item.sku === newItem.sku);
      if (!alreadySaved) {
        state.items.push(newItem);
        saveToLocalStorage(state.items);
      }
    },

    removeItem: (state, action) => {
      // payload = sku
      state.items = state.items.filter((item) => item.sku !== action.payload);
      saveToLocalStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveToLocalStorage(state.items);
    },

    // Undo for a single removal: puts the exact item back at its old
    // position (same contract as cartSlice's restoreItem).
    restoreItem: (state, action) => {
      const { item, index } = action.payload;
      if (state.items.some((saved) => saved.sku === item.sku)) return;
      const at = Math.min(Math.max(index, 0), state.items.length);
      state.items.splice(at, 0, item);
      saveToLocalStorage(state.items);
    },

    // Undo for "Clear all": restores the previous list, keeping anything
    // saved since (so the undo can't drop a newer item).
    restoreItems: (state, action) => {
      const previous = action.payload;
      const newer = state.items.filter(
        (item) => !previous.some((saved) => saved.sku === item.sku),
      );
      state.items = [...previous, ...newer];
      saveToLocalStorage(state.items);
    },
  },
});

export const { addItem, removeItem, clearWishlist, restoreItem, restoreItems } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;

// Selectors
export const getWishlist = (state) => state.wishlist.items;

export const getWishlistCount = (state) => state.wishlist.items.length;

export const isInWishlist = (sku) => (state) =>
  state.wishlist.items.some((item) => item.sku === sku);
