// Single source for where a product search lands: the Shop page with the
// query in `?q=` (ProductsPage reads it back from the URL, so results are
// shareable and survive a reload). Used by the header's search modal and its
// inline mobile search row.
export function getProductSearchPath(query) {
  const trimmed = query.trim();
  return trimmed
    ? `/products?${new URLSearchParams({ q: trimmed })}`
    : "/products";
}
