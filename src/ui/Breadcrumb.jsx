import { Link } from "react-router";

const Breadcrumb = ({ path }) => {
  const segments = path.map((label, i) => {
    const link = i === 0 ? "/" : `/${path[i]}`;

    const isLast = i === path.length - 1;

    return (
      <span key={i} className="text-md font-medium">
        {isLast ? (
          label
        ) : (
          <Link to={link} className="hover:underline">
            {label}
          </Link>
        )}
        {!isLast && " > "}
      </span>
    );
  });

  return <div>{segments}</div>;
};

export default Breadcrumb;
