import SectionHeader from "../../ui/SectionHeader";
import { Truck } from "lucide-react";

const ShippingOptions = ({ isExpressShipping, setIsExpressShipping }) => {
  return (
    <div className="bg-cream border border-stone p-6">
      <SectionHeader
        title="Shipping Options"
        icon={<Truck className="w-6 h-6 mr-2 text-brass" aria-hidden="true" />}
      />

      <div className="flex items-center p-4 border border-stone hover:border-brass transition cursor-pointer">
        <input
          type="checkbox"
          name="fastOrder"
          id="fastOrder"
          checked={isExpressShipping}
          onChange={(e) => setIsExpressShipping(e.target.checked)}
          className="w-5 h-5 accent-brass"
        />

        <label htmlFor="fastOrder" className="ml-3 cursor-pointer flex-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-charcoal">Express Shipping</p>
              <p className="text-sm text-taupe">
                Delivery in 1-2 business days
              </p>
            </div>
            <span className="font-semibold text-espresso">+ $25.00</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ShippingOptions;
