import { Link } from "react-router";
import {
  CATEGORY_LABELS,
  supportedCategories,
} from "../features/products/categories";
import Logo from "./Logo";

const linkClass = "hover:text-brass transition-colors duration-300";

const Footer = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Static, in-flow watermark: it sizes its own band (no fixed 200px
          spacer, no absolute positioning), so the gap above the footer is
          just the wordmark. clamp(3rem,10vw,8rem) fits a 320px viewport
          and caps at 128px on wide screens. */}
      <p
        aria-hidden="true"
        className="pt-12 font-serif leading-none text-[clamp(3rem,10vw,8rem)] text-taupe/40 text-center tracking-widest select-none whitespace-nowrap"
      >
        VERMERA
      </p>

      <footer className="bg-cream text-charcoal border-t border-stone">
        <div className="container-foundation grid gap-10 sm:grid-cols-2 lg:grid-cols-3 py-12 lg:py-20">
          <div>
            <Logo size="default" className="mb-4" />
            <p className="text-taupe max-w-xs">
              A considered edit for every day.
            </p>
          </div>

          <nav aria-label="Shop">
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
          </nav>

          <nav aria-label="Customer care">
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
                <Link to="/profile#track-order" className={linkClass}>
                  Track an order
                </Link>
              </li>
              <li>
                <Link to="/contact" className={linkClass}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        {/* Colophon: the developer link is about the site, not customer
            care, so it lives here rather than in a link group (D7). */}
        <div className="border-t border-stone">
          <div className="container-foundation py-6 text-sm text-taupe flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Vermera. All rights reserved.</p>
            <p>
              A portfolio project ·{" "}
              <Link
                to="/about"
                className="underline underline-offset-4 decoration-stone hover:text-charcoal hover:decoration-charcoal transition-colors"
              >
                About the developer
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
