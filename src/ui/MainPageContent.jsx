import Home from "./Home";
import BrowseRangeSection from "./BrowseRangeSection";
import Products from "../features/products/Products";
import FuniroFurnitureSection from "./FuniroFurnitureSection";
import Footer from "./Footer";
import RoomInspirationSection from "./RoomInspirationSection";

const MainPageContent = () => {
  return (
    <div>
      <Home />
      <BrowseRangeSection />
      <Products />
      {/* <RoomInspirationSection /> */}
      <FuniroFurnitureSection />
    </div>
  );
};

export default MainPageContent;
