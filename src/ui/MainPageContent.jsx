import Hero from "./Hero";
import CategoryShowcase from "./CategoryShowcase";
import Products from "../features/products/Products";
import EditorialBanner from "./EditorialBanner";
import ServiceValues from "./ServiceValues";
import FuniroFurnitureSection from "./FuniroFurnitureSection";
import InspirationSection from "./InspirationSection";

const MainPageContent = () => {
  return (
    <div>
      <Hero />
      <CategoryShowcase />
      <Products />
      <EditorialBanner />
      <ServiceValues />
      <InspirationSection />
    </div>
  );
};

export default MainPageContent;
