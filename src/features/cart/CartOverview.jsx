import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import MainButton from "../../ui/MainButton";
import { useNavigate } from "react-router";
const CartOverview = () => {
  const totalCartQuantity = useSelector(getTotalCartQuantity);

  const totalCartPrice = useSelector(getTotalCartPrice);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!username) return navigate("/profile");
    navigate("/cart");
  };

  return (
    <div
      onClick={() => setIsCartOpen(!isCartOpen)}
      className={`w-10 h-10 absolute bg-espresso flex justify-center items-center rounded-full top-4 left-0 text-cream ml-4 cursor-pointer z-50 ${
        isCartOpen
          ? "transition-transform ease-in-out duration-300 translate-x-64"
          : "duration-300 transition-transform ease-in-out"
      }`}
    >
      {isCartOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <ShoppingCart className="w-6 h-6" />
      )}
      {isCartOpen && (
        <div
          className={`absolute top-12 left-0 w-64 h-80 flex flex-col justify-between bg-cream border border-stone shadow-soft p-4 text-charcoal z-50 ${
            isCartOpen ? "-translate-x-64" : ""
          }`}
        >
          {totalCartQuantity === 0 ? (
            <p className="text-center mt-32 text-taupe">Your cart is empty.</p>
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
              <div className="mt-4 flex flex-col justify-center">
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
  );
};

export default CartOverview;
