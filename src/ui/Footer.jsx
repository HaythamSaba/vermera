import { lazy, Suspense } from "react";
import { Link } from "react-router";
import { supportedCategories } from "../services/apiProducts";
import { CATEGORY_LABELS } from "../features/products/categoryLabels";
import Logo from "./Logo";

const FooterParallaxText = lazy(() => import("./FooterParallaxText"));

const linkClass = "hover:text-brass transition-colors duration-300";

const Footer = () => {
  return (
    <div className="relative isolate pt-50">
      <Suspense fallback={null}>
        <FooterParallaxText />
      </Suspense>

      <hr className="border-t border-stone" />

      <footer
        className="relative z-10 bg-cream text-charcoal shadow-[0_-10px_30px_10px_rgba(0,0,0,0.1)]"
      >
        <div className="container-foundation grid gap-10 sm:grid-cols-2 lg:grid-cols-3 py-12 lg:py-20">
          <div>
            <Logo size="default" className="mb-4" />
            <p className="text-taupe max-w-xs">
              Considered pieces for everyday living.
            </p>
          </div>

          <div aria-label="Shop">
            <p className="text-taupe font-medium mb-4">Shop</p>
            <ul className="grid grid-cols-2 gap-3 ">
              <li>
                <Link to="/products" className={linkClass}>
                  All Products
                </Link>
              </li>
              {supportedCategories.map((slug) => (
                <li key={slug}>
                  <Link to={`/products?category=${slug}`} className={linkClass}>
                    {CATEGORY_LABELS[slug] ?? slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div aria-label="Customer care">
            <p className="text-taupe font-medium mb-4">Customer Care</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/cart" className={linkClass}>
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/profile" className={linkClass}>
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/contact" className={linkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  About the Developer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone">
          <div className="container-foundation py-6 text-sm text-taupe text-center">
            © {new Date().getFullYear()} Vermera. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
