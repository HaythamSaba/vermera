const SectionHeader = ({ title, icon }) => {
  return (
    <h2 className="md:text-2xl text-lg font-serif font-medium text-espresso mb-6 flex items-center">
      {icon}
      {title}
    </h2>
  );
};

export default SectionHeader;
