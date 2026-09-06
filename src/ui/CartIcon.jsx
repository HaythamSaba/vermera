import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import AnimatedCount from "./AnimatedCount";
import { getTotalCartQuantity } from "../features/cart/cartSlice";

// Shared cart icon + real Redux item count, reused across the primary
// header, the floating scrolled header, and the mobile drawer.
const CartIcon = ({ className = "", onClick, children }) => {
  const totalCartQuantity = useSelector(getTotalCartQuantity);

  return (
    <Link
      to="/cart"
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={`Cart, ${totalCartQuantity} item${totalCartQuantity === 1 ? "" : "s"}`}
    >
      <span className="relative inline-flex">
        <ShoppingCart className="cursor-pointer" aria-hidden="true" />
        {totalCartQuantity > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brass text-cream text-[10px] font-semibold leading-none">
            <AnimatedCount value={totalCartQuantity} />
          </span>
        )}
      </span>
      {children}
    </Link>
  );
};

export default CartIcon;
