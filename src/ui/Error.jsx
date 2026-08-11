import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import { AlertCircle } from "lucide-react";
import MainButton from "./MainButton";

const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  const isResponse = isRouteErrorResponse(error);
  const status = isResponse ? error.status : null;

  const heading = isResponse
    ? status === 404
      ? "Not Found"
      : `Error ${status}`
    : "Something Went Wrong";

  const message = isResponse
    ? error.data ||
      error.statusText ||
      "The page you're looking for doesn't exist."
    : error?.message || "An unexpected error occurred.";

  return (
    <div className="min-h-[70vh] bg-ivory flex items-center justify-center px-4">
      <div className="bg-cream border border-stone p-8 w-full max-w-md text-center">
        <AlertCircle
          className="w-12 h-12 text-brass mx-auto mb-4"
          aria-hidden="true"
        />
        <h1 className="text-3xl font-serif font-semibold text-espresso mb-3">
          {heading}
        </h1>
        <p className="text-taupe mb-6">{message}</p>
        <div className="text-center space-y-4 w-fit max-w-xs m-auto">
          <MainButton
            content="Go to Home"
            variant="quiet"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </div>
  );
};

export default Error;
