const SectionHeader = ({ title, icon }) => {
  return (
    <h2 className="md:text-2xl text-lg font-semibold text-gray-900 mb-6 flex items-center">
      {icon}
      {title}
    </h2>
  );
};

export default SectionHeader;
