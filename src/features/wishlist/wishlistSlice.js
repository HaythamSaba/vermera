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
  },
});

export const { addItem, removeItem, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Selectors
export const getWishlist = (state) => state.wishlist.items;

export const getWishlistCount = (state) => state.wishlist.items.length;

export const isInWishlist = (sku) => (state) =>
  state.wishlist.items.some((item) => item.sku === sku);
