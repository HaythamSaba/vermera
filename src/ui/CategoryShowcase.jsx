import { useEffect, useState } from "react";
import { Link } from "react-router";
import { m } from "framer-motion";
import { getProducts } from "../services/apiProducts";
import {
  getCategoryLabel,
  supportedCategories,
} from "../features/products/categories";
import Reveal from "./Reveal";
import RevealGroup from "./RevealGroup";
import { revealItemVariants } from "../utils/motion";

const MotionLink = m.create(Link);
const tileVariants = revealItemVariants({ distance: 32, durationMs: 850 });

function CategoryShowcase() {
  // One representative product per category, fetched once from the real
  // catalog (live DummyJSON data, or the same mock fallback the rest of the
  // app already relies on) — never invented placeholder data.
  const [categoryProducts, setCategoryProducts] = useState({});

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

      {/* Tiles are all present from the first render (mapped from the
          static supportedCategories list) — only their image swaps from
          skeleton to photo later — so the group reveal runs once. */}
      <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {supportedCategories.map((slug, index) => {
          const product = categoryProducts[slug];
          const label = getCategoryLabel(slug);
          const isFeatured = index === 0;

          return (
            <MotionLink
              key={slug}
              variants={tileVariants}
              to={`/products?category=${slug}`}
              aria-label={`Shop ${label}`}
              className={`group flex flex-col ${
                isFeatured ? "col-span-2 row-span-2" : ""
              }`}
            >
              <div
                className={`overflow-hidden bg-stone/20 border border-stone mb-3 ${
                  isFeatured ? "flex-1 aspect-square sm:aspect-auto" : "aspect-square"
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
            </MotionLink>
          );
        })}
      </RevealGroup>
    </section>
  );
}

export default CategoryShowcase;