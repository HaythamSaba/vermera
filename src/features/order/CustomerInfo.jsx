import SectionHeader from "../../ui/SectionHeader";
import InputField from "../../ui/InputField";
import { Phone, User } from "lucide-react";

const CustomerInfo = ({ formErrors, username }) => {
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
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              required
              placeholder="+1 (555) 123-4567"
              className={`w-full pl-11 border ${
                formErrors?.phoneNumber ? "border-red-500" : "border-stone"
              } bg-cream outline-none p-3`}
            />
          </div>

          {formErrors?.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.phoneNumber}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
