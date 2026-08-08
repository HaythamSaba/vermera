import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("furniture_cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (cart) => {
  try {
    localStorage.setItem("furniture_cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
};

const initialState = {
  cart: loadFromLocalStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      // payload = new item object
      const newItem = action.payload;
      const existingItem = state.cart.find((item) => item.sku === newItem.sku);

      if (existingItem) {
        // Item already exists, increase quantity
        existingItem.quantity++;
        existingItem.totalPrice =
          parseFloat(existingItem.NewPrice) * existingItem.quantity;
      } else {
        // New item, add to cart
        state.cart.push({
          ...newItem,
          quantity: 1,
          totalPrice: parseFloat(newItem.NewPrice),
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
      if (item) {
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
          item.quantity = quantity;
          item.totalPrice = parseFloat(item.NewPrice) * item.quantity;
        }
        saveToLocalStorage(state.cart);
      }
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