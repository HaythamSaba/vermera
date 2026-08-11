import { SlidersHorizontal, X } from "lucide-react";
import CoverBackgroundSection from "../../ui/CoverBackgroundSection";
import Products from "./Products";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { Suspense, useState } from "react";
import CategoriesList from "./CategoriesList";
import MainButton from "../../ui/MainButton";

// Matches the sort values apiProducts.js's getProducts() already supports.
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

const ProductsPage = () => {
  const loaderProducts = useLoaderData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const username = useSelector((state) => state.user.username);
  const [products, setProducts] = useState(loaderProducts || []);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);
  const [error, setError] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState(minPrice ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice ?? "");

  const hasActiveFilter = minPrice != null || maxPrice != null;

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    updateParams({ sort: value === "newest" ? null : value });
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    updateParams({
      minPrice: minPriceInput === "" ? null : minPriceInput,
      maxPrice: maxPriceInput === "" ? null : maxPriceInput,
    });
    setIsFilterOpen(false);
  };

  const handleClearFilter = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    updateParams({ minPrice: null, maxPrice: null });
    setIsFilterOpen(false);
  };

  return (
    <div>
      <CoverBackgroundSection title={"Shop"} path={["Home", "products"]} />

      <Suspense fallback={<div className="text-center py-6">Loading...</div>}>
        <div className="container-foundation">
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-stone">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen((open) => !open)}
                aria-expanded={isFilterOpen}
                aria-controls="price-filter-panel"
                className="flex items-center gap-2 text-charcoal hover:text-brass transition-colors duration-300"
              >
                <SlidersHorizontal size={18} aria-hidden="true" />
                <span>Filter{hasActiveFilter ? " (1)" : ""}</span>
              </button>

              {isFilterOpen && (
                <form
                  id="price-filter-panel"
                  onSubmit={handleApplyFilter}
                  className="absolute top-full left-0 mt-3 z-20 bg-cream border border-stone p-4 w-64 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-charcoal">Price</p>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      aria-label="Close filter"
                    >
                      <X size={16} className="text-taupe" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="sr-only" htmlFor="minPriceInput">
                      Minimum price
                    </label>
                    <input
                      id="minPriceInput"
                      type="number"
                      min="0"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full border border-stone bg-cream outline-none p-2 text-sm"
                    />
                    <span className="text-taupe">–</span>
                    <label className="sr-only" htmlFor="maxPriceInput">
                      Maximum price
                    </label>
                    <input
                      id="maxPriceInput"
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full border border-stone bg-cream outline-none p-2 text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleClearFilter}
                      className="text-sm text-taupe hover:text-brass transition-colors duration-300"
                    >
                      Clear
                    </button>
                    <MainButton
                      type="submit"
                      size="small"
                      variant="quiet"
                      content="Apply"
                    />
                  </div>
                </form>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sortSelect" className="text-charcoal text-sm">
                Sort
              </label>
              <select
                id="sortSelect"
                value={sort}
                onChange={handleSortChange}
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
        />
      </Suspense>
    </div>
  );
};

export default ProductsPage;
