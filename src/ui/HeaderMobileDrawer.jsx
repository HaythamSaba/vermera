import { AnimatePresence, motion } from "framer-motion";
import { Search, User, X } from "lucide-react";
import { Link } from "react-router";
import { navLinkClass } from "./HeaderDesktopNav";
import WishlistIcon from "./WishlistIcon";
import CartIcon from "./CartIcon";

const MotionDiv = motion.div;

// Slide-out mobile nav + its backdrop overlay — bundled together since they
// always open/close in lockstep. The outer wrapper stays mounted every
// render so its aria-hidden/inert reflect isOpen immediately, even while
// the inner motion.div is still playing its exit animation (AnimatePresence
// freezes the exiting element's own props).
const HeaderMobileDrawer = ({
  isOpen,
  onClose,
  menuRef,
  closeButtonRef,
  onSearchClick,
}) => (
  <>
    <div aria-hidden={!isOpen} inert={!isOpen}>
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            id="mobile-nav-drawer"
            ref={menuRef}
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
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="cursor-pointer" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-6 px-6 py-8 text-lg">
                <li className={navLinkClass}>
                  <Link to="/" onClick={onClose}>
                    Home
                  </Link>
                </li>
                <li className={navLinkClass}>
                  <Link to="/products" onClick={onClose}>
                    Shop
                  </Link>
                </li>
                <li className={navLinkClass}>
                  <Link to="/contact" onClick={onClose}>
                    Contact
                  </Link>
                </li>
                <li className={navLinkClass}>
                  <Link to="/about" onClick={onClose}>
                    About
                  </Link>
                </li>

                <hr className="border-stone" />

                <li>
                  <Link to="/profile" onClick={onClose}>
                    <User
                      className="inline-block mr-3"
                      size={20}
                      aria-hidden="true"
                    />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" onClick={onClose}>
                    <WishlistIcon className="inline-block mr-3" onClick={onClose} />
                    Wishlist
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onSearchClick}
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
                  <CartIcon onClick={onClose}>Cart</CartIcon>
                </li>
              </ul>
            </nav>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>

    {/* Overlay */}
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-charcoal/40 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  </>
);

export default HeaderMobileDrawer;
