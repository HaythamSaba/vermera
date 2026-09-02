// One GitHub/LinkedIn/Website contact card — the bordered icon+label+value
// row rendered for each entry in About.jsx's CONTACT_LINKS. The email row
// stays inline in About.jsx since it has its own interactive copy-button
// behavior rather than just being a link.
const ContactChannelCard = ({ icon, label, value, href, ariaLabel }) => {
  // Matches the same pattern used for the MotionDiv alias in About.jsx —
  // assigning the prop to a locally-declared, capitalized const before using
  // it as a JSX tag is what this project's ESLint setup recognizes as
  // "used"; a destructure-rename (`icon: Icon`) in the parameter list isn't.
  const Icon = icon;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className="contact-channel flex items-center gap-4 p-5 border border-stone bg-cream hover:border-brass transition-colors duration-300"
    >
      <Icon className="w-5 h-5 text-brass shrink-0" aria-hidden="true" />
      <div>
        <p className="font-medium text-charcoal">{label}</p>
        <p className="text-taupe text-sm">{value}</p>
      </div>
    </a>
  );
};

export default ContactChannelCard;
