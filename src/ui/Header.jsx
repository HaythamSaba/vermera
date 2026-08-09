import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import SearchModal from "../features/order/SearchModal";
import useClickOutside from "../hooks/useClickOutside";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { getTotalCartQuantity } from "../features/cart/cartSlice";

const navLinkClass =
  "cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]";

const MotionHeader = motion.header;

// Shared cart icon + real Redux item count, reused across the primary
// header, the floating scrolled header, and the mobile bar.
const CartIcon = () => {
  const totalCartQuantity = useSelector(getTotalCartQuantity);

  return (
    <Link
      to="/cart"
      className="relative inline-flex"
      aria-label={`Cart, ${totalCartQuantity} item${totalCartQuantity === 1 ? "" : "s"}`}
    >
      <ShoppingCart className="cursor-pointer" aria-hidden="true" />
      {totalCartQuantity > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brass text-cream text-[10px] font-semibold leading-none">
          {totalCartQuantity}
        </span>
      )}
    </Link>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  const mobileMenuRef = useRef();
  const mobileMenuCloseRef = useRef();
  const mobileSearchInputRef = useRef();

  useClickOutside(mobileMenuRef, () => setIsMobileMenuOpen(false));

  useLockBodyScroll(isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes whichever mobile overlay is currently open.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (isMobileSearchOpen) {
        setIsMobileSearchOpen(false);
        setMobileSearchQuery("");
      }
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, isMobileSearchOpen]);

  // Move focus into the drawer when it opens.
  useEffect(() => {
    if (isMobileMenuOpen) {
      mobileMenuCloseRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  // Autofocus the expandable mobile search field when it opens.
  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [isMobileSearchOpen]);

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(true);
    setIsMobileSearchOpen(false);
  };

  const handleToggleMobileSearch = () => {
    setIsMobileSearchOpen((open) => !open);
    setIsMobileMenuOpen(false);
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (!mobileSearchQuery) return;
    navigate(`/order/${mobileSearchQuery}`);
    setIsMobileSearchOpen(false);
    setMobileSearchQuery("");
  };

  return (
    <>
      {/* Primary header — always in normal document flow, so nav/cart/search
          stay reachable even on pages too short to trigger the scrolled state. */}
      <header className="top-0 left-0 right-0 z-60 py-6 font-medium px-8 lg:px-20 w-full bg-transparent text-charcoal">
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="./images/main-logo.png" alt="logo" />
            <p className="text-4xl font-bold">Vermera</p>
          </Link>

          {/* Desktop nav */}
          <ul className="gap-10 lg:gap-12 xl:gap-20 items-center justify-between hidden lg:flex">
            <li className={navLinkClass}>
              <Link to="/">Home</Link>
            </li>
            <li className={navLinkClass}>
              <Link to="/products">Shop</Link>
            </li>
            <li className={navLinkClass}>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Desktop Icons */}
          <ul className="hidden lg:flex gap-12 items-center justify-between">
            <li>
              <Link to="/profile" aria-label="Your account">
                <User className="cursor-pointer" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search your order"
              >
                <Search className="cursor-pointer" aria-hidden="true" />
              </button>
            </li>
            <li>
              <CartIcon />
            </li>
          </ul>

          {/* Mobile bar: search, cart, menu */}
          <div className="flex items-center gap-5 lg:hidden">
            <button
              type="button"
              onClick={handleToggleMobileSearch}
              aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isMobileSearchOpen}
              aria-controls="mobile-search-row"
            >
              <Search className="cursor-pointer" aria-hidden="true" />
            </button>
            <CartIcon />
            <button
              type="button"
              onClick={handleOpenMobileMenu}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <Menu className="cursor-pointer" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Expandable mobile search */}
        {isMobileSearchOpen && (
          <div id="mobile-search-row" className="lg:hidden mt-4">
            <form
              onSubmit={handleMobileSearchSubmit}
              role="search"
              className="flex items-end gap-3"
            >
              <label htmlFor="mobile-search-input" className="sr-only">
                Search your order by ID
              </label>
              <input
                id="mobile-search-input"
                ref={mobileSearchInputRef}
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Enter your order ID..."
                className="w-full border-b border-current bg-transparent py-2 text-sm text-current outline-none placeholder:text-taupe"
              />
              <button
                type="submit"
                className="text-sm font-medium underline underline-offset-4 decoration-brass shrink-0 cursor-pointer"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Floating header — mounts only once scrolled, sliding down and
          fading in instead of snapping into place. Shares all state/handlers
          with the primary header above, so there is still only one drawer,
          one search modal, one cart count. */}
      <AnimatePresence>
        {isScrolled && (
          <MotionHeader
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-60 py-4 font-medium px-8 lg:px-20 w-full bg-espresso/80 text-cream shadow-soft border-b border-espresso backdrop-blur-lg"
          >
            <div className="flex w-full justify-between items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="./images/main-logo.png" alt="logo" className="h-8 w-auto" />
                <p className="text-2xl font-bold">Vermera</p>
              </Link>

              <ul className="gap-10 lg:gap-12 xl:gap-20 items-center justify-between hidden lg:flex">
                <li className={navLinkClass}>
                  <Link to="/">Home</Link>
                </li>
                <li className={navLinkClass}>
                  <Link to="/products">Shop</Link>
                </li>
                <li className={navLinkClass}>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>

              <ul className="hidden lg:flex gap-12 items-center justify-between">
                <li>
                  <Link to="/profile" aria-label="Your account">
                    <User className="cursor-pointer" aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Search your order"
                  >
                    <Search className="cursor-pointer" aria-hidden="true" />
                  </button>
                </li>
                <li>
                  <CartIcon />
                </li>
              </ul>

              {/* Mobile: search opens the shared modal here (no room for the
                  inline row on a bar pinned above the fold) */}
              <div className="flex items-center gap-5 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search your order"
                >
                  <Search className="cursor-pointer" aria-hidden="true" />
                </button>
                <CartIcon />
                <button
                  type="button"
                  onClick={handleOpenMobileMenu}
                  aria-label="Open menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-nav-drawer"
                >
                  <Menu className="cursor-pointer" aria-hidden="true" />
                </button>
              </div>
            </div>
          </MotionHeader>
        )}
      </AnimatePresence>

      {/* Mobile Slide Menu */}
      <div
        id="mobile-nav-drawer"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        className={`fixed top-0 right-0 h-full w-64 bg-cream text-charcoal shadow-soft z-70 transform transition-transform duration-500 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-stone">
          <p className="text-xl font-bold">Menu</p>
          <button
            ref={mobileMenuCloseRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="cursor-pointer" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-6 px-6 py-8 text-lg">
            <li className={navLinkClass}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className={navLinkClass}>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                Shop
              </Link>
            </li>
            <li className={navLinkClass}>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
            </li>

            <hr className="border-stone" />

            <li>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="inline-block mr-3" size={20} aria-hidden="true" />
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 z-60"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Search Modal (desktop + floating-bar mobile) */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
