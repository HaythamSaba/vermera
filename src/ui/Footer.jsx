const Footer = () => {
  const navItems = ["Home", "Shop", "About", "Contact"];
  return (
    <div className="pt-20 bg-cream text-charcoal">
      <hr className="border-t border-stone" />
      <footer className="container-foundation grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-8 lg:py-20">
        <div className="flex flex-col lg:items-center">
          <div className="flex flex-col gap-6 lg:gap-12">
            <p className="text-2xl font-serif font-medium">Vermera.</p>
            <p className="text-taupe">
              400 University Drive Suite 200 Coral Gables, <br />
              FL 33134 USA
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:items-center">
          <div className="flex flex-col gap-6 lg:gap-12">
            <p className="text-taupe">Links</p>
            <ul className="flex flex-col gap-3 lg:gap-10 font-medium">
              {navItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:items-center">
          <div className="flex flex-col gap-6 lg:gap-12">
            <p className="text-taupe">Help</p>
            <ul className="flex flex-col gap-3 lg:gap-10 font-medium">
              <li>Payment Options</li>
              <li>Returns</li>
              <li>Privacy Policies</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:items-center">
          <div className="flex flex-col gap-6 lg:gap-12">
            <p className="text-taupe">Newsletter</p>
            <form className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  className="peer w-full border-b border-stone py-2"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-2 text-taupe transition-all
                  duration-300 peer-focus:-top-1.5 peer-focus:text-xs peer-focus:text-charcoal
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base"
                >
                  Enter your email
                </label>
              </div>

              <button
                type="submit"
                className="border-b border-stone hover:text-brass transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
