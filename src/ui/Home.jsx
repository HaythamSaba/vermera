import { useNavigate } from "react-router";
import MainButton from "./MainButton";
const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => () => navigate("/products");
  return (
    <div className="bg-[url('/images/hero-bg.png')] bg-cover bg-bottom bg-no-repeat w-full flex justify-end items-center lg:py-[250px] h-[87vh] px-8 lg:px-20">
      <div className="bg-primary-100 p-10 max-w-[643px] max-h-[443px]">
        <p className="font-semibold text-sm lg:text-base letter tracking-[3px] pb-2 pt-6">
          New Arrival
        </p>
        <h1 className="text-primary-500 mb-4 font-bold text-3xl lg:text-6xl pb-4">
          Discover Our <br /> New Collection
        </h1>
        <p className="mb-8 lg:mb-12 font-medium text-lg text-[#333333] lg:text-lg ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis.
        </p>
        <MainButton content={"Buy Now"} onClick={handleNavigate()} />
      </div>
    </div>
  );
};

export default Home;
