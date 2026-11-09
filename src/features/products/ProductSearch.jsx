import { Search, X } from "lucide-react";

// Lives only on the Products page — filters the already-loaded product list
// client-side as the user types, no extra network round trip. Sized by its
// container (the Shop toolbar row).
const ProductSearch = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe"
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
        placeholder="Search products…"
        className="w-full h-11 pl-9 pr-9 border border-stone bg-cream text-sm text-charcoal placeholder:text-taupe"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-0 top-1/2 -translate-y-1/2 size-11 inline-flex items-center justify-center text-taupe hover:text-charcoal transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default ProductSearch;
