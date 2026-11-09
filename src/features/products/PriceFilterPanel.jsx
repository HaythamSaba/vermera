import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import MainButton from "../../ui/MainButton";
import useClickOutside from "../../hooks/useClickOutside";

const MIN_ID = "minPriceInput";
const MAX_ID = "maxPriceInput";
const ERROR_ID = "price-filter-error";

// Quiet "Price" text dropdown. Owns its open/closed and input state — the
// parent only passes the applied min/max (to seed the inputs) and receives
// committed values on Apply/Clear. Active ranges show as chips in the
// toolbar, so the trigger itself stays a plain label.
function PriceFilterPanel({ minPrice, maxPrice, onApply, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState(minPrice ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice ?? "");
  const [error, setError] = useState("");
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  // minPrice/maxPrice can change from outside this component (back/forward,
  // a removed chip, a shared link). Re-seed only when the panel opens so
  // in-progress typing isn't clobbered while it's open.
  useEffect(() => {
    if (isOpen) {
      setMinPriceInput(minPrice ?? "");
      setMaxPriceInput(maxPrice ?? "");
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const hasActiveFilter = minPrice != null || maxPrice != null;

  const handleApply = (e) => {
    e.preventDefault();
    const min = minPriceInput === "" ? null : Number(minPriceInput);
    const max = maxPriceInput === "" ? null : Number(maxPriceInput);
    if (min != null && max != null && min > max) {
      setError("Minimum price can't be higher than maximum.");
      document.getElementById(MIN_ID)?.focus();
      return;
    }
    onApply({
      minPrice: min == null ? null : String(min),
      maxPrice: max == null ? null : String(max),
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setError("");
    onClear();
    setIsOpen(false);
  };

  const inputProps = {
    type: "number",
    min: "0",
    inputMode: "numeric",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? ERROR_ID : undefined,
    className: `w-full border ${error ? "border-error" : "border-stone"} bg-cream p-2 text-sm`,
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="price-filter-panel"
        className={`min-h-11 flex items-center gap-1.5 text-sm cursor-pointer transition-colors ${
          hasActiveFilter ? "text-espresso font-medium" : "text-charcoal hover:text-espresso"
        }`}
      >
        Price
        <ChevronDown
          className={`w-4 h-4 text-taupe motion-safe:transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <form
          id="price-filter-panel"
          onSubmit={handleApply}
          noValidate
          className="absolute top-full left-0 mt-2 z-20 bg-cream border border-stone shadow-soft p-4 w-64 flex flex-col gap-3"
        >
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Price range in euros</legend>
            <label className="sr-only" htmlFor={MIN_ID}>
              Minimum price
            </label>
            <input
              id={MIN_ID}
              placeholder="Min €"
              value={minPriceInput}
              onChange={(e) => {
                setMinPriceInput(e.target.value);
                setError("");
              }}
              {...inputProps}
            />
            <span className="text-taupe" aria-hidden="true">
              –
            </span>
            <label className="sr-only" htmlFor={MAX_ID}>
              Maximum price
            </label>
            <input
              id={MAX_ID}
              placeholder="Max €"
              value={maxPriceInput}
              onChange={(e) => {
                setMaxPriceInput(e.target.value);
                setError("");
              }}
              {...inputProps}
            />
          </fieldset>
          {error && (
            <p id={ERROR_ID} className="text-error text-sm">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="min-h-11 px-1 text-sm text-taupe underline underline-offset-4 decoration-stone hover:text-charcoal cursor-pointer"
            >
              Clear
            </button>
            <MainButton type="submit" size="small" variant="quiet" content="Apply" />
          </div>
        </form>
      )}
    </div>
  );
}

export default PriceFilterPanel;
