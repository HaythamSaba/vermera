import Reveal from "./Reveal";
import { STAGGER_MS } from "../utils/motion";

const EDITORIAL_STAGGER = STAGGER_MS + 20; // 60-80ms band per the plan

// Closing brand statement, no button: the hero already carries "Shop the
// Collection", and repeating it here flattened the page's hierarchy (audit
// V17). Only the eyebrow and heading reveal; the body copy is simply there.
const EditorialBanner = () => (
  <section className="bg-cream border-b border-stone relative z-10">
    <div className="container-foundation section">
      <div className="max-w-2xl mx-auto text-center">
        <Reveal
          as="p"
          delay={0}
          className="font-semibold text-sm uppercase tracking-[3px] text-brass-ink mb-4"
        >
          The Vermera Approach
        </Reveal>
        <Reveal
          as="h2"
          delay={EDITORIAL_STAGGER}
          className="font-serif text-espresso font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
        >
          Fewer pieces, chosen well.
        </Reveal>
        <p className="text-taupe text-lg leading-relaxed">
          Bags, jewellery, watches and beauty, edited to the pieces worth
          reaching for again and again.
        </p>
      </div>
    </div>
  </section>
);

export default EditorialBanner;
