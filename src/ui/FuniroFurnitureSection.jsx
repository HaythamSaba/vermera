const FuniroFurnitureSection = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <p className="font-medium text-xl leading-[1.2] text-taupe">Share your setup with</p>
        <h2 className="font-serif font-medium text-[40px] leading-[1.2] text-charcoal">#FuniroFurniture</h2>
      </div>
      <div className="grid grid-cols-12 grid-rows-8 gap-4 h-screen">
        {/* img:first-child => grid-area: 1 / 1 / 5 / 2 */}
        <div className="col-start-1 col-end-2 row-start-1 row-end-5">
          <img
            src="/images/Rectangle36.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {/* img:nth-child(2) => 5 / 1 / 9 / 3 */}
        <div className="col-start-1 col-end-3 row-start-5 row-end-9">
          <img
            src="/images/Rectangle37.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {/* img:nth-child(3) => 2 / 2 / 5 / 6 */}
        <div className="col-start-2 col-end-6 row-start-2 row-end-5">
          <img
            src="/images/Rectangle38.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {/* img:nth-child(4) => 1 / 11 / 6 / 13 */}
        <div className="col-start-11 col-end-13 row-start-1 row-end-6">
          <img
            src="/images/Rectangle45.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {/* img:nth-child(5) => 3 / 6 / 7 / 8 */}
        <div className="col-start-6 col-end-8 row-start-3 row-end-7">
          <img
            src="/images/Rectangle40.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {/* img:nth-child(6) => 5 / 3 / 8 / 6 */}
        <div className="col-start-3 col-end-6 row-start-5 row-end-8">
          <img
            src="/images/Rectangle39.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {/* img:nth-child(7) => 2 / 8 / 6 / 11 */}
        <div className="col-start-8 col-end-11 row-start-2 row-end-6">
          <img
            src="/images/Rectangle43.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {/* img:nth-child(8) => 6 / 8 / 9 / 10 */}
        <div className="col-start-8 col-end-10 row-start-6 row-end-9">
          <img
            src="/images/Rectangle41.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {/* img:nth-child(9) => 6 / 10 / 8 / 12 */}
        <div className="col-start-10 col-end-12 row-start-6 row-end-8">
          <img
            src="/images/Rectangle44.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default FuniroFurnitureSection;
