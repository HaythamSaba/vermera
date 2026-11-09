// The DummyJSON category slugs this storefront carries, and their labels.
// Kept apart from the API layer so UI like the Footer can list categories
// without importing src/services/apiProducts.js.
export const supportedCategories = [
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
  "tops",
  "skin-care",
  "beauty",
  "sunglasses",
];

// Human-readable labels for the slugs above.
export const CATEGORY_LABELS = {
  "womens-bags": "Bags",
  "womens-dresses": "Dresses",
  "womens-jewellery": "Jewellery",
  "womens-shoes": "Shoes",
  "womens-watches": "Watches",
  tops: "Tops",
  "skin-care": "Skin Care",
  beauty: "Beauty",
  sunglasses: "Sunglasses",
};
