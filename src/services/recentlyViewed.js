const STORAGE_KEY = "vermera_recently_viewed";
const LIMIT = 6;

// Only the fields ProductItem actually reads for a grid card — kept minimal
// since this is a point-in-time snapshot (price/stock can drift from the
// live product by the time it's shown again, same tradeoff any "recently
// viewed" widget makes).
function toSnapshot({
  sku,
  productName,
  description,
  NewPrice,
  OldPrice,
  image,
  isNew,
  isDiscount,
  DiscountPercentage,
  stock,
  availabilityStatus,
  category,
}) {
  return {
    sku,
    productName,
    description,
    NewPrice,
    OldPrice,
    image,
    isNew,
    isDiscount,
    DiscountPercentage,
    stock,
    availabilityStatus,
    category,
  };
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save recently viewed products:", error);
  }
}

export function recordProductView(product) {
  const existing = readAll().filter((item) => item.sku !== product.sku);
  const next = [toSnapshot(product), ...existing].slice(0, LIMIT);
  writeAll(next);
}

export function getRecentlyViewed(excludeSku) {
  return readAll().filter((item) => item.sku !== excludeSku);
}
