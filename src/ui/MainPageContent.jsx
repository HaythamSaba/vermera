import Hero from "./Hero";
import CategoryShowcase from "./CategoryShowcase";
import Products from "../features/products/Products";
import FuniroFurnitureSection from "./FuniroFurnitureSection";
import RoomInspirationSection from "./RoomInspirationSection";

const MainPageContent = () => {
  return (
    <div>
      <Hero />
      <CategoryShowcase />
      <Products />
      {/* <RoomInspirationSection /> */}
      <FuniroFurnitureSection />
    </div>
  );
};

export default MainPageContent;
