import { useNavigate } from "react-router";
import MainButton from "./MainButton";
import Carousel from "./Carousel";
import Reveal from "./Reveal";
import { STAGGER_MS } from "../utils/motion";

const clothes = [
  {
    image: "./images/lookbook-dresses.png",
    number: "2",
    category: "Dresses",
    title: "Golden Hour",
    categorySlug: "womens-dresses",
  },
  {
    image: "./images/lookbook-jewellery.png",
    number: "3",
    category: "Jewellery",
    title: "Fine Lines",
    categorySlug: "womens-jewellery",
  },
  {
    image: "./images/lookbook-shoes.png",
    number: "4",
    category: "Footwear",
    title: "Every Step",
    categorySlug: "womens-shoes",
  },
  {
    image: "./images/lookbook-bags.png",
    number: "1",
    category: "Handbags",
    title: "The Structured Tote",
    categorySlug: "womens-bags",
  },
];

const InspirationSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-cream border-t border-stone">
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

        <div className="lg:col-span-2 w-full flex justify-center lg:block overflow-hidden">
          <Carousel clothes={clothes}>
            {clothes.map((clothing, idx) => (
              <img
                key={idx}
                src={clothing.image}
                alt={clothing.title}
                className="w-full h-full object-cover"
              />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default InspirationSection;
