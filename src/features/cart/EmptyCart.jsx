import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import MainButton from "../../ui/MainButton";

const EmptyCart = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center flex flex-col items-center">
      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-600 mb-6">Add some products to get started!</p>
      <MainButton>
        <Link to="/products">Shop Products</Link>
      </MainButton>
    </div>
  );
};

export default EmptyCart;
