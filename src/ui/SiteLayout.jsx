import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";

// Full storefront chrome: announcement bar, header (nav, search, bag) and
// footer. Every route except checkout renders inside this.
const SiteLayout = () => (
  <>
    <AnnouncementBar />
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default SiteLayout;
