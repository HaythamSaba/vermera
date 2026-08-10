import { useNavigate, useSearchParams } from "react-router";
import { supportedCategories } from "../../services/apiProducts";
import { CATEGORY_LABELS } from "./categoryLabels";

function CategoriesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleSelect = (slug) => {
    if (slug === "all") {
      navigate("/products");
    } else {
      navigate(`/products?category=${slug}`);
    }
  };

  return (
    <div className="flex gap-4 py-6 px-8 mb-8 bg-primary-100 overflow-x-auto">
      <span
        key="all"
        className={`py-2 px-4 w-full rounded-3xl text-center whitespace-nowrap cursor-pointer transition-colors duration-300 ${
          activeCategory === "all"
            ? "bg-primary-600 text-white"
            : "bg-primary-500 text-white hover:bg-primary-600"
        }`}
        onClick={() => handleSelect("all")}
      >
        All
      </span>
      {supportedCategories.map((slug) => (
        <span
          key={slug}
          className={`py-2 px-4 w-full rounded-3xl text-center whitespace-nowrap cursor-pointer transition-colors duration-300 ${
            activeCategory === slug
              ? "bg-primary-600 text-white"
              : "bg-primary-500 text-white hover:bg-primary-600"
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
