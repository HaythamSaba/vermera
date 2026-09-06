import { Heart } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import AnimatedCount from "./AnimatedCount";
import { getWishlistCount } from "../features/wishlist/wishlistSlice";

// Shared wishlist icon + real Redux item count, reused across the primary
// header, the floating scrolled header, and the mobile drawer.
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
          <AnimatedCount value={wishlistCount} />
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;
