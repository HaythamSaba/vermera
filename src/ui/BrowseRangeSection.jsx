function BrowseRangeSection() {
  const rooms = [
    {
      image: "./images/image-diningroom.png",
      number: "1",
      title: "Dining",
    },
    {
      image: "./images/image-livingroom.png",
      number: "1",
      title: "Living",
    },
    {
      image: "./images/image-bedroom.png",
      number: "1",
      title: "Bedroom",
    },
  ];

  return (
    <section className="container-foundation section flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="font-serif font-medium text-[32px] text-charcoal">
          Browse The Range
        </h2>
        <p className="text-xl text-taupe">
          Browse our range of furniture and find the perfect piece for your home
        </p>
      </div>

      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {rooms.map((room) => (
            <div key={room.title} className="w-full max-w-[381px] h-[480px]">
              <div className="w-full h-[420px] sm:h-[450px] lg:h-[480px] overflow-hidden rounded-sm border border-stone mb-4 group">
                <img
                  src={room.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={room.title}
                />
              </div>

              <p className="font-medium text-center text-2xl text-charcoal mt-2">
                {room.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrowseRangeSection;
