import { Search, User } from "lucide-react";
import { Link } from "react-router";
import WishlistIcon from "./WishlistIcon";
import CartIcon from "./CartIcon";

// Shared profile/wishlist/search/cart icon list, reused identically by the
// primary header and the floating scrolled header.
const HeaderDesktopIcons = ({ onSearchClick }) => (
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
        onClick={onSearchClick}
        aria-label="Search your order"
      >
        <Search className="cursor-pointer" aria-hidden="true" />
      </button>
    </li>
    <li>
      <CartIcon />
    </li>
  </ul>
);

export default HeaderDesktopIcons;
