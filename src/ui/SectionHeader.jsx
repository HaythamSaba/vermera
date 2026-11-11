// `id`: optional, so a dialog or section can point aria-labelledby at it.
const SectionHeader = ({ title, icon, id }) => {
  return (
    <h2
      id={id}
      className="md:text-2xl text-lg font-serif font-medium text-espresso mb-6 flex items-center"
    >
      {icon}
      {title}
    </h2>
  );
};

export default SectionHeader;
