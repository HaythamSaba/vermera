import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchModal from "../features/order/SearchModal";
import { Link } from "react-router";
import useClickOutside from "../hooks/useClickOutside";
import useLockBodyScroll from "../hooks/useLockBodyScroll";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef();

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

  return (
    <>
      <header
        className={`top-0 left-0 right-0 z-60 py-6 font-medium px-8 lg:px-20 w-full transition-all duration-700 ${
          isScrolled
            ? "bg-espresso fixed text-cream shadow-soft border-b border-espresso"
            : "bg-cream text-charcoal border-b border-stone"
        }`}
      >
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="./images/main-logo.png" alt="logo" />
            <p className="text-4xl font-bold">Vermera</p>
          </Link>

          {/* Desktop nav */}
          <ul className="gap-10 lg:gap-12 xl:gap-20 items-center justify-between hidden lg:flex">
            <li className="cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]">
              <Link to="/">Home</Link>
            </li>
            <li className="cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]">
              <Link to="/products">Shop</Link>
            </li>
            <li className="cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]">
              <Link to="/about">About</Link>
            </li>
            <li className="cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]">
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Desktop Icons */}
          <ul className="hidden lg:flex gap-12 items-center justify-between">
            <li>
              <Link to="/profile">
                <User className="cursor-pointer" />
              </Link>
            </li>
            <li>
              <Search
                className="cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
            </li>
            <li>
              <Heart className="cursor-pointer" />
            </li>
            <li>
              <Link to="/cart">
                <ShoppingCart className="cursor-pointer" />
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Menu
              className="cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Slide Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-cream text-charcoal shadow-soft z-70 transform transition-transform duration-500 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-stone">
          <p className="text-xl font-bold">Menu</p>
          <X
            className="cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>

        <ul className="flex flex-col gap-6 px-6 py-8 text-lg">
          <li className="cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]">
            <Link to="/">Home</Link>
          </li>
          <li className="cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]">
            <Link to="/products">Shop</Link>
          </li>
          <li className="cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]">
            <Link to="/about">About</Link>
          </li>
          <li className="cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]">
            <Link to="/contact">Contact</Link>
          </li>

          <hr />

          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
            <User className="inline-block mr-3" /> Profile
          </Link>
          <span
            className="cursor-pointer"
            onClick={() => {
              setIsSearchOpen(true);
              setIsMobileMenuOpen(false);
            }}
          >
            <Search className="inline-block mr-3" /> Search
          </span>
          <button className="text-left">
            <Heart className="inline-block mr-3" /> Wishlist
          </button>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
            <ShoppingCart className="inline-block mr-3" /> Cart
          </Link>
        </ul>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 z-60"
          // onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;
