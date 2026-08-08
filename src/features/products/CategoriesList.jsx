import { useEffect, useState } from "react";
import { getCategories, getProductsByCategory } from "../../services/apiProducts";

function CategoriesList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);
  return (
    <div className="flex gap-4 py-6 px-8 mb-8 bg-primary-100 overflow-x-auto">
      {categories.map((category) => (
        <span
          key={category.id}
          className="py-2 px-4 bg-primary-500 text-white w-full rounded-3xl text-center whitespace-nowrap cursor-pointer hover:bg-primary-600 transition-colors duration-300"
          onClick={() => getProductsByCategory(category.name)}
        >
          {category}
        </span>
      ))}
    </div>
  );
}

export default CategoriesList;
