import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  sort = "newest",
  minPrice = null,
  maxPrice = null,
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

  const prefersReducedMotion = useReducedMotion();
  const revealEnabled = !isControlled;

  const cardParentVariants = {
    initial:
      revealEnabled && !prefersReducedMotion ? { opacity: 0 } : { opacity: 1 },
    visible: {
      opacity: 1,
      transition:
        revealEnabled && !prefersReducedMotion
          ? {
              when: "beforeChildren",
              staggerChildren: 0.25,
              delayChildren: 0.1,
            }
          : { duration: 0 },
    },
  };

  useEffect(() => {
    // Self-managed mode: fetch once on mount since no external loader supplied the data.
    if (!isControlled) {
      const fetchInitial = async () => {
        setLoading(true);
        const data = await getProducts({ category, sort, minPrice, maxPrice });
        setProducts(data);
        setLoading(false);
      };
      fetchInitial();
      return;
    }

    // Controlled mode: re-fetch whenever category, sort, or price filters
    // change, including back to "no filter" (falsy values still mean "show
    // everything" per getProducts' own contract).
    const fetchFiltered = async () => {
      setLoading(true);
      const data = await getProducts({ category, sort, minPrice, maxPrice });
      setProducts(data);
      setLoading(false);
    };
    fetchFiltered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, minPrice, maxPrice, isControlled]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  const displayedProducts = products?.slice(0, displayCount);
  const hasMore = displayCount < products?.length;
  const hasActiveFilters = category || minPrice != null || maxPrice != null;

  const handleViewCart = () => {
    if (!username) return navigate("/profile");
    navigate("/cart");
  };

  // Only take over the whole section for the very first load, when there's
  // nothing on screen yet. Once products exist, a filter/sort/category
  // change re-fetches in the background — the stale grid stays visible
  // (dimmed) below instead of being replaced by a spinner.
  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section className="container-foundation flex flex-col items-center">
        <div className="text-center mb-16">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <MainButton
            content="Retry"
            variant="quiet"
            onClick={() => window.location.reload()}
          />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="container-foundation flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-serif font-medium text-espresso mb-4">
            Our Products
          </h2>
          <p className="text-taupe text-lg">
            {hasActiveFilters
              ? "No products match your current filters."
              : "No products available at the moment."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="container-foundation flex flex-col">
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-serif font-medium text-espresso">
            Our Products
          </h2>
          {category && (
            <p className="text-taupe mt-2 text-lg capitalize">
              Showing {category} collection
            </p>
          )}
        </div>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex justify-center pt-16 bg-ivory/60">
              <div className="w-10 h-10 border-4 border-stone border-t-brass rounded-full animate-spin" />
            </div>
          )}
          <motion.div
            variants={cardParentVariants}
            initial="initial"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            aria-busy={loading}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 w-full transition-opacity duration-200 ${
              loading ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
          >
            {displayedProducts.map((product, index) => (
              <ProductItem
                key={product.sku || product.id}
                product={product}
                index={index}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex items-center justify-center my-8">
          {hasMore && (
            <MainButton
              content="Load More"
              variant="quiet"
              onClick={handleLoadMore}
            />
          )}
          {totalCartQuantity > 0 && (
            <MainButton
              content={`View Cart (${totalCartQuantity})`}
              onClick={handleViewCart}
              className="ml-4"
              variant="outline"
            />
          )}
        </div>

        {!hasMore && products.length > 8 && (
          <p className="text-taupe mt-4">
            Showing all {products.length} products
          </p>
        )}
      </section>
    </>
  );
};

export default Products;
