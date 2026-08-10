import { Link } from "react-router";
import { supportedCategories } from "../services/apiProducts";
import { CATEGORY_LABELS } from "../features/products/categoryLabels";

const linkClass = "hover:text-brass transition-colors duration-300";

const Footer = () => {
  return (
    <footer className="bg-cream text-charcoal">
      <hr className="border-t border-stone" />

      <div className="container-foundation grid gap-10 sm:grid-cols-2 lg:grid-cols-3 py-12 lg:py-20">
        {/* Brand */}
        <div>
          <p className="text-2xl font-serif font-medium mb-4">Vermera.</p>
          <p className="text-taupe max-w-xs">
            Considered pieces for everyday living.
          </p>
        </div>

        {/* Shop */}
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

        {/* Customer care */}
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
          </ul>
        </div>
      </div>

      <div className="border-t border-stone">
        <div className="container-foundation py-6 text-sm text-taupe text-center">
          © {new Date().getFullYear()} Vermera. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
