import { useNavigate } from "react-router";
import MainButton from "./MainButton";
import Carousel from "./Carousel";

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
          <h2 className="font-serif text-espresso font-semibold text-3xl sm:text-4xl leading-tight mb-4">
            Looks worth revisiting
          </h2>
          <p className="text-taupe text-lg leading-relaxed mb-8">
            Four edits from our latest arrivals, styled to inspire your next
            outfit.
          </p>
          <MainButton
            content="Explore More"
            size="medium"
            variant="quiet"
            onClick={() => navigate("/products")}
          />
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
