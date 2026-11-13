import Reveal from "./Reveal";
import { STAGGER_MS } from "../utils/motion";

const EDITORIAL_STAGGER = STAGGER_MS + 20; // 60-80ms band per the plan

// Closing brand statement, no button: the hero already carries "Shop the
// Collection", and repeating it here flattened the page's hierarchy (audit
// V17). Only the eyebrow and heading reveal; the body copy is simply there.
//
// Sits on the babyblue tint: a single cool band that closes the page
// before the footer. All text on it is dark (see the babyblue tokens in
// index.css): babyblue-ink eyebrow, espresso heading, charcoal body.
const EditorialBanner = () => (
  <section className="bg-babyblue relative z-10">
    <div className="container-foundation section">
      <div className="max-w-2xl mx-auto text-center">
        <Reveal
          as="p"
          delay={0}
          className="font-semibold text-sm uppercase tracking-[3px] text-babyblue-ink mb-4"
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
        <p className="text-charcoal/85 text-lg leading-relaxed">
          Bags, jewellery, watches and beauty, edited to the pieces worth
          reaching for again and again.
        </p>
      </div>
    </div>
  </section>
);

export default EditorialBanner;
