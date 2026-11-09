import { ChevronDown, X } from "lucide-react";
import CategoriesList from "./CategoriesList";
import Products from "./Products";
import PriceFilterPanel from "./PriceFilterPanel";
import ProductSearch from "./ProductSearch";
import { CATEGORY_LABELS } from "./categoryLabels";
import { SORT_OPTIONS } from "./sortOptions";
import { formatPrice } from "../../utils/pricing";

const wholeEuros = (value) => formatPrice(value, { wholeUnits: true });

// One chip per active filter, each removable on its own. `remove` lists the
// URL params that chip clears.
function getActiveFilterChips({ category, minPrice, maxPrice, searchQuery }) {
  const chips = [];
  if (category) {
    chips.push({
      key: "category",
      label: CATEGORY_LABELS[category] ?? category,
      remove: ["category"],
    });
  }
  if (minPrice != null || maxPrice != null) {
    const label =
      minPrice != null && maxPrice != null
        ? `${wholeEuros(minPrice)} – ${wholeEuros(maxPrice)}`
        : minPrice != null
          ? `From ${wholeEuros(minPrice)}`
          : `Up to ${wholeEuros(maxPrice)}`;
    chips.push({ key: "price", label, remove: ["minPrice", "maxPrice"] });
  }
  if (searchQuery.trim()) {
    chips.push({
      key: "q",
      label: `“${searchQuery.trim()}”`,
      remove: ["q"],
    });
  }
  return chips;
}

function ProductsSection({
  products,
  loading,
  error,
  displayCount,
  setDisplayCount,
  category,
  sort,
  minPrice,
  maxPrice,
  navigate,
  setProducts,
  setLoading,
  setError,
  onSortChange,
  onFilterApply,
  onFilterClear,
  onRemoveFilter,
  onClearAll,
  searchQuery,
  onSearchChange,
}) {
  const chips = getActiveFilterChips({
    category,
    minPrice,
    maxPrice,
    searchQuery,
  });
  const resultCount = products.length;

  return (
    <div>
      <div className="container-foundation pt-8">
        <CategoriesList />

        {/* One quiet toolbar row: search, Price, Sort, result count. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
          <div className="w-full sm:w-72">
            <ProductSearch value={searchQuery} onChange={onSearchChange} />
          </div>

          <PriceFilterPanel
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApply={onFilterApply}
            onClear={onFilterClear}
          />

          <div className="relative flex items-center gap-1.5 text-sm">
            <label htmlFor="sortSelect" className="text-taupe">
              Sort:
            </label>
            <select
              id="sortSelect"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="min-h-11 appearance-none bg-transparent pr-5 text-charcoal cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-0 w-4 h-4 text-taupe"
              aria-hidden="true"
            />
          </div>

          <p
            className="sm:ml-auto text-sm text-taupe"
            role="status"
            aria-live="polite"
          >
            {resultCount} {resultCount === 1 ? "product" : "products"}
          </p>
        </div>

        {chips.length > 0 && (
          <ul
            aria-label="Active filters"
            className="flex flex-wrap items-center gap-2 pb-4"
          >
            {chips.map((chip) => (
              <li key={chip.key}>
                <button
                  type="button"
                  onClick={() => onRemoveFilter(chip.remove)}
                  aria-label={`Remove filter: ${chip.label}`}
                  className="min-h-9 inline-flex items-center gap-1.5 border border-stone bg-cream px-3 text-sm text-charcoal hover:border-espresso transition-colors cursor-pointer"
                >
                  {chip.label}
                  <X className="w-3.5 h-3.5 text-taupe" aria-hidden="true" />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={onClearAll}
                className="min-h-9 px-1 text-sm text-taupe underline underline-offset-4 decoration-stone hover:text-charcoal cursor-pointer"
              >
                Clear all
              </button>
            </li>
          </ul>
        )}
      </div>

      <Products
        navigate={navigate}
        category={category}
        sort={sort}
        minPrice={minPrice}
        maxPrice={maxPrice}
        displayCount={displayCount}
        setDisplayCount={setDisplayCount}
        products={products}
        setProducts={setProducts}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        searchQuery={searchQuery}
        onClearFilters={onClearAll}
      />
    </div>
  );
}

export default ProductsSection;
