import { Search, User } from "lucide-react";
import { Link } from "react-router";
import WishlistIcon from "./WishlistIcon";
import CartIcon from "./CartIcon";
import { iconHitAreaClass } from "./HeaderDesktopNav";

// Shared profile/wishlist/search/cart icon list, reused identically by the
// primary header and the floating scrolled header.
const HeaderDesktopIcons = ({ onSearchClick }) => (
  <ul className="hidden lg:flex gap-12 items-center justify-between">
    <li>
      <Link to="/profile" aria-label="Your account" className={iconHitAreaClass}>
        <User aria-hidden="true" />
      </Link>
    </li>
    <li>
      <WishlistIcon className={iconHitAreaClass} />
    </li>
    <li>
      <button
        type="button"
        onClick={onSearchClick}
        aria-label="Search products"
        className={iconHitAreaClass}
      >
        <Search aria-hidden="true" />
      </button>
    </li>
    <li>
      <CartIcon className={iconHitAreaClass} />
    </li>
  </ul>
);

export default HeaderDesktopIcons;
