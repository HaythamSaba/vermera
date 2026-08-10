// A calm, text-only brand-story moment. The CTA is intentionally omitted:
// there is no About/brand-story route to link "Read our story" to yet, and
// a button that goes nowhere would be a dishonest affordance. Re-add it as
// a real Link once that page exists.
const EditorialBanner = () => {
  return (
    <section className="bg-cream border-y border-stone">
      <div className="container-foundation section">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-semibold text-sm uppercase tracking-[3px] text-brass mb-4">
            The Vermera Approach
          </p>
          <h2 className="font-serif text-espresso font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
            Objects made to belong.
          </h2>
          <p className="text-taupe text-lg leading-relaxed">
            Discover considered forms, warm materials, and details designed
            for everyday living.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EditorialBanner;
