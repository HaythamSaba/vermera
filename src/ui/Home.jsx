import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageOff } from "lucide-react";
import MainButton from "./MainButton";

const Home = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section className="container-foundation">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 lg:py-16">
        {/* Text */}
        <div className="order-2 lg:order-1 max-w-xl">
          <p className="font-semibold text-sm uppercase tracking-[3px] text-brass mb-4">
            The Vermera Edit
          </p>
          <h1 className="font-serif text-espresso font-semibold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Timeless Pieces, Thoughtfully Chosen
          </h1>
          <p className="text-taupe text-lg leading-relaxed mb-10 max-w-md">
            A curated edit of bags, jewelry, watches, and beauty essentials —
            each piece selected for its quality and quiet character.
          </p>
          <MainButton
            content="Shop the Collection"
            variant="quiet"
            onClick={() => navigate("/products")}
          />
        </div>

        {/* Image */}
        <div className="order-1 lg:order-2 relative w-full lg:aspect-square overflow-hidden bg-stone/30">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-stone border-t-brass rounded-full animate-spin" />
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-stone/20 text-taupe">
              <div className="text-center px-6">
                <ImageOff size={40} className="mx-auto mb-2 opacity-60" aria-hidden="true" />
                <p className="text-sm">Image unavailable</p>
              </div>
            </div>
          ) : (
            <img
              src="/images/hero-bg.png"
              alt="A softly styled living space with a woven chair and linen textiles, reflecting Vermera's quiet, considered aesthetic."
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-center lg:object-bottom transition-all duration-700 ease-out hover:scale-[1.05] ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
