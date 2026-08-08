import { SlidersHorizontal } from "lucide-react";
import CoverBackgroundSection from "../../ui/CoverBackgroundSection";
import Products from "./Products";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";
import CategoriesList from "./CategoriesList";

const ProductsPage = () => {
  const loaderProducts = useLoaderData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const username = useSelector((state) => state.user.username);
  const [products, setProducts] = useState(loaderProducts || []);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);
  const [error, setError] = useState(null);

  return (
    <div>
      <CoverBackgroundSection title={"Shop"} path={["Home", "products"]} />
      <div className="flex gap-4 py-6 px-8 mb-8 bg-primary-100 w-full">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal />
            <p>Filter</p>
          </div>
        </div>
        <div>Sorting</div>
        <p className="border-l-2 pl-4">
          Showing 1 - {displayCount} of {products.length}
        </p>
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
        displayCount={displayCount}
        setDisplayCount={setDisplayCount}
        products={products}
        setProducts={setProducts}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />
    </div>
  );
};

export default ProductsPage;
