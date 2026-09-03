import { ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import MainButton from "../../ui/MainButton";
import useClickOutside from "../../hooks/useClickOutside";
import useFocusTrap from "../../hooks/useFocusTrap";

const MotionDiv = motion.div;

const CartOverview = () => {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();
  const containerRef = useRef();
  const toggleButtonRef = useRef();
  const wasCartOpenRef = useRef(false);

  useClickOutside(containerRef, () => setIsCartOpen(false));

  useFocusTrap(containerRef, isCartOpen);

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen]);

  // Return focus to the toggle button the instant the panel starts closing
  // (not after the exit animation completes) — guarded so it never fires on
  // initial mount, only on a genuine open→close transition.
  useEffect(() => {
    if (wasCartOpenRef.current && !isCartOpen) {
      toggleButtonRef.current?.focus();
    }
    wasCartOpenRef.current = isCartOpen;
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
          ref={toggleButtonRef}
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

        {/* Wrapper stays mounted every render so aria-hidden/inert reflect
            isCartOpen immediately, even while the panel is still playing
            its exit animation. */}
        <div aria-hidden={!isCartOpen} inert={!isCartOpen}>
          <AnimatePresence>
            {isCartOpen && (
              <MotionDiv
                id="cart-overview-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Cart overview"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-12 w-64 flex flex-col gap-4 bg-cream border border-stone shadow-soft p-4 text-charcoal"
              >
                {totalCartQuantity === 0 ? (
                  <p className="text-center py-6 text-taupe">
                    Your cart is empty.
                  </p>
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
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CartOverview;
