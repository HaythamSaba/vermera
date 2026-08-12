import MainButton from "./MainButton";
import Carousel from "./Carousel";


const RoomInspirationSection = () => {
  const clothes = [
    
    {
      image: "./images/lookbook-dresses.png",
      number: "2",
      category: "Dresses",
      title: "Golden Hour",
    },
    {
      image: "./images/lookbook-jewellery.png",
      number: "3",
      category: "Jewellery",
      title: "Fine Lines",
    },
    {
      image: "./images/lookbook-shoes.png",
      number: "4",
      category: "Footwear",
      title: "Every Step",
    },
    {
      image: "./images/lookbook-bags.png",
      number: "1",
      category: "Handbags",
      title: "The Structured Tote",
    },
  ];

  return (
    <div className="bg-[#FCF8F3]">
      <div className="flex flex-col justify-center items-center px-8 lg:px-20 lg:pr-0 py-10 lg:min-h-[95vh] lg:flex-row lg:grid lg:grid-cols-3 gap-10">
        <div className="grid lg:grid-cols-1 gap-12 items-center mb-8">
          <div>
            <h2 className="font-bold text-[40px] leading-[1.2] mb-4 text-gray-800">
              Looks worth
              <br />
              revisiting
            </h2>
            <p className="mb-8 font-medium text-lg text-gray-600 leading-normal">
              Four edits from our latest arrivals, styled to
              <br />
              inspire your next outfit
            </p>
            <MainButton content={"Explore More"} size="medium" />
          </div>
        </div>

        <div className="lg:col-span-2 w-full flex justify-center lg:block overflow-hidden">
          <Carousel clothes={clothes}>
            {clothes.map((clothing, idx) => (
              <img
                key={idx}
                src={clothing.image}
                alt={clothing.title}
                className="w-full h-full object-cover"
              />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default RoomInspirationSection;
