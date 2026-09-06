import { Link } from "react-router";

export const navLinkClass =
  "w-fit cursor-pointer relative after:content-[''] after:absolute after:bg-brass after:h-[3px] after:w-0 hover:after:w-full after:duration-300 after:left-0 after:-bottom-[3px]";

// Shared Home/Shop/Contact/About nav list, reused identically by the
// primary header and the floating scrolled header.
const HeaderDesktopNav = () => (
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
    <li className={navLinkClass}>
      <Link to="/about">About</Link>
    </li>
  </ul>
);

export default HeaderDesktopNav;
