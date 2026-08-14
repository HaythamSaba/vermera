import { Outlet, useNavigation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div>
      {/* Slim top progress indicator — React Router already keeps the
          previous page mounted while a loader runs, so we only need a cue
          that a navigation is in flight, not a full-page takeover. */}
      {isLoading && (
        <div
          role="progressbar"
          aria-label="Loading"
          className="fixed top-0 left-0 right-0 z-70 h-[3px] bg-brass animate-pulse"
        />
      )}
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
