import { useEffect, useRef } from "react";
import SectionHeader from "../../ui/SectionHeader";
import InputField from "../../ui/InputField";
import { Mail, Phone, User } from "lucide-react";

// Uncontrolled fields: the defaults (from the saved profile, or the name
// entered on the Profile page this session) are known at mount and never
// change while the form is open, so defaultValue is enough.
const CustomerInfo = ({
  formErrors,
  defaultName = "",
  defaultPhone = "",
  defaultEmail = "",
}) => {
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
          defaultValue={defaultName}
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
              defaultValue={defaultPhone}
              placeholder="+1 (555) 123-4567"
              aria-invalid={!!formErrors?.phoneNumber}
              aria-describedby={
                formErrors?.phoneNumber ? "phoneNumber-error" : undefined
              }
              className={`w-full pl-11 border ${
                formErrors?.phoneNumber ? "border-error" : "border-stone"
              } bg-cream p-3`}
            />
          </div>

          {formErrors?.phoneNumber && (
            <p id="phoneNumber-error" role="alert" className="text-error text-sm mt-1">
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
              defaultValue={defaultEmail}
              placeholder="you@example.com"
              className="w-full pl-11 border border-stone bg-cream p-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
