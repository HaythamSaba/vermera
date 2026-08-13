import { ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import MainButton from "../../ui/MainButton";
import useClickOutside from "../../hooks/useClickOutside";

const CartOverview = () => {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();
  const containerRef = useRef();

  useClickOutside(containerRef, () => setIsCartOpen(false));

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen]);

  const handleNavigate = () => {
    setIsCartOpen(false);
    if (!username) return navigate("/profile");
    navigate("/cart");
  };

  return (
    <div className="relative px-20 container-foundation">
      <div ref={containerRef} className="sticky top-[20vh] z-10">
        <button
          type="button"
          onClick={() => setIsCartOpen((open) => !open)}
          aria-label={
            isCartOpen
              ? "Close cart overview"
              : `Cart overview, ${totalCartQuantity} item${totalCartQuantity === 1 ? "" : "s"}`
          }
          aria-expanded={isCartOpen}
          aria-controls="cart-overview-panel"
          className="w-10 h-10 flex justify-center items-center rounded-full bg-espresso text-cream cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          {isCartOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          )}
        </button>

        {isCartOpen && (
          <div
            id="cart-overview-panel"
            role="dialog"
            aria-label="Cart overview"
            className="absolute top-0 left-12 w-64 flex flex-col gap-4 bg-cream border border-stone shadow-soft p-4 text-charcoal"
          >
            {totalCartQuantity === 0 ? (
              <p className="text-center py-6 text-taupe">Your cart is empty.</p>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-serif font-medium text-espresso mb-2">
                    Cart Overview
                  </h3>
                  <hr className="mb-4 border-stone" />
                  <p className="text-charcoal">
                    Total Quantity: {totalCartQuantity}
                  </p>
                  <p className="text-charcoal">
                    Total Price: ${totalCartPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <hr className="mb-4 border-stone" />
                  <MainButton variant="quiet" onClick={handleNavigate}>
                    View Cart
                  </MainButton>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartOverview;
