import Breadcrumb from "./Breadcrumb";

const CoverBackgroundSection = ({ title, path }) => {
  return (
    <div className="relative">
      <div className="h-[316px] w-full relative bg-[url('/images/products-background.jpg')] bg-cover bg-center bg-no-repeat  before:content-['']  before:absolute before:inset-0 before:backdrop-blur-md">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center gap-2">
          <img src="/images/main-logo.png" alt="" aria-hidden="true" />
          <h1 className="font-serif text-espresso text-5xl font-medium my-2">
            {title}
          </h1>
          <Breadcrumb path={path} />
        </div>
      </div>
    </div>
  );
};

export default CoverBackgroundSection;
