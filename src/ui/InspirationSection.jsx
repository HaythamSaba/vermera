import { useNavigate } from "react-router";
import MainButton from "./MainButton";
import Carousel from "./Carousel";
import Reveal from "./Reveal";
import { STAGGER_MS } from "../utils/motion";

// Caption numbers come from this order (01-04), so reordering here keeps
// them sequential. `alt` describes the photo itself; the caption already
// carries the look's title and category.
const looks = [
  {
    image: "/images/lookbook-dresses.webp",
    alt: "Model in a champagne satin slip dress beside a sunlit linen curtain",
    category: "Dresses",
    title: "Golden Hour",
    categorySlug: "womens-dresses",
  },
  {
    image: "/images/lookbook-jewellery.webp",
    alt: "Stacked gold rings and a fine gold pendant necklace resting on travertine",
    category: "Jewellery",
    title: "Fine Lines",
    categorySlug: "womens-jewellery",
  },
  {
    image: "/images/lookbook-shoes.webp",
    alt: "Taupe leather block-heel pumps on a sunlit stone plinth",
    category: "Footwear",
    title: "Every Step",
    categorySlug: "womens-shoes",
  },
  {
    image: "/images/lookbook-bags.webp",
    alt: "Structured camel tote on a travertine side table beside dried flowers",
    category: "Handbags",
    title: "The Structured Tote",
    categorySlug: "womens-bags",
  },
];

const InspirationSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-cream border-b border-stone">
      <div className="container-foundation section grid lg:grid-cols-3 gap-10 lg:gap-16 items-center">
        <div>
          <Reveal
            as="h2"
            delay={0}
            className="font-serif text-espresso font-semibold text-3xl sm:text-4xl leading-tight mb-4"
          >
            Looks worth revisiting
          </Reveal>
          <Reveal
            as="p"
            delay={STAGGER_MS}
            className="text-taupe text-lg leading-relaxed mb-8"
          >
            Four edits from our latest arrivals, styled to inspire your next
            outfit.
          </Reveal>
          <Reveal delay={STAGGER_MS * 2}>
            <MainButton
              content="Explore More"
              size="medium"
              variant="quiet"
              onClick={() => navigate("/products")}
            />
          </Reveal>
        </div>

        {/* min-w-0 lets the grid cell shrink so the carousel's track
            scrolls inside it instead of widening the page. */}
        <div className="lg:col-span-2 min-w-0">
          <Carousel looks={looks} />
        </div>
      </div>
    </section>
  );
};

export default InspirationSection;
