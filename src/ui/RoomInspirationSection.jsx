  import { ChevronLeft, ChevronRight } from "lucide-react";
  import { useState } from "react";
  import MainButton from "./MainButton";

  const Carousel = ({ children, rooms }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
      const isLastSlide = currentIndex === children.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    };

    const handlePrevious = () => {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? children.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    };

    // Create extended array to show images in a loop
    const extendedChildren = [...children, ...children, ...children];
    const offset = children.length;

    return (
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 gap-12 items-start"
            style={{
              transform: `translateX(-${(currentIndex + offset) * 420}px)`,
            }}
          >
            {extendedChildren.map((child, index) => {
              const actualIndex = index % children.length;
              const isActive = index === currentIndex + offset;

              return (
                <div
                  key={index}
                  className={`shrink-0 transition-all duration-500 relative ${
                    isActive ? "w-[404px] h-[582px]" : "w-[372px] h-[486px]"
                  }`}
                >
                  {child}
                  {/* Overlay Card - Only show on active slide */}
                  {isActive && rooms && (
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 ">
                      <div className="flex items-center gap-3 mb-2 text-gray-600 text-sm">
                        <span className="font-medium text-base">
                          {"0"}
                          {rooms[actualIndex].number}
                        </span>
                        <span>—</span>
                        <span className="font-medium text-base">
                          {rooms[actualIndex].category}
                        </span>
                      </div>
                      <h3 className="text-3xl font-semibold text-gray-800">
                        {rooms[actualIndex].title}
                      </h3>
                      <button className="absolute bottom-0 -right-12 bg-[#B88E2F] hover:bg-[#B88E2F]/80 text-white p-3 transition-colors inline-flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6 text-[#B88E2F]" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6 text-[#B88E2F]" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute left-[440px] bottom-0 w-fit">
          <div className="flex gap-3">
            {children.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`cursor-pointer p-3 rounded-full ${
                  currentIndex === index ? "border border-[#B88E2F]" : ""
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === index ? "bg-[#B88E2F]" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Demo component matching your design
  const RoomInspirationSection = () => {
    const rooms = [
      {
        image: "./images/slider1.png",
        number: "1",
        category: "Bed Room",
        title: "Inner Peace",
      },
      {
        image: "./images/slider2.png",
        number: "2",
        category: "Living Room",
        title: "Cozy Comfort",
      },
      {
        image: "./images/slider3.png",
        number: "3",
        category: "Kitchen",
        title: "Modern Space",
      },
      {
        image: "./images/slider4.png",
        number: "4",
        category: "Dining Room",
        title: "Elegant Dining",
      },
    ];

    return (
      <div className="bg-[#FCF8F3]">
        <div className="flex justify-center items-center min-h-[95vh] px-8 lg:px-20 lg:pr-0 py-10 lg:grid lg:grid-cols-3 gap-10">
          <div className="grid lg:grid-cols-1 gap-12 items-center mb-8">
            <div>
              <h2 className="font-bold text-[40px] leading-[1.2] mb-4 text-gray-800">
                50+ Beautiful rooms
                <br />
                inspiration
              </h2>
              <p className="mb-8 font-medium text-lg text-gray-600 leading-normal">
                Our designer already made a lot of beautiful
                <br />
                prototype of rooms that inspire you
              </p>
              <MainButton content={"Explore More"} size="medium" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <Carousel rooms={rooms}>
              {rooms.map((room, idx) => (
                <img
                  key={idx}
                  src={room.image}
                  alt={room.title}
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
