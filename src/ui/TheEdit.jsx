import { Link, useLoaderData } from "react-router";
import { supportedCategories } from "../features/products/categories";
import ProductItem from "../features/products/ProductItem";
import Reveal from "./Reveal";

const MAX_PIECES = 8;

// A deterministic pick from real catalog data (audit decision D9) — no
// invented "bestseller" signal: for each collection, in catalog order, the
// first in-stock piece after the one already pictured on that category's
// "Shop By Category" tile (CategoryShowcase uses each category's first
// product), so the two sections never repeat an image. Up to 8 pieces.
function pickEdit(products) {
  return supportedCategories
    .map((slug) =>
      products
        .filter((product) => product.category === slug)
        .slice(1)
        .find((product) => product.stock > 0),
    )
    .filter(Boolean)
    .slice(0, MAX_PIECES);
}

// Homepage "The Edit": a small curated grid with a "View all" link, instead
// of the full paginated catalog (which lives on /products). Reads the "/"
// route's loader data — the full catalog — so it costs no extra fetch.
function TheEdit() {
  const products = useLoaderData() ?? [];
  const pieces = pickEdit(products);

  if (pieces.length === 0) return null;

  return (
    <section
      aria-labelledby="the-edit-heading"
      className="container-foundation section"
    >
      <Reveal
        as="div"
        className="flex flex-wrap items-end justify-between gap-4 mb-10"
      >
        <div>
          <h2
            id="the-edit-heading"
            className="font-serif font-medium text-[32px] text-charcoal"
          >
            The Edit
          </h2>
          <p className="text-xl text-taupe">One piece from each collection</p>
        </div>
        <Link
          to="/products"
          className="text-sm font-medium uppercase tracking-[0.15em] text-charcoal underline underline-offset-8 decoration-stone hover:decoration-charcoal transition-colors"
        >
          View all
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {pieces.map((product) => (
          <ProductItem key={product.sku} product={product} />
        ))}
      </div>
    </section>
  );
}

export default TheEdit;
