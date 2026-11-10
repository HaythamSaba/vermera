import { STORAGE_KEYS } from "../../utils/storageKeys";
import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.cart);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
};

// Highest quantity allowed for a line: its product's stock when known.
// Items saved before `stock` was stored on cart lines have none and stay
// uncapped rather than being blocked.
const maxQuantityFor = (item) =>
  Number.isFinite(item.stock) && item.stock > 0 ? item.stock : Infinity;

const initialState = {
  cart: loadFromLocalStorage(),
};

// Cart items only need enough of the product to render the cart UI and
// price the order — not the full transformed product (description, stock,
// dimensions, images[], etc.). Narrowing at the point of dispatch keeps the
// persisted localStorage payload small and avoids coupling the cart to
// fields (like the gallery's images[]) it never renders. `stock` is kept so
// the cart's quantity stepper can be capped like the PDP's.
export const toCartItem = (
  { sku, productName, image, NewPrice, category, stock },
  quantity = 1,
) => ({
  sku,
  productName,
  image,
  NewPrice,
  category,
  stock,
  quantity,
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      // payload = new item object; quantity defaults to 1 (toCartItem's
      // default) but callers like ProductPage's quantity selector can pass
      // any positive amount to add in one go.
      const newItem = action.payload;
      const qtyToAdd =
        Number.isFinite(newItem.quantity) && newItem.quantity > 0
          ? newItem.quantity
          : 1;
      const existingItem = state.cart.find((item) => item.sku === newItem.sku);

      if (existingItem) {
        // Item already exists, increase quantity (never past stock — e.g.
        // adding 3 more on the PDP when 4 of 5 are already in the cart).
        if (Number.isFinite(newItem.stock)) existingItem.stock = newItem.stock;
        existingItem.quantity = Math.min(
          existingItem.quantity + qtyToAdd,
          maxQuantityFor(existingItem),
        );
        existingItem.totalPrice =
          parseFloat(existingItem.NewPrice) * existingItem.quantity;
      } else {
        // New item, add to cart
        const quantity = Math.min(qtyToAdd, maxQuantityFor(newItem));
        state.cart.push({
          ...newItem,
          quantity,
          totalPrice: parseFloat(newItem.NewPrice) * quantity,
        });
      }

      // Save to localStorage
      saveToLocalStorage(state.cart);
    },

    deleteItem: (state, action) => {
      // payload = sku
      state.cart = state.cart.filter((item) => item.sku !== action.payload);
      saveToLocalStorage(state.cart);
    },

    increaseItemQuantity: (state, action) => {
      // payload = sku
      const item = state.cart.find((item) => item.sku === action.payload);
      if (item && item.quantity < maxQuantityFor(item)) {
        item.quantity++;
        item.totalPrice = parseFloat(item.NewPrice) * item.quantity;
        saveToLocalStorage(state.cart);
      }
    },

    decreaseItemQuantity: (state, action) => {
      // payload = sku
      const item = state.cart.find((item) => item.sku === action.payload);
      if (item) {
        if (item.quantity === 1) {
          // Remove item if quantity would be 0
          cartSlice.caseReducers.deleteItem(state, action);
        } else {
          item.quantity--;
          item.totalPrice = parseFloat(item.NewPrice) * item.quantity;
        }
        saveToLocalStorage(state.cart);
      }
    },

    updateItemQuantity: (state, action) => {
      // payload = { sku, quantity }
      const { sku, quantity } = action.payload;
      const item = state.cart.find((item) => item.sku === sku);

      if (item) {
        if (quantity <= 0) {
          // Remove if quantity is 0 or less
          state.cart = state.cart.filter((i) => i.sku !== sku);
        } else {
          item.quantity = Math.min(quantity, maxQuantityFor(item));
          item.totalPrice = parseFloat(item.NewPrice) * item.quantity;
        }
        saveToLocalStorage(state.cart);
      }
    },

    // Undo for a removal: puts the exact removed line back where it was.
    // payload = { item, index }
    restoreItem: (state, action) => {
      const { item, index } = action.payload;
      if (state.cart.some((line) => line.sku === item.sku)) return;
      const at = Math.min(Math.max(index, 0), state.cart.length);
      state.cart.splice(at, 0, item);
      saveToLocalStorage(state.cart);
    },

    clearCart: (state) => {
      state.cart = [];
      saveToLocalStorage(state.cart);
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  updateItemQuantity,
  restoreItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCartItemBysku = (sku) => (state) =>
  state.cart.cart.find((item) => item.sku === sku);

export const isInCart = (sku) => (state) =>
  state.cart.cart.some((item) => item.sku === sku);

export const getCurrentQuantityBySku = (sku) => (state) =>
  state.cart.cart.find((item) => item.sku === sku)?.quantity ?? 0;