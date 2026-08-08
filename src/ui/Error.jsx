import { useNavigate, useRouteError } from "react-router";
import MainButton from "./MainButton";

const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  return (
    <div className="text-center h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p>{error.data || error.message}</p>
      <MainButton
      content={"Go to Home"}
        size="medium"
        onClick={() => navigate("/")}
      />
      
    </div>
  );
};

export default Error;
