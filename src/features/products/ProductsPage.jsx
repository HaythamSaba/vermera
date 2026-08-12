import CoverBackgroundSection from "../../ui/CoverBackgroundSection";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";
import ProductsSection from "./ProductsSection";

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
        products={products}
        setProducts={setProducts}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        onSortChange={handleSortChange}
        onFilterApply={updateParams}
        onFilterClear={handleFilterClear}
      />
    </div>
  );
};

export default ProductsPage;
