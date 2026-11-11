import { PackageSearch, Sparkles, Truck } from "lucide-react";
import { motion } from "framer-motion";
import RevealGroup from "./RevealGroup";
import { CARD_REVEAL_VARIANTS } from "../utils/motion";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "../utils/pricing";

const MotionDiv = motion.div;

// Brand notes, each backed by something the store really does: the curated
// nine-collection catalog, the standard/express shipping with free delivery
// over the threshold (utils/pricing.js), and order lookup by reference on
// /profile. No returns policy, support hours or payment promises — none of
// those exist. The cards are static, so they get no hover affordance.
const SERVICE_NOTES = [
  {
    icon: Sparkles,
    title: "Selected with intent",
    description:
      "A focused edit across nine collections, each piece chosen for its form and materials.",
  },
  {
    icon: Truck,
    title: "Delivered with care",
    description: `Standard or express shipping, complimentary on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD, { wholeUnits: true })}.`,
  },
  {
    icon: PackageSearch,
    title: "Always within reach",
    description:
      "Every order has its own reference, so you can look it up at any time.",
  },
];

const ServiceValues = () => (
  <section
    aria-labelledby="service-notes-heading"
    className="bg-cream border-b border-stone"
  >
    <div className="container-foundation section">
      {/* Screen-reader heading so the three note <h3>s sit under a section
          <h2> instead of following the lookbook's slide headings in the
          outline. Visually the cards speak for themselves. */}
      <h2 id="service-notes-heading" className="sr-only">
        Why Vermera
      </h2>
      <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {SERVICE_NOTES.map((item) => {
          const Icon = item.icon;
          return (
            <MotionDiv
              key={item.title}
              variants={CARD_REVEAL_VARIANTS}
              className="text-center md:text-left bg-ivory p-8 border border-stone"
            >
              <Icon
                className="mx-auto md:mx-0 mb-4 text-brass"
                size={28}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="font-serif font-medium text-xl text-charcoal mb-2">
                {item.title}
              </h3>
              <p className="text-taupe text-sm leading-relaxed">
                {item.description}
              </p>
            </MotionDiv>
          );
        })}
      </RevealGroup>
    </div>
  </section>
);

export default ServiceValues;
