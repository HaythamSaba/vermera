import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { Link } from "react-router";
import HeaderDesktopNav from "./HeaderDesktopNav";
import HeaderDesktopIcons from "./HeaderDesktopIcons";
import CartIcon from "./CartIcon";

const MotionHeader = motion.header;

// Mounts only once scrolled, sliding down and fading in instead of snapping
// into place. Shares all state/handlers with the primary header, so there
// is still only one drawer, one search modal, one cart count.
const HeaderFloating = ({
  isScrolled,
  onSearchClick,
  onOpenMobileMenu,
  isMobileMenuOpen,
}) => (
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
              src="/images/main-logo.webp"
              alt="logo"
              className="h-8 w-auto"
            />
            <p className="text-2xl font-bold">Vermera</p>
          </Link>

          <HeaderDesktopNav />
          <HeaderDesktopIcons onSearchClick={onSearchClick} />

          {/* Mobile: search opens the shared modal here (no room for the
              inline row on a bar pinned above the fold) */}
          <div className="flex items-center gap-5 lg:hidden">
            <button
              type="button"
              onClick={onSearchClick}
              aria-label="Search your order"
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
      </MotionHeader>
    )}
  </AnimatePresence>
);

export default HeaderFloating;
