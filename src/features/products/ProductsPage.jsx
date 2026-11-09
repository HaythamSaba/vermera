import CoverBackgroundSection from "../../ui/CoverBackgroundSection";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigationType,
  useSearchParams,
} from "react-router";
import { useState } from "react";
import ProductsSection from "./ProductsSection";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useMetaDescription from "../../hooks/useMetaDescription";
import { CATEGORY_LABELS } from "./categories";
import { DEFAULT_SORT, normalizeSort } from "./sortOptions";

const PAGE_SIZE = 8;

const FROM_SEARCH_BOX = "fromProductSearchBox";

const ProductsPage = () => {
  useDocumentTitle("Shop");
  const { products: loaderProducts, isFallbackCatalog } = useLoaderData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  useMetaDescription(
    category
      ? `Shop ${(CATEGORY_LABELS[category] ?? category.replace(/-/g, " ")).toLowerCase()} at Vermera — filter by price and sort by price or name.`
      : "Shop the full Vermera catalog — bags, dresses, jewelry, shoes, watches, and beauty essentials. Filter by category and price, or sort and search.",
  );
  // Unknown or retired values (old links with ?sort=newest) read as Featured.
  const sort = normalizeSort(searchParams.get("sort"));
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const [products, setProducts] = useState(loaderProducts || []);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  // The search lives in the URL (?q=) so a header search can land here
  // already filtered and a search is shareable/reloadable. The box itself
  // is driven by local state, though: router updates are async, so binding
  // the input straight to the URL dropped keystrokes when typing fast.
  // Typing writes through to the URL with a REPLACE marked FROM_SEARCH_BOX;
  // any other change of location (header search while already here, and
  // back/forward — a POP restores the marker too, so it's excluded) re-seeds
  // the box from the URL.
  const location = useLocation();
  const navigationType = useNavigationType();
  const urlQuery = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [syncedLocationKey, setSyncedLocationKey] = useState(location.key);
  if (location.key !== syncedLocationKey) {
    setSyncedLocationKey(location.key);
    const isOwnKeystroke =
      navigationType === "REPLACE" && location.state?.[FROM_SEARCH_BOX];
    if (!isOwnKeystroke) setSearchQuery(urlQuery);
  }

  // Any change to what's being listed starts "Load More" over from the first
  // page (adjusting state during render, so there's no stale-count frame).
  const listingKey = [category, sort, minPrice, maxPrice, searchQuery].join("|");
  const [lastListingKey, setLastListingKey] = useState(listingKey);
  if (listingKey !== lastListingKey) {
    setLastListingKey(listingKey);
    setDisplayCount(PAGE_SIZE);
  }

  // Client-side filter on top of whatever category/sort/price fetch already
  // produced — no extra network round trip, so results update every
  // keystroke. `products` (raw, unfiltered) is still what re-fetches write
  // to via setProducts; this derived list is only for display.
  const q = searchQuery.trim().toLowerCase();
  const visibleProducts = q
    ? products.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    : products;

  const updateParams = (updates, navigateOptions) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next, navigateOptions);
  };

  // replace: typing shouldn't push one history entry per keystroke.
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    updateParams(
      { q: value.trim() ? value : null },
      { replace: true, state: { [FROM_SEARCH_BOX]: true } },
    );
  };

  const handleSortChange = (value) => {
    updateParams({ sort: value === DEFAULT_SORT ? null : value });
  };

  const handleFilterClear = () => {
    updateParams({ minPrice: null, maxPrice: null });
  };

  // keys: the URL params one active-filter chip clears.
  const handleRemoveFilter = (keys) => {
    updateParams(Object.fromEntries(keys.map((key) => [key, null])));
  };

  // Clears every filter but keeps the chosen sort. Not marked as a search-box
  // keystroke, so the search box re-seeds to empty from the URL.
  const handleClearAll = () => {
    updateParams({ category: null, minPrice: null, maxPrice: null, q: null });
  };

  return (
    <div>
      <CoverBackgroundSection title={"Shop"} path={["Home", "Shop"]} size="primary" />

      <ProductsSection
        navigate={navigate}
        category={category}
        sort={sort}
        minPrice={minPrice}
        maxPrice={maxPrice}
        displayCount={displayCount}
        setDisplayCount={setDisplayCount}
        products={visibleProducts}
        setProducts={setProducts}
        loading={loading}
        setLoading={setLoading}
        isFallbackCatalog={isFallbackCatalog}
        onSortChange={handleSortChange}
        onFilterApply={updateParams}
        onFilterClear={handleFilterClear}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
};

export default ProductsPage;
