// services/productsAPI.js
import mockProducts from "../data/mockProducts.json";

const BASE_URL = "https://dummyjson.com";

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

function normalizeCategory(category) {
  if (!category) return null; // undefined, null, "" → no filter
  const normalized = String(category).trim().toLowerCase();
  return normalized === "all" ? null : normalized;
}

function round2(value) {
  return Number(value.toFixed(2));
}

// Fetches the full DummyJSON catalog and narrows it to the categories this
// storefront supports, falling back to the mock snapshot on any network
// error, non-2xx response, or malformed payload.
async function fetchScopedCatalog() {
  try {
    const res = await fetch(`${BASE_URL}/products?limit=0`);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data?.products)) {
      throw new Error(
        "Malformed response: expected data.products to be an array",
      );
    }
    const items = data.products.filter((p) =>
      supportedCategories.includes(p.category),
    );
    return { items, fromMock: false };
  } catch (error) {
    console.warn(`[productsAPI] Falling back to mock data — ${error.message}`);
    return { items: mockProducts, fromMock: true };
  }
}

// Applies category/price/sort/limit options to a scoped item array. Runs for
// both live and mock-fallback data, since DummyJSON has no server-side
// min/max-price filtering to rely on anyway.
function applyFilters(items, { category, minPrice, maxPrice, sort, limit }) {
  const cat = normalizeCategory(category);
  let result = [...items];

  if (cat) result = result.filter((p) => p.category === cat);
  if (minPrice != null) result = result.filter((p) => p.price >= minPrice);
  if (maxPrice != null) result = result.filter((p) => p.price <= maxPrice);

  switch (sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name_asc":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name_desc":
      result.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "oldest":
      // DummyJSON's meta.createdAt is identical across every product in the
      // dataset, so it carries no real recency signal — id is used instead
      // as an honest insertion-order proxy.
      result.sort((a, b) => a.id - b.id);
      break;
    case "newest":
    default:
      result.sort((a, b) => b.id - a.id);
      break;
  }

  return limit ? result.slice(0, limit) : result;
}

// Helper function to transform a DummyJSON item into our UI's product shape.
function transformProduct(item) {
  const discountPercentage =
    typeof item.discountPercentage === "number" ? item.discountPercentage : 0;
  const hasDiscount = discountPercentage > 0 && discountPercentage < 100;

  return {
    id: item.id, // fallback list key — Products.jsx: `product.sku || product.id`
    sku: String(item.sku ?? item.id), // canonical identity: cart, URLs, React keys, localStorage
    productName: item.title,
    description: item.description,
    category: item.category,
    NewPrice: round2(item.price), // DummyJSON's price IS the current/effective price
    OldPrice: hasDiscount
      ? round2(item.price / (1 - discountPercentage / 100))
      : undefined,
    isNew: false, // DummyJSON has no trustworthy "new" signal — never derived from id/rating/stock/order
    isDiscount: hasDiscount,
    DiscountPercentage: discountPercentage,
    image: item.thumbnail,
    stock: item.stock,
    woodType: item.woodType, // no DummyJSON equivalent; ProductPage.jsx already guards with `{woodType && (...)}`
    dimensions: item.dimensions,
  };
}

export async function getProducts(options = {}) {
  const {
    limit = 50,
    category = null,
    minPrice = null,
    maxPrice = null,
    sort = "newest",
  } = options;

  const { items } = await fetchScopedCatalog();
  return applyFilters(items, { category, minPrice, maxPrice, sort, limit }).map(
    transformProduct,
  );
}

export async function getProductById(sku) {
  const { items, fromMock } = await fetchScopedCatalog();
  const match = items.find((p) => String(p.sku ?? p.id) === sku);
  if (match) return transformProduct(match);

  // Live fetch succeeded but this sku wasn't in it — one more check against
  // the offline snapshot (covers a sku that only exists there). Skipped when
  // fromMock is already true, since `items` IS mockProducts in that case.
  if (!fromMock) {
    const mockMatch = mockProducts.find((p) => String(p.sku ?? p.id) === sku);
    if (mockMatch) return transformProduct(mockMatch);
  }

  return null; // caller (productLoader) is responsible for the not-found state
}

// Helper function to get products by category
export async function getProductsByCategory(category, limit = 20) {
  return getProducts({ category, limit });
}

// Categories supported by this storefront (DummyJSON slugs): see
// `supportedCategories` above — womens-bags, womens-dresses,
// womens-jewellery, womens-shoes, womens-watches, tops, skin-care, beauty,
// sunglasses.

export async function getCategories() {
  // Fetch DummyJSON's full category list, then narrow it to the slugs this
  // storefront actually carries (DummyJSON may return plain strings or
  // {slug, name, url} objects depending on the endpoint version).
  try {
    const res = await fetch(`${BASE_URL}/products/category-list`);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Malformed response: expected an array");
    }

    return data.filter((c) =>
      supportedCategories.includes(typeof c === "string" ? c : c?.slug),
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
