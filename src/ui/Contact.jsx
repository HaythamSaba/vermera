import { Link } from "react-router";
import { PackageSearch, RotateCcw, Truck } from "lucide-react";
import PageHeader from "./PageHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useMetaDescription from "../hooks/useMetaDescription";
import {
  EXPRESS_SURCHARGE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  formatPrice,
} from "../utils/pricing";

// "Client care" page (audit V12, decision E): delivery and returns
// information only, no contact form and no personal email address. Every
// line is backed by something the store really does: prices come from
// utils/pricing.js, the delivery windows match ShippingOptions, order speed
// can be changed on the order page, and orders can be looked up on /profile.
// There is no returns flow, so the page says so plainly instead of
// inventing a policy.
const DELIVERY_OPTIONS = [
  {
    name: "Standard delivery",
    timing: "5–7 business days",
    price: `${formatPrice(STANDARD_SHIPPING, { wholeUnits: true })}, complimentary on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD, { wholeUnits: true })}`,
  },
  {
    name: "Express delivery",
    timing: "1–2 business days",
    price: `+${formatPrice(EXPRESS_SURCHARGE, { wholeUnits: true })} on top of standard delivery`,
  },
];

const linkClass =
  "text-charcoal underline underline-offset-4 decoration-stone hover:decoration-charcoal transition-colors";

const CareSection = ({ id, icon, title, children }) => {
  const Icon = icon;
  return (
    <section
      aria-labelledby={id}
      className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-4 md:gap-10 py-10 border-t border-stone"
    >
      <div className="flex items-center gap-3 md:items-start">
        <Icon
          className="w-5 h-5 text-brass shrink-0 md:mt-1.5"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h2 id={id} className="font-serif font-medium text-2xl text-espresso">
          {title}
        </h2>
      </div>
      <div className="text-taupe leading-relaxed space-y-4 max-w-2xl">
        {children}
      </div>
    </section>
  );
};

const Contact = () => {
  useDocumentTitle("Client care");
  useMetaDescription(
    "Delivery options and prices, changing or tracking a Vermera order, and returns.",
  );

  return (
    <div>
      <PageHeader eyebrow="Help" title="Client care" />

      {/* Bottom padding only: the intro sits right under the page title. */}
      <div className="container-foundation pt-4 pb-16 sm:pb-24">
        <p className="text-taupe text-lg leading-relaxed max-w-2xl mb-10">
          How delivery works, how to change or follow an order, and what happens
          with returns.
        </p>

        <CareSection id="care-delivery" icon={Truck} title="Delivery">
          <dl className="divide-y divide-stone border-b border-stone [&>div:first-child]:pt-0">
            {DELIVERY_OPTIONS.map((option) => (
              <div
                key={option.name}
                className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6 py-4"
              >
                <dt className="font-medium text-charcoal">{option.name}</dt>
                <dd>
                  <span className="block text-charcoal">{option.timing}</span>
                  <span className="block text-sm">{option.price}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p>You choose the speed at checkout.</p>
        </CareSection>

        <CareSection id="care-orders" icon={PackageSearch} title="Your order">
          <p>
            Every order gets its own reference. You can switch between standard
            and express delivery from the order page, and look any order up by
            its reference under{" "}
            <Link to="/profile#track-order" className={linkClass}>
              Track an order
            </Link>
            .
          </p>
        </CareSection>

        <CareSection id="care-returns" icon={RotateCcw} title="Returns">
          <p>
            Orders here are demo records saved in your browser. Nothing is
            charged or shipped, so there is nothing to send back.
          </p>
        </CareSection>

        <p className="pt-10 border-t border-stone text-sm text-taupe">
          Vermera is a portfolio project by{" "}
          <Link to="/about" className={linkClass}>
            Haytham Saba
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Contact;
