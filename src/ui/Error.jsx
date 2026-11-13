import {
  Link,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router";
import { Search } from "lucide-react";
import {
  supportedCategories,
  getCategoryLabel,
} from "../features/products/categories";
import { getProductSearchPath } from "../features/products/productSearchPath";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useMetaDescription from "../hooks/useMetaDescription";

// Editorial error page (audit V19). A 404 is a common landing (old links,
// removed SKUs), so instead of a dead end it offers the Shop, every
// category and a product search. The copy depends on what was missing.
const COPY = {
  product: {
    title: "Piece not found",
    heading: "This piece is no longer in the edit.",
    message:
      "It may have sold through or moved. Browse the collections below, or search for something similar.",
  },
  order: {
    title: "Order not found",
    heading: "We couldn't find that order.",
    message:
      "Orders are saved in the browser they were placed in. Check the reference, or look it up from your account.",
  },
  page: {
    title: "Page not found",
    heading: "This page isn't part of the edit.",
    message:
      "The link may be old or mistyped. Start from the Shop, a collection or a search.",
  },
  unexpected: {
    title: "Something went wrong",
    heading: "Something went wrong on our side.",
    message: "Try loading the page again, or carry on browsing below.",
  },
};

function getErrorKind(error, pathname) {
  if (!isRouteErrorResponse(error) || error.status !== 404) return "unexpected";
  if (pathname.startsWith("/products/")) return "product";
  if (pathname.startsWith("/order/")) return "order";
  return "page";
}

const linkClass =
  "text-charcoal underline underline-offset-4 decoration-stone hover:decoration-charcoal transition-colors";

const ErrorSearch = () => {
  const navigate = useNavigate();

  // Uncontrolled: the value is only needed on submit.
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q") ?? "";
    navigate(getProductSearchPath(String(query)));
  };

  return (
    <form
      role="search"
      aria-labelledby="error-search-heading"
      onSubmit={handleSubmit}
      className="max-w-md"
    >
      <h2
        id="error-search-heading"
        className="font-serif font-medium text-2xl text-espresso mb-4"
      >
        Search the shop
      </h2>
      <label htmlFor="errorProductSearch" className="sr-only">
        Search products
      </label>
      <div className="flex border border-stone bg-cream focus-within:border-charcoal transition-colors">
        <input
          id="errorProductSearch"
          name="q"
          type="search"
          placeholder="Bags, dresses, watches…"
          enterKeyHint="search"
          autoComplete="off"
          className="flex-1 min-w-0 bg-transparent px-4 py-3 text-charcoal placeholder:text-taupe"
        />
        <button
          type="submit"
          aria-label="Search"
          className="w-12 shrink-0 flex items-center justify-center text-charcoal hover:text-espresso cursor-pointer"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
};

const Error = () => {
  const error = useRouteError();
  const { pathname } = useLocation();
  const kind = getErrorKind(error, pathname);
  const copy = COPY[kind];

  useDocumentTitle(copy.title);
  useMetaDescription(copy.message);

  return (
    <div className="bg-ivory">
      <div className="container-foundation section">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-taupe">
          {kind === "unexpected" ? "Error" : "404"}
        </p>
        <h1 className="font-serif font-medium text-espresso text-4xl sm:text-5xl leading-tight mt-2 mb-4 max-w-2xl">
          {copy.heading}
        </h1>
        <p className="text-taupe text-lg leading-relaxed max-w-xl mb-8">
          {copy.message}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-12">
          {/* A real link styled like MainButton's "quiet" variant, since
              MainButton only renders a <button>. */}
          <Link
            to="/products"
            className="inline-flex items-center justify-center min-h-11 px-8 py-3 text-sm uppercase font-medium tracking-wide bg-espresso border border-espresso text-cream hover:bg-transparent hover:text-espresso transition-all duration-300"
          >
            Shop all
          </Link>
          {kind === "order" && (
            <Link to="/profile#track-order" className={linkClass}>
              Track an order
            </Link>
          )}
          {kind === "unexpected" && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`${linkClass} cursor-pointer`}
            >
              Reload the page
            </button>
          )}
          <Link to="/" className={linkClass}>
            Back to home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-stone">
          <nav aria-labelledby="error-collections-heading">
            <h2
              id="error-collections-heading"
              className="font-serif font-medium text-2xl text-espresso mb-4"
            >
              Collections
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              {supportedCategories.map((slug) => (
                <li key={slug}>
                  <Link to={`/products?category=${slug}`} className={linkClass}>
                    {getCategoryLabel(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ErrorSearch />
        </div>
      </div>
    </div>
  );
};

export default Error;
