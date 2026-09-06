import { Menu, Search } from "lucide-react";
import { Link } from "react-router";
import HeaderDesktopNav from "./HeaderDesktopNav";
import HeaderDesktopIcons from "./HeaderDesktopIcons";
import CartIcon from "./CartIcon";

// Always in normal document flow, so nav/cart/search stay reachable even on
// pages too short to trigger the floating header's scrolled state.
const HeaderPrimary = ({
  isMobileSearchOpen,
  onToggleMobileSearch,
  mobileSearchQuery,
  onMobileSearchChange,
  onMobileSearchSubmit,
  mobileSearchInputRef,
  onSearchClick,
  onOpenMobileMenu,
  isMobileMenuOpen,
}) => (
  <header className="top-0 left-0 right-0 z-60 py-6 font-medium mx-auto px-[clamp(1.25rem,4vw,5rem)] w-full bg-transparent text-charcoal">
    <div className="flex w-full justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <img src="/images/main-logo.png" alt="logo" />
        <p className="text-4xl font-bold">Vermera</p>
      </Link>

      {/* Desktop nav */}
      <HeaderDesktopNav />

      {/* Desktop Icons */}
      <HeaderDesktopIcons onSearchClick={onSearchClick} />

      {/* Mobile bar: search, cart, menu */}
      <div className="flex items-center gap-5 lg:hidden">
        <button
          type="button"
          onClick={onToggleMobileSearch}
          aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
          aria-expanded={isMobileSearchOpen}
          aria-controls="mobile-search-row"
        >
          <Search className="cursor-pointer" aria-hidden="true" />
        </button>
        <CartIcon />
        <button
          type="button"
          onClick={onOpenMobileMenu}
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
          onSubmit={onMobileSearchSubmit}
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
            onChange={onMobileSearchChange}
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
);

export default HeaderPrimary;
