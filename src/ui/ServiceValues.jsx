import { Search, ShoppingBag, Sparkles, Truck } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";
import { STAGGER_MS } from "../utils/motion";

// Only claims backed by real, working functionality — no free shipping,
// no 24/7 support, no returns policy, no payment-method promises, since
// none of those are actually implemented in this project.
const SERVICE_VALUES = [
  {
    icon: Sparkles,
    title: "Thoughtful Design",
    description:
      "Each piece selected for its form, materials, and everyday usefulness.",
  },
  {
    icon: Truck,
    title: "Considered Delivery",
    description: "Choose standard or express shipping at checkout.",
  },
  {
    icon: ShoppingBag,
    title: "Straightforward Checkout",
    description: "A simple, guided checkout from cart to confirmation.",
  },
  {
    icon: Search,
    title: "Order Lookup",
    description: "Search any order by ID, anytime.",
  },
];

const ServiceValues = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="container-foundation section">
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {SERVICE_VALUES.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="relative text-center sm:text-left bg-cream p-8 border border-stone hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                // Leave transform unset once visible so the existing
                // hover:-translate-y-1.5 utility still controls it normally.
                transform: isVisible ? undefined : "translateY(12px)",
                transitionDelay: `${index * STAGGER_MS}ms`,
              }}
            >
              <Icon
                className="mx-auto sm:mx-0 mb-4 text-brass"
                size={28}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="font-medium text-lg text-charcoal mb-2">
                {item.title}
              </h3>
              <p className="text-taupe text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceValues;
