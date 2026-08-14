import { useEffect, useRef } from "react";
import SectionHeader from "../../ui/SectionHeader";
import InputField from "../../ui/InputField";
import { Mail, Phone, User } from "lucide-react";

const CustomerInfo = ({ formErrors, username }) => {
  const phoneInputRef = useRef(null);

  // Move focus (and the viewport) to the phone field when server-side
  // validation rejects it — otherwise the error renders silently off-screen.
  useEffect(() => {
    if (formErrors?.phoneNumber) {
      phoneInputRef.current?.focus();
      phoneInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [formErrors]);

  return (
    <div className="bg-cream border border-stone p-6">
      <SectionHeader
        title="Customer Information"
        icon={<User className="w-6 h-6 mr-2 text-brass" aria-hidden="true" />}
      />

      <div className="space-y-4">
        <InputField
          id="fullName"
          type="text"
          name="fullName"
          placeholder="John Doe"
          isRequired
          defaultValue={username}
          hasLabel
          labelText="Full Name"
        />

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-charcoal mb-2"
          >
            Phone Number *
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-3.5 w-5 h-5 text-taupe"
              aria-hidden="true"
            />
            <input
              ref={phoneInputRef}
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              required
              placeholder="+1 (555) 123-4567"
              aria-invalid={!!formErrors?.phoneNumber}
              aria-describedby={
                formErrors?.phoneNumber ? "phoneNumber-error" : undefined
              }
              className={`w-full pl-11 border ${
                formErrors?.phoneNumber ? "border-red-500" : "border-stone"
              } bg-cream outline-none p-3`}
            />
          </div>

          {formErrors?.phoneNumber && (
            <p id="phoneNumber-error" role="alert" className="text-red-500 text-sm mt-1">
              {formErrors.phoneNumber}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-charcoal mb-2"
          >
            Email (optional)
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-3.5 w-5 h-5 text-taupe"
              aria-hidden="true"
            />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full pl-11 border border-stone bg-cream outline-none p-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
