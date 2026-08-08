import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import MainButton from "../../ui/MainButton";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { getProducts } from "../../services/apiProducts";
import CartOverview from "../cart/CartOverview";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getTotalCartQuantity } from "../cart/cartSlice";

// `products`/`setProducts`/`loading`/`setLoading` are optional: pass them in
// (as ProductsPage does, sourced from the router loader) to control this
// component externally. Omit them to have it fetch and manage its own data
// (e.g. when embedded standalone on the home page).
const Products = ({
  category = null,
  setProducts: setProductsProp,
  products: productsProp,
  loading: loadingProp,
  setLoading: setLoadingProp,
  error = null,
  displayCount: displayCountProp,
  setDisplayCount: setDisplayCountProp,
  navigate: navigateProp,
  username,
}) => {
  const isControlled = productsProp !== undefined;

  const [internalProducts, setInternalProducts] = useState([]);
  const [internalLoading, setInternalLoading] = useState(!isControlled);
  const [internalDisplayCount, setInternalDisplayCount] = useState(8);
  const internalNavigate = useNavigate();

  const products = isControlled ? productsProp : internalProducts;
  const setProducts = setProductsProp ?? setInternalProducts;
  const loading = loadingProp ?? internalLoading;
  const setLoading = setLoadingProp ?? setInternalLoading;
  const displayCount = displayCountProp ?? internalDisplayCount;
  const setDisplayCount = setDisplayCountProp ?? setInternalDisplayCount;
  const navigate = navigateProp ?? internalNavigate;

  const totalCartQuantity = useSelector(getTotalCartQuantity);

  useEffect(() => {
    // Self-managed mode: fetch once on mount since no external loader supplied the data.
    if (!isControlled) {
      const fetchInitial = async () => {
        setLoading(true);
        const data = await getProducts({ category });
        setProducts(data);
        setLoading(false);
      };
      fetchInitial();
      return;
    }

    // Controlled mode: re-fetch whenever the selected category changes,
    // including back to no category (falsy `category` still means "show
    // everything" per getProducts' own contract).
    const fetchByCategory = async () => {
      setLoading(true);
      const data = await getProducts({ category });
      setProducts(data);
      setLoading(false);
    };
    fetchByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isControlled]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
    console.log("displayCount", displayCount);
  };

  const displayedProducts = products?.slice(0, displayCount);
  const hasMore = displayCount < products?.length;

  const handleVeiwCart = () => {
    if (!username) return navigate("/profile");
    navigate("/cart");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section className="template flex flex-col items-center">
        <div className="text-center py-16">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <MainButton
            content="Retry"
            onClick={() => window.location.reload()}
          />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="template flex flex-col items-center">
        <div className="text-center py-16">
          <h2 className="text-[40px] font-bold text-[#3A3A3A] mb-4">
            Our Products
          </h2>
          <p className="text-gray-600 text-lg">
            No products available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="template flex flex-col items-center relative my-20">
        <CartOverview />
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-bold text-[#3A3A3A]">Our Products</h2>
          {category && (
            <p className="text-gray-600 mt-2 text-lg capitalize">
              Showing {category} collection
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 w-full">
          {displayedProducts.map((product) => (
            <ProductItem key={product.sku || product.id} product={product} />
          ))}
        </div>

        <div className="flex items-center justify-center my-8">
          {hasMore && (
            <MainButton content="Load More" onClick={handleLoadMore} />
          )}
          {totalCartQuantity > 0 && (
            <MainButton
              content={`View Cart (${totalCartQuantity})`}
              onClick={() => handleVeiwCart()}
              className="ml-4"
              variant="outline"
            />
          )}
        </div>

        {!hasMore && products.length > 8 && (
          <p className="text-gray-500 mt-4">
            Showing all {products.length} products
          </p>
        )}
      </section>
    </>
  );
};

export default Products;
