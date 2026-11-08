import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { PackageSearch } from "lucide-react";
import MainButton from "../../ui/MainButton";

const TRACK_ORDER_ID = "track-order";

// Order lookup by ID (moved here from the header search, audit decision
// D2). Rendered on the Profile page; the footer's "Track an order" link
// points at /profile#track-order, so when that hash is present this section
// scrolls itself into view and focuses the field.
const OrderLookup = () => {
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();
  const { hash } = useLocation();
  const sectionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (hash !== `#${TRACK_ORDER_ID}`) return;
    sectionRef.current?.scrollIntoView({ block: "center" });
    inputRef.current?.focus({ preventScroll: true });
  }, [hash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generated IDs are uppercase (utils/helpers.js), so accept "dr45x5".
    const id = orderId.trim().toUpperCase();
    if (!id) return;
    navigate(`/order/${encodeURIComponent(id)}`);
  };

  return (
    <section
      ref={sectionRef}
      id={TRACK_ORDER_ID}
      aria-labelledby={`${TRACK_ORDER_ID}-heading`}
      className="bg-cream border border-stone p-6 scroll-mt-28"
    >
      <h2
        id={`${TRACK_ORDER_ID}-heading`}
        className="text-xl font-serif font-medium text-espresso mb-1 flex items-center"
      >
        <PackageSearch className="w-5 h-5 mr-2 text-brass" aria-hidden="true" />
        Track an order
      </h2>
      <p className="text-sm text-taupe mb-4">
        Enter the order ID from your confirmation page.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
        <label htmlFor="orderLookupId" className="sr-only">
          Order ID
        </label>
        <input
          ref={inputRef}
          id="orderLookupId"
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. DR45X5"
          autoComplete="off"
          className="flex-1 border border-stone bg-cream p-3 uppercase placeholder:normal-case"
        />
        <MainButton type="submit" content="Track" size="medium" variant="quiet" />
      </form>
    </section>
  );
};

export default OrderLookup;
