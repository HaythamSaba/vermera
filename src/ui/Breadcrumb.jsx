import { Link } from "react-router";

const Breadcrumb = ({ path }) => {
  const segments = path.map((label, i) => {
    const link = i === 0 ? "/" : `/${path[i]}`;

    const isLast = i === path.length - 1;

    return (
      <span key={i} className="text-md font-medium">
        {isLast ? (
          <span aria-current="page">{label}</span>
        ) : (
          <Link to={link} className="hover:underline">
            {label}
          </Link>
        )}
        {!isLast && " > "}
      </span>
    );
  });

  return (
    <nav aria-label="Breadcrumb">
      <div>{segments}</div>
    </nav>
  );
};

export default Breadcrumb;
