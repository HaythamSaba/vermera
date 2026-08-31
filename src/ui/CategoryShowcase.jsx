import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getProducts, supportedCategories } from "../services/apiProducts";
import { CATEGORY_LABELS } from "../features/products/categoryLabels";
import Reveal from "./Reveal";
import useStaggerReveal from "../hooks/useStaggerReveal";

function CategoryShowcase() {
  // One representative product per category, fetched once from the real
  // catalog (live DummyJSON data, or the same mock fallback the rest of the
  // app already relies on) — never invented placeholder data.
  const [categoryProducts, setCategoryProducts] = useState({});
  // Tiles are all present from the first render (mapped from the static
  // supportedCategories list) — only their inner image content swaps from
  // skeleton to real photo later — so a one-time setup (empty deps) is
  // correct here, unlike the product grid where cards don't exist until an
  // async fetch resolves.
  const { containerRef: gridRef } = useStaggerReveal(".category-tile", []);

  useEffect(() => {
    let isMounted = true;

    getProducts({ limit: 0 }).then((products) => {
      if (!isMounted) return;
      const byCategory = {};
      for (const product of products) {
        if (!byCategory[product.category]) {
          byCategory[product.category] = product;
        }
      }
      setCategoryProducts(byCategory);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container-foundation section">
      <Reveal as="div" className="text-center mb-12">
        <h2 className="font-serif font-medium text-[32px] text-charcoal">
          Shop By Category
        </h2>
        <p className="text-xl text-taupe">
          Browse each category, thoughtfully curated
        </p>
      </Reveal>

      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        {supportedCategories.map((slug, index) => {
          const product = categoryProducts[slug];
          const label = CATEGORY_LABELS[slug] ?? slug;
          const isFeatured = index === 0;

          return (
            <Link
              key={slug}
              to={`/products?category=${slug}`}
              aria-label={`Shop ${label}`}
              className={`category-tile group flex flex-col ${
                isFeatured ? "col-span-2 row-span-2" : ""
              }`}
            >
              <div
                className={`overflow-hidden bg-stone/20 border border-stone mb-3 ${
                  isFeatured
                    ? "flex-1 aspect-square sm:aspect-auto"
                    : "aspect-square"
                }`}
              >
                {product ? (
                  <img
                    src={product.image}
                    alt={`${product.productName}, from the Vermera ${label} collection`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full animate-pulse bg-stone/20" />
                )}
              </div>

              <p className="font-medium text-lg text-charcoal group-hover:text-brass transition-colors duration-300">
                {label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryShowcase;
