import Hero from "./Hero";
import CategoryShowcase from "./CategoryShowcase";
import Products from "../features/products/Products";
import EditorialBanner from "./EditorialBanner";
import ServiceValues from "./ServiceValues";
import InspirationSection from "./InspirationSection";

const MainPageContent = () => {
  return (
    <div>
      <Hero />
      <CategoryShowcase />
      <Products />
      <InspirationSection />
      <ServiceValues />
      <EditorialBanner />
    </div>
  );
};

export default MainPageContent;
