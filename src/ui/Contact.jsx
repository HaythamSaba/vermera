import { Mail } from "lucide-react";
import CoverBackgroundSection from "./CoverBackgroundSection";
import InputField from "./InputField";
import MainButton from "./MainButton";

const CONTACT_EMAIL = "haythamsaba@gmail.com";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const subject = formData.get("subject") || "Website inquiry";
    const message = formData.get("message");

    const body = `Name: ${fullName}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      <CoverBackgroundSection title="Contact" path={["Home", "Contact"]} />

      <div className="container-foundation section grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div>
          <h3 className="text-3xl font-serif font-medium text-espresso mb-4">
            Get in Touch
          </h3>
          <p className="text-taupe mb-8">
            Questions about an order, a product, or anything else — send us a
            note and we&apos;ll get back to you.
          </p>

          <div className="flex items-start gap-4">
            <Mail className="w-5 h-5 text-brass mt-1" aria-hidden="true" />
            <div>
              <p className="font-medium text-charcoal">Email</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-taupe hover:text-brass transition-colors duration-300"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <InputField
              id="fullName"
              type="text"
              name="fullName"
              placeholder="John Doe"
              isRequired
              hasLabel
              labelText="Full Name"
            />
            <InputField
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              isRequired
              hasLabel
              labelText="Email"
            />
          </div>

          <InputField
            id="subject"
            type="text"
            name="subject"
            placeholder="This field is optional"
            hasLabel
            labelText="Subject"
          />

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-charcoal mb-2"
            >
              Message <span>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Hi, I'd like to ask about..."
              className="w-full border border-stone bg-cream outline-none p-3 transition resize-none"
            />
          </div>

          <MainButton
            type="submit"
            content="Send Message"
            variant="quiet"
            size="large"
          />
        </form>
      </div>
    </div>
  );
};

export default Contact;
