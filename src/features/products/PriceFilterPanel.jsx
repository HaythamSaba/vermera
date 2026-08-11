import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import MainButton from "../../ui/MainButton";

// Owns its own open/closed and input state — the parent only needs to know
// the currently-applied min/max (to seed the inputs) and receive the final
// committed values on Apply/Clear.
function PriceFilterPanel({ minPrice, maxPrice, onApply, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState(minPrice ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice ?? "");

  const hasActiveFilter = minPrice != null || maxPrice != null;

  const handleApply = (e) => {
    e.preventDefault();
    onApply({
      minPrice: minPriceInput === "" ? null : minPriceInput,
      maxPrice: maxPriceInput === "" ? null : maxPriceInput,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="price-filter-panel"
        className="flex items-center gap-2 text-charcoal hover:text-brass transition-colors duration-300"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        <span>Filter{hasActiveFilter ? " (1)" : ""}</span>
      </button>

      {isOpen && (
        <form
          id="price-filter-panel"
          onSubmit={handleApply}
          className="absolute top-full left-0 mt-3 z-20 bg-cream border border-stone p-4 w-64 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-charcoal">Price</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close filter"
            >
              <X size={16} className="text-taupe" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="minPriceInput">
              Minimum price
            </label>
            <input
              id="minPriceInput"
              type="number"
              min="0"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full border border-stone bg-cream outline-none p-2 text-sm"
            />
            <span className="text-taupe">–</span>
            <label className="sr-only" htmlFor="maxPriceInput">
              Maximum price
            </label>
            <input
              id="maxPriceInput"
              type="number"
              min="0"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full border border-stone bg-cream outline-none p-2 text-sm"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-taupe hover:text-brass transition-colors duration-300"
            >
              Clear
            </button>
            <MainButton
              type="submit"
              size="small"
              variant="quiet"
              content="Apply"
            />
          </div>
        </form>
      )}
    </div>
  );
}

export default PriceFilterPanel;
