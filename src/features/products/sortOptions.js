// Shop sort options, as stored in ?sort=. "featured" is the default (no
// param) and maps to the catalog's default order in apiProducts.js's
// applyFilters(). Old links with a retired value (newest/oldest/name_desc)
// fall back to Featured via normalizeSort().
export const DEFAULT_SORT = "featured";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "A–Z" },
];

export function normalizeSort(value) {
  return SORT_OPTIONS.some((option) => option.value === value)
    ? value
    : DEFAULT_SORT;
}
