import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import SearchModal from "../features/order/SearchModal";
import useClickOutside from "../hooks/useClickOutside";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import useFocusTrap from "../hooks/useFocusTrap";
import { getTotalCartQuantity } from "../features/cart/cartSlice";
import { getWishlistCount } from "../features/wishlist/wishlistSlice";

const navLinkClass =
  "w-fit cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]";

const MotionHeader = motion.header;
const MotionDiv = motion.div;

// Shared wishlist icon + real Redux item count, reused across the primary
// header and the floating scrolled header.
const WishlistIcon = ({ className = "", onClick }) => {
  const wishlistCount = useSelector(getWishlistCount);

  return (
    <Link
      to="/wishlist"
      onClick={onClick}
      className={`relative inline-flex ${className}`}
      aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
    >
      <Heart className="cursor-pointer" aria-hidden="true" />
      {wishlistCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brass text-cream text-[10px] font-semibold leading-none">
          {wishlistCount}
        </span>
      )}
    </Link>
  );
};

// Shared cart icon + real Redux item count, reused across the primary
// header, the floating scrolled header, and the mobile bar.
const CartIcon = ({ className = "", onClick, children }) => {
  const totalCartQuantity = useSelector(getTotalCartQuantity);

  return (
    <Link
      to="/cart"
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={`Cart, ${totalCartQuantity} item${totalCartQuantity === 1 ? "" : "s"}`}
    >
      <span className="relative inline-flex">
        <ShoppingCart className="cursor-pointer" aria-hidden="true" />
        {totalCartQuantity > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brass text-cream text-[10px] font-semibold leading-none">
            {totalCartQuantity}
          </span>
        )}
      </span>
      {children}
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
  // Captures whichever hamburger button (primary or floating header) was
  // actually clicked to open the drawer, so focus can return to it on close
  // regardless of which one triggered the open.
  const mobileMenuTriggerRef = useRef(null);

  useClickOutside(mobileMenuRef, () => setIsMobileMenuOpen(false));

  useLockBodyScroll(isMobileMenuOpen);

  useFocusTrap(mobileMenuRef, isMobileMenuOpen);

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

  // Return focus to whichever button opened the drawer, the instant it
  // starts closing — not after the exit animation finishes, since the
  // panel becomes inert immediately (see the drawer markup below).
  useEffect(() => {
    if (!isMobileMenuOpen && mobileMenuTriggerRef.current) {
      if (mobileMenuTriggerRef.current.isConnected) {
        mobileMenuTriggerRef.current.focus();
      }
      mobileMenuTriggerRef.current = null;
    }
  }, [isMobileMenuOpen]);

  // Autofocus the expandable mobile search field when it opens.
  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [isMobileSearchOpen]);

  const handleOpenMobileMenu = () => {
    mobileMenuTriggerRef.current = document.activeElement;
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
      <header className="top-0 left-0 right-0 z-60 py-6 font-medium mx-auto px-[clamp(1.25rem,4vw,5rem)] w-full bg-transparent text-charcoal">
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/main-logo.png" alt="logo" />
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
              <WishlistIcon />
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
            className="fixed top-0 left-0 right-0 z-60 py-4 font-medium mx-auto px-[clamp(1.25rem,4vw,5rem)] w-full bg-espresso/80 text-cream shadow-soft border-b border-espresso backdrop-blur-lg"
          >
            <div className="flex w-full justify-between items-center">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/images/main-logo.png"
                  alt="logo"
                  className="h-8 w-auto"
                />
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
                  <WishlistIcon />
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

      {/* Mobile Slide Menu — the outer wrapper stays mounted every render so
          its aria-hidden/inert reflect isMobileMenuOpen immediately, even
          while the inner motion.div is still playing its exit animation
          (AnimatePresence freezes the exiting element's own props). */}
      <div aria-hidden={!isMobileMenuOpen} inert={!isMobileMenuOpen}>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <MotionDiv
              id="mobile-nav-drawer"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-64 bg-cream text-charcoal shadow-soft z-50"
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
                    <Link
                      to="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Shop
                    </Link>
                  </li>
                  <li className={navLinkClass}>
                    <Link
                      to="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </li>

                  <hr className="border-stone" />

                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User
                        className="inline-block mr-3"
                        size={20}
                        aria-hidden="true"
                      />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart
                        className="inline-block mr-3"
                        size={20}
                        aria-hidden="true"
                      />
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(true)}
                      aria-label="Search your order"
                      className="flex items-center cursor-pointer"
                    >
                      <Search
                        size={20}
                        className="inline-block mr-3"
                        aria-hidden="true"
                      />
                      Search
                    </button>
                  </li>
                  <li>
                    <CartIcon onClick={() => setIsMobileMenuOpen(false)}>
                      Cart
                    </CartIcon>
                  </li>
                </ul>
              </nav>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal/40 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Search Modal (desktop + floating-bar mobile) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;
