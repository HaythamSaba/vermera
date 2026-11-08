import {
  EXPRESS_SURCHARGE,
  formatPrice,
  STANDARD_SHIPPING,
} from "../../utils/pricing";

const optionClass =
  "flex items-start gap-3 p-4 border cursor-pointer transition-colors has-[:checked]:border-espresso";

// Standard / Express as a real radio group (was a lone "Express" checkbox),
// each option showing its own price. Submitted as shipping=standard|express.
const ShippingOptions = ({ method, onMethodChange, isFreeStandardShipping }) => {
  const options = [
    {
      value: "standard",
      title: "Standard delivery",
      detail: "5–7 business days",
      price: isFreeStandardShipping ? "Free" : formatPrice(STANDARD_SHIPPING),
    },
    {
      value: "express",
      title: "Express delivery",
      detail: "1–2 business days",
      price: `+ ${formatPrice(EXPRESS_SURCHARGE)}`,
    },
  ];

  return (
    <fieldset className="bg-cream border border-stone p-6">
      {/* float + full width keeps the legend inside the box (by default it
          sits on the fieldset's top border). */}
      <legend className="float-left w-full text-xs font-medium uppercase tracking-[0.2em] text-taupe mb-5">
        Delivery
      </legend>

      <div className="clear-left space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`${optionClass} ${
              method === option.value ? "border-espresso" : "border-stone hover:border-taupe"
            }`}
          >
            <input
              type="radio"
              name="shipping"
              value={option.value}
              checked={method === option.value}
              onChange={() => onMethodChange(option.value)}
              className="mt-1 w-4 h-4 accent-espresso"
            />
            <span className="flex-1 flex justify-between gap-4">
              <span>
                <span className="block font-medium text-charcoal">
                  {option.title}
                </span>
                <span className="block text-sm text-taupe">{option.detail}</span>
              </span>
              <span className="font-medium text-espresso whitespace-nowrap">
                {option.price}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default ShippingOptions;
