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
      className={`w-10 h-10 absolute bg-primary-500 flex justify-center items-center rounded-full top-4 left-0 text-white ml-4 cursor-pointer z-50 ${
        isCartOpen
          ? "bg-primary-600 transition-transform ease-in-out duration-300 translate-x-64"
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
          className={`absolute top-12 left-0 w-64 h-80 flex flex-col justify-between  bg-primary-100 shadow-lg rounded-lg p-4 text-black z-50 ${
            isCartOpen ? "-translate-x-64" : ""
          }`}
        >
          {totalCartQuantity === 0 ? (
            <p className="text-center mt-32">Your cart is empty.</p>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-bold mb-2">Cart Overview</h3>
                <hr className="mb-4" />
                <p>Total Quantity: {totalCartQuantity}</p>
                <p>Total Price: ${totalCartPrice.toFixed(2)}</p>
              </div>
              <div className="mt-4 flex flex-col justify-center">
                <hr className="mb-4" />
                <MainButton variant="secondary" onClick={handleNavigate}>
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
