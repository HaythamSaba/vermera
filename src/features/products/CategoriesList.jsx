import { useNavigate, useSearchParams } from "react-router";
import { supportedCategories } from "../../services/apiProducts";
import { CATEGORY_LABELS } from "./categoryLabels";

const tabClass = (isActive) =>
  `shrink-0 py-3 -mb-px border-b-2 whitespace-nowrap text-sm cursor-pointer transition-colors duration-300 ${
    isActive
      ? "border-espresso text-espresso font-medium"
      : "border-transparent text-taupe hover:text-charcoal"
  }`;

// Underlined text tabs (not boxed buttons) on one hairline, scrolling
// sideways on narrow screens. Changing category keeps sort/price/search.
function CategoriesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleSelect = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug === "all") {
      next.delete("category");
    } else {
      next.set("category", slug);
    }
    const query = next.toString();
    navigate(query ? `/products?${query}` : "/products");
  };

  return (
    <div
      role="group"
      aria-label="Filter by category"
      // overflow-y-hidden: overflow-x-auto would otherwise make the tabs'
      // -mb-px (overlapping the hairline) scroll vertically by 1px.
      className="flex gap-6 sm:gap-8 overflow-x-auto overflow-y-hidden border-b border-stone"
    >
      {["all", ...supportedCategories].map((slug) => (
        <button
          type="button"
          key={slug}
          aria-pressed={activeCategory === slug}
          className={tabClass(activeCategory === slug)}
          onClick={() => handleSelect(slug)}
        >
          {slug === "all" ? "All" : (CATEGORY_LABELS[slug] ?? slug)}
        </button>
      ))}
    </div>
  );
}

export default CategoriesList;
