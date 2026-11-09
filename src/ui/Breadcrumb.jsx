import { Link } from "react-router";

// path: labels, or { label, to } objects when the link isn't simply
// `/${label}` (e.g. the PDP's category step → /products?category=…).
// The last item is the current page and isn't linked.
const Breadcrumb = ({ path, className = "" }) => {
  const segments = path.map((item, i) => {
    const { label, to } =
      typeof item === "string"
        ? { label: item, to: i === 0 ? "/" : `/${item}` }
        : item;

    const isLast = i === path.length - 1;

    return (
      <span key={i} className="text-md font-medium">
        {isLast ? (
          <span aria-current="page">{label}</span>
        ) : (
          <Link to={to} className="hover:underline">
            {label}
          </Link>
        )}
        {!isLast && " > "}
      </span>
    );
  });

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <div>{segments}</div>
    </nav>
  );
};

export default Breadcrumb;
