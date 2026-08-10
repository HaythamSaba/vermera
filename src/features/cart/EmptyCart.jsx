import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import MainButton from "../../ui/MainButton";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="container-foundation section max-w-2xl mx-auto">
      <div className="bg-cream border border-stone p-12 text-center flex flex-col items-center">
        <ShoppingCart
          className="w-16 h-16 mx-auto mb-4 text-stone"
          aria-hidden="true"
        />
        <h2 className="text-2xl font-serif font-medium text-espresso mb-2">
          Your cart is empty
        </h2>
        <p className="text-taupe mb-6">Add some products to get started!</p>
        <MainButton
          content="Shop Products"
          variant="quiet"
          onClick={() => navigate("/products")}
        />
      </div>
    </div>
  );
};

export default EmptyCart;
