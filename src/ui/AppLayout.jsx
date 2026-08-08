import { Outlet, useNavigation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main>
        {/* Main content will be rendered here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
