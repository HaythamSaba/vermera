import { useNavigate } from "react-router";
import MainButton from "./MainButton";
import Reveal from "./Reveal";
import { STAGGER_MS } from "../utils/motion";

const EDITORIAL_STAGGER = STAGGER_MS + 20; // 60-80ms band per the plan

const EditorialBanner = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-cream border-y border-stone">
      <div className="container-foundation section">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal
            as="p"
            delay={0}
            className="font-semibold text-sm uppercase tracking-[3px] text-brass mb-4"
          >
            The Vermera Approach
          </Reveal>
          <Reveal
            as="h2"
            delay={EDITORIAL_STAGGER}
            className="font-serif text-espresso font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
          >
            Objects made to belong.
          </Reveal>
          <Reveal
            as="p"
            delay={EDITORIAL_STAGGER * 2}
            className="text-taupe text-lg leading-relaxed"
          >
            Discover considered forms, warm materials, and details designed for
            everyday living.
          </Reveal>
          <Reveal
            delay={EDITORIAL_STAGGER * 3}
            className="mt-8 flex justify-center"
          >
            <MainButton
              content="Explore Our Products"
              size="medium"
              variant="primary"
              onClick={() => navigate("/products")}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default EditorialBanner;
