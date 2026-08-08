import { ArrowRight, ShoppingCart } from "lucide-react";
import MainButton from "./MainButton";

const Buttons = () => {
  const isSubmitting = false; // Example state for loading
  return (
    <div>
      // Simple button
      <MainButton content="Shop Now" />
      // With icon (left - default)
      <MainButton content="Add to Cart">
        <ShoppingCart size={18} />
      </MainButton>
      // With icon (right)
      <MainButton content="Next" iconPosition="right">
        <ArrowRight size={18} />
      </MainButton>
      // Loading state
      <MainButton loading={isSubmitting} content="Processing" />
      // Different variants
      <MainButton variant="secondary" content="Cancel" />
      <MainButton variant="outline" content="Learn More" />
      // Full width
      <MainButton fullWidth content="Checkout" />
      // Small size with secondary variant
      <MainButton size="small" variant="secondary" content="View Details" />
    </div>
  );
};

export default Buttons;
