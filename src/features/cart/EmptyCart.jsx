import { ShoppingBag } from "lucide-react";
import { Link } from "react-router";

// `embedded`: render just the card, without the standalone-page container, for
// reuse inside another page's own layout (e.g. the Profile sidebar).
const EmptyCart = ({ embedded = false }) => {
  // The page's <h1> on /cart; a section heading when embedded in Profile.
  const Heading = embedded ? "h2" : "h1";

  const card = (
    <div className="bg-cream border border-stone p-12 text-center flex flex-col items-center">
      <ShoppingBag
        className="w-16 h-16 mx-auto mb-4 text-stone"
        aria-hidden="true"
      />
      <Heading className="text-2xl font-serif font-medium text-espresso mb-2">
        Your bag is empty.
      </Heading>
      <Link
        to="/products"
        className="mt-4 text-sm font-medium uppercase tracking-[0.15em] text-charcoal underline underline-offset-8 decoration-stone hover:decoration-charcoal transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );

  if (embedded) return card;

  return (
    <div className="container-foundation section max-w-2xl mx-auto">{card}</div>
  );
};

export default EmptyCart;
