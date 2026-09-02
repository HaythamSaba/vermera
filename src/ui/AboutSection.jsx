// Shared section shell for the /about page: the container-foundation +
// section rhythm, with an optional "tinted" treatment (bg-cream + top/bottom
// border) — the exact outer wrapper repeated across Background, About This
// Project, and Get in Touch. What goes inside still owns its own width (most
// sections cap their content at max-w-2xl; Contact's card grid deliberately
// doesn't), so this only extracts the part that was identical everywhere.
const AboutSection = ({ tinted = false, children }) => {
  const content = (
    <div className="container-foundation section">{children}</div>
  );

  return tinted ? (
    <section className="bg-cream border-y border-stone">{content}</section>
  ) : (
    <section>{content}</section>
  );
};

export default AboutSection;
