import Reveal from "./Reveal";

// The <h2> pattern repeated across every /about section (Background, About
// This Project, Get in Touch) — same serif styling every time, only the
// bottom margin varies slightly depending on what follows it. Named
// "AboutSectionHeading" (not reusing SectionHeader.jsx) since that component
// is the checkout-flow's own smaller heading style — different sizing, not a
// fit for this page.
const AboutSectionHeading = ({ delay = 0, className = "mb-6", children }) => (
  <Reveal
    as="h2"
    delay={delay}
    className={`font-serif font-medium text-3xl text-espresso ${className}`}
  >
    {children}
  </Reveal>
);

export default AboutSectionHeading;
