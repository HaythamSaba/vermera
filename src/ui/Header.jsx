import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import SearchModal from "../features/order/SearchModal";
import useClickOutside from "../hooks/useClickOutside";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import useFocusTrap from "../hooks/useFocusTrap";
import HeaderPrimary from "./HeaderPrimary";
import HeaderFloating from "./HeaderFloating";
import HeaderMobileDrawer from "./HeaderMobileDrawer";

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
  // panel becomes inert immediately (see HeaderMobileDrawer).
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

  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

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

  const handleOpenSearchModal = () => setIsSearchOpen(true);

  return (
    <>
      {/* Primary header — always in normal document flow, so nav/cart/search
          stay reachable even on pages too short to trigger the scrolled state. */}
      <HeaderPrimary
        isMobileSearchOpen={isMobileSearchOpen}
        onToggleMobileSearch={handleToggleMobileSearch}
        mobileSearchQuery={mobileSearchQuery}
        onMobileSearchChange={(e) => setMobileSearchQuery(e.target.value)}
        onMobileSearchSubmit={handleMobileSearchSubmit}
        mobileSearchInputRef={mobileSearchInputRef}
        onSearchClick={handleOpenSearchModal}
        onOpenMobileMenu={handleOpenMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Floating header — shares all state/handlers with the primary header
          above, so there is still only one drawer, one search modal, one
          cart count. */}
      <HeaderFloating
        isScrolled={isScrolled}
        onSearchClick={handleOpenSearchModal}
        onOpenMobileMenu={handleOpenMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <HeaderMobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        menuRef={mobileMenuRef}
        closeButtonRef={mobileMenuCloseRef}
        onSearchClick={handleOpenSearchModal}
      />

      {/* Search Modal (desktop + floating-bar mobile) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;
