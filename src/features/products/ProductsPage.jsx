import CoverBackgroundSection from "../../ui/CoverBackgroundSection";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";
import ProductsSection from "./ProductsSection";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const ProductsPage = () => {
  useDocumentTitle("Shop");
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSortChange = (value) => {
    updateParams({ sort: value === "newest" ? null : value });
  };

  const handleFilterClear = () => {
    updateParams({ minPrice: null, maxPrice: null });
  };

  return (
    <div>
      <CoverBackgroundSection title={"Shop"} path={["Home", "Shop"]} />

      <ProductsSection
        navigate={navigate}
        username={username}
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
        error={error}
        setError={setError}
        onSortChange={handleSortChange}
        onFilterApply={updateParams}
        onFilterClear={handleFilterClear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
};

export default ProductsPage;
