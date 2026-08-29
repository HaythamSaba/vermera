import CategoriesList from "./CategoriesList";
import Products from "./Products";
import PriceFilterPanel from "./PriceFilterPanel";
import ProductSearch from "./ProductSearch";
import CartOverview from "../cart/CartOverview";

// Matches the sort values apiProducts.js's getProducts() already supports.
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

function ProductsSection({
  products,
  loading,
  error,
  displayCount,
  setDisplayCount,
  username,
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
  searchQuery,
  onSearchChange,
}) {
  return (
    <div>
      <div className="container-foundation flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center lg:w-xl gap-6 py-6 border-stone">
          <PriceFilterPanel
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApply={onFilterApply}
            onClear={onFilterClear}
          />

          <div className="flex items-center gap-2">
            <label htmlFor="sortSelect" className="text-charcoal text-sm">
              Sort
            </label>
            <select
              id="sortSelect"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="border border-stone bg-cream outline-none p-2 text-sm text-charcoal"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p className="border-l border-stone pl-6 text-taupe">
            Showing 1 - {Math.min(displayCount, products.length)} of{" "}
            {products.length}
          </p>
        </div>
      </div>

      <CategoriesList
        navigate={navigate}
        loading={loading}
        setLoading={setLoading}
      />
      <CartOverview />
      <ProductSearch value={searchQuery} onChange={onSearchChange} />

      <Products
        navigate={navigate}
        username={username}
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
      />
    </div>
  );
}

export default ProductsSection;
