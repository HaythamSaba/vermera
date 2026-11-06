import { Heart } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import AnimatedCount from "./AnimatedCount";
import { getWishlistCount } from "../features/wishlist/wishlistSlice";

// Shared wishlist icon + real Redux item count, reused across the primary
// header, the floating scrolled header, and the mobile drawer. `children`
// renders a text label inside the same link (the drawer's "Wishlist" row),
// so callers never wrap this in another <Link>: nested <a> is invalid HTML.
// Same API as CartIcon.
const WishlistIcon = ({ className = "", onClick, children }) => {
  const wishlistCount = useSelector(getWishlistCount);

  return (
    <Link
      to="/wishlist"
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
    >
      {/* The badge anchors to this inner box (the icon itself), not the link,
          so callers can pad the link for a bigger tap target (see
          iconHitAreaClass) without pushing the badge off the heart. Same
          structure as CartIcon. */}
      <span className="relative inline-flex">
        <Heart className="cursor-pointer" aria-hidden="true" />
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brass text-charcoal text-[10px] font-semibold leading-none">
            <AnimatedCount value={wishlistCount} />
          </span>
        )}
      </span>
      {children}
    </Link>
  );
};

export default WishlistIcon;
