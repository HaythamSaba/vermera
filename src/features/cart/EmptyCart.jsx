import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import MainButton from "../../ui/MainButton";

// `embedded`: render just the card, without the standalone-page container, for
// reuse inside another page's own layout (e.g. the Profile sidebar).
const EmptyCart = ({ embedded = false }) => {
  const navigate = useNavigate();

  const card = (
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
  );

  if (embedded) return card;

  return (
    <div className="container-foundation section max-w-2xl mx-auto">{card}</div>
  );
};

export default EmptyCart;
