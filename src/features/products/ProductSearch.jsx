import { Search, X } from "lucide-react";

// Lives only on the Products page — filters the already-loaded product list
// client-side as the user types, no extra network round trip.
const ProductSearch = ({ value, onChange }) => {
  return (
    <div className="w-full md:w-1/2 px-20  m-auto relative text-center">
      <Search
        className="absolute left-22 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe"
        aria-hidden="true"
      />
      <label htmlFor="productSearch" className="sr-only">
        Search products
      </label>
      <input
        id="productSearch"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full h-14 px-9 py-2 border border-stone bg-cream outline-none text-sm text-charcoal placeholder:text-taupe focus:border-none focus:ring-1 focus:ring-brass"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-taupe hover:text-charcoal transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default ProductSearch;
