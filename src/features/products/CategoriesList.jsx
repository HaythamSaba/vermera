import { useNavigate, useSearchParams } from "react-router";
import { supportedCategories } from "../../services/apiProducts";
import { CATEGORY_LABELS } from "./categoryLabels";

function CategoriesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  // Preserve any existing sort/price-filter params — only category changes.
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
    <div className="flex gap-3 py-6 px-8 mb-8 bg-cream border-b border-stone overflow-x-auto">
      <span
        key="all"
        className={`py-2 px-4 w-full text-center whitespace-nowrap cursor-pointer transition-colors duration-300 border ${
          activeCategory === "all"
            ? "bg-espresso text-cream border-espresso"
            : "bg-cream text-charcoal border-stone hover:border-brass"
        }`}
        onClick={() => handleSelect("all")}
      >
        All
      </span>
      {supportedCategories.map((slug) => (
        <span
          key={slug}
          className={`py-2 px-4 w-full text-center whitespace-nowrap cursor-pointer transition-colors duration-300 border ${
            activeCategory === slug
              ? "bg-espresso text-cream border-espresso"
              : "bg-cream text-charcoal border-stone hover:border-brass"
          }`}
          onClick={() => handleSelect(slug)}
        >
          {CATEGORY_LABELS[slug] ?? slug}
        </span>
      ))}
    </div>
  );
}

export default CategoriesList;
