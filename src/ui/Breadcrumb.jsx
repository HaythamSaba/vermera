import { Link } from "react-router";

const Breadcrumb = ({ path }) => {
  // Only the first crumb ("Home") maps to a known route — the rest are
  // display labels, not slugs, so they render as plain text rather than
  // guessing (and likely breaking) a URL from the label.
  const segments = path.map((label, i) => {
    const isFirst = i === 0;
    const isLast = i === path.length - 1;

    return (
      <span key={i} className="text-md font-medium">
        {isFirst ? (
          <Link to="/" className="hover:underline">
            {label}
          </Link>
        ) : (
          label
        )}
        {!isLast && " > "}
      </span>
    );
  });

  return <div>{segments}</div>;
};

export default Breadcrumb;
