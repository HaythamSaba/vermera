import { Link } from "react-router";
import { supportedCategories } from "../services/apiProducts";
import { CATEGORY_LABELS } from "../features/products/categoryLabels";
import Logo from "./Logo";

const linkClass = "hover:text-brass transition-colors duration-300";

const Footer = () => {
  return (
    <div className="relative isolate pt-50 overflow-x-hidden">
      {/* Static watermark (it used to parallax, which loaded GSAP on every
          route; the hero keeps the site's one parallax). Fluid size:
          clamp(3.25rem,14vw,12.5rem) never overflows a 320px viewport and
          reaches the original 200px from ~1428px up. */}
      <p
        aria-hidden="true"
        className="absolute top-[12%] md:top-[2%] ml-20 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(3.25rem,14vw,12.5rem)] text-taupe/40 text-center tracking-widest select-none pointer-events-none -z-10 whitespace-nowrap"
      >
        VERMERA
      </p>

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
                <Link to="/profile#track-order" className={linkClass}>
                  Track an order
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
