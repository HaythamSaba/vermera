import { Link, Outlet } from "react-router";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";

// Slim checkout chrome (audit V13): no announcement bar, navigation, search,
// footer links or wordmark — the only ways out are the logo and "Back to bag",
// so the page's focus is completing the order.
const CheckoutLayout = () => (
  <>
    <header className="border-b border-stone">
      <div className="container-foundation flex items-center justify-between py-3">
        <Logo size="primary" />
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 min-h-11 text-sm font-medium text-charcoal underline-offset-4 decoration-1 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to bag
        </Link>
      </div>
    </header>
    <main>
      <Outlet />
    </main>
    <footer className="border-t border-stone">
      <p className="container-foundation py-6 text-sm text-taupe">
        © {new Date().getFullYear()} Vermera
      </p>
    </footer>
  </>
);

export default CheckoutLayout;
