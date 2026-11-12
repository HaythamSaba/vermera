// Slim editorial page header in the normal page flow: an optional eyebrow
// over the page's one <h1>. Replaces the template's 316px blurred cover
// banner (audit V2), so content starts near the top on phones.
const PageHeader = ({ eyebrow, title }) => (
  <header className="container-foundation pt-10 pb-2">
    {eyebrow && (
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-taupe">
        {eyebrow}
      </p>
    )}
    <h1 className="font-serif font-medium text-espresso text-4xl sm:text-5xl mt-2">
      {title}
    </h1>
  </header>
);

export default PageHeader;
