import { useEffect } from "react";
import Hero from "./Hero";
import CategoryShowcase from "./CategoryShowcase";
import TheEdit from "./TheEdit";
import EditorialBanner from "./EditorialBanner";
import ServiceValues from "./ServiceValues";
import InspirationSection from "./InspirationSection";

const MainPageContent = () => {
  // Resets the tab title back to the bare site name when navigating home
  // from a page that appended its own name via useDocumentTitle.
  useEffect(() => {
    document.title = "Vermera";
  }, []);

  return (
    <div>
      <Hero />
      <CategoryShowcase />
      <TheEdit />
      <InspirationSection />
      <ServiceValues />
      <EditorialBanner />
    </div>
  );
};

export default MainPageContent;
