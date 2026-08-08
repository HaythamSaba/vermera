import SectionHeader from "../../ui/SectionHeader";
import { Truck } from "lucide-react";

const ShippingOptions = ({ isExpressShipping, setIsExpressShipping }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <SectionHeader
        title="Shipping Options"
        icon={<Truck className="w-6 h-6 mr-2 text-primary-500" />}
      />

      <div className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 transition cursor-pointer">
        <input
          type="checkbox"
          name="fastOrder"
          id="fastOrder"
          checked={isExpressShipping}
          onChange={(e) => setIsExpressShipping(e.target.checked)}
          className="w-5 h-5 text-primary-500"
        />

        <label htmlFor="fastOrder" className="ml-3 cursor-pointer flex-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900">Express Shipping</p>
              <p className="text-sm text-gray-600">
                Delivery in 1-2 business days
              </p>
            </div>
            <span className="font-semibold text-primary-500">+ $25.00</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ShippingOptions;
