import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Search, X } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import useFocusTrap from "../../hooks/useFocusTrap";
import SectionHeader from "../../ui/SectionHeader";
import { getProducts } from "../../services/apiProducts";
import { formatPrice } from "../../utils/pricing";
import { getProductSearchPath } from "./productSearchPath";
import { searchProducts } from "./searchProducts";

const MAX_RESULTS = 5;

// One live result: image, name and price, linking to the product.
const SearchResult = ({ product, onSelect }) => (
  <li>
    <Link
      to={`/products/${product.sku}`}
      onClick={onSelect}
      className="flex items-center gap-4 py-3 group"
    >
      <span className="shrink-0 size-14 bg-stone/20 border border-stone overflow-hidden">
        <img
          src={product.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </span>
      <span className="flex-1 min-w-0 text-charcoal line-clamp-1 group-hover:underline underline-offset-4 decoration-1">
        {product.productName}
      </span>
      <span className="shrink-0 text-sm font-medium text-charcoal">
        {formatPrice(product.NewPrice)}
      </span>
    </Link>
  </li>
);

// The header's search (desktop icon, floating header, mobile drawer): live
// product results as you type (audit V10), from the cached catalog
// (getProducts shares one in-memory request), with "See all results" — or
// Enter — landing on /products?q=… (audit decision D2). Order lookup lives
// on the Profile page instead (OrderLookup).
const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  // null until the catalog has loaded (instant after the first page load).
  const [catalog, setCatalog] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef();
  const inputRef = useRef();

  // Every close path (X button, click outside, Escape, submit, picking a
  // result) goes through this so the query is always cleared alongside
  // notifying the parent.
  const handleClose = () => {
    onClose();
    setQuery("");
  };

  useClickOutside(modalRef, handleClose);

  useLockBodyScroll(isOpen);

  useFocusTrap(modalRef, isOpen);

  // Move focus into the dialog when it opens, matching the header's mobile
  // drawer convention.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load the full catalog once, the first time the dialog opens. getProducts
  // never throws (it falls back to the bundled snapshot).
  useEffect(() => {
    if (!isOpen || catalog) return;
    let isCancelled = false;
    getProducts({ limit: 0 }).then((products) => {
      if (!isCancelled) setCatalog(products);
    });
    return () => {
      isCancelled = true;
    };
  }, [isOpen, catalog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(getProductSearchPath(query));
    handleClose();
  };

  if (!isOpen) return null;

  const trimmedQuery = query.trim();
  const matches = trimmedQuery ? searchProducts(catalog ?? [], query) : [];
  const topMatches = matches.slice(0, MAX_RESULTS);

  let statusMessage = "";
  if (trimmedQuery && catalog) {
    statusMessage =
      matches.length === 0
        ? `No pieces match “${trimmedQuery}”.`
        : `${matches.length} ${matches.length === 1 ? "piece" : "pieces"} found.`;
  } else if (trimmedQuery) {
    statusMessage = "Searching…";
  }

  return (
    <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-start justify-center pt-24 sm:pt-32">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        className="bg-cream shadow-soft p-6 sm:p-8 w-full max-w-2xl mx-4 relative max-h-[calc(100dvh-8rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close search"
          className="absolute top-3 right-3 size-11 inline-flex items-center justify-center text-taupe hover:text-charcoal transition-colors cursor-pointer"
        >
          <X size={24} aria-hidden="true" />
        </button>

        {/* The dialog's accessible name comes from this visible heading
            (aria-labelledby above), so the two can't drift apart. */}
        <SectionHeader id="search-dialog-title" title="Search Products" />

        {/* Enter goes to the full results page; there's no separate button
            because results appear as you type. */}
        <form role="search" onSubmit={handleSubmit}>
          <label htmlFor="headerProductSearch" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="headerProductSearch"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bags, dresses, watches…"
              enterKeyHint="search"
              autoComplete="off"
              aria-describedby="search-dialog-status"
              className="w-full border border-stone bg-cream p-3 pl-9"
            />
          </div>
        </form>

        {/* Announces the match count politely as the query changes. Shown
            visibly only for "no matches" / "searching"; with results, the
            list itself says enough. */}
        <p
          id="search-dialog-status"
          role="status"
          className={
            statusMessage && topMatches.length === 0
              ? "mt-4 text-sm text-taupe"
              : "sr-only"
          }
        >
          {statusMessage}
        </p>

        {topMatches.length > 0 && (
          <>
            <ul
              aria-label="Top matches"
              className="mt-4 divide-y divide-stone border-y border-stone"
            >
              {topMatches.map((product) => (
                <SearchResult
                  key={product.sku}
                  product={product}
                  onSelect={handleClose}
                />
              ))}
            </ul>
            <Link
              to={getProductSearchPath(query)}
              onClick={handleClose}
              className="mt-4 inline-flex items-center gap-2 min-h-11 text-sm font-medium text-charcoal underline underline-offset-4 decoration-brass hover:decoration-charcoal"
            >
              {matches.length > MAX_RESULTS
                ? `See all ${matches.length} results`
                : "See results in the shop"}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
