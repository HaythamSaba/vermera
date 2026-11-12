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

// Apparel and shoes: categories a shopper expects to choose a size for.
// DummyJSON has no size data, so their product pages say so plainly rather
// than inventing sizes (audit decision D).
const SIZED_CATEGORIES = new Set(["womens-dresses", "tops", "womens-shoes"]);

export const isSizedCategory = (slug) => SIZED_CATEGORIES.has(slug);

// The shopper-facing name for a category slug. Every place that displays a
// category goes through this, so a raw DummyJSON slug ("womens-watches")
// never reaches the screen. Unknown slugs (an edited ?category= URL, data
// outside the allowlist) are title-cased rather than shown raw; a missing
// value gives "".
export function getCategoryLabel(slug) {
  if (!slug) return "";
  return (
    CATEGORY_LABELS[slug] ??
    String(slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
