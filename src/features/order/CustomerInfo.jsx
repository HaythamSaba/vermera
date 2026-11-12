import InputField from "../../ui/InputField";

// Uncontrolled fields: the defaults (from the details saved on the Account
// page) are known at mount and never
// change while the form is open, so defaultValue is enough. Validation and
// blur/change handling live on the parent <Form> (events bubble), so this
// only renders `errors`.
const CustomerInfo = ({
  errors = {},
  defaultName = "",
  defaultPhone = "",
  defaultEmail = "",
}) => {
  return (
    <section
      aria-labelledby="contact-heading"
      className="bg-cream border border-stone p-6"
    >
      <h2
        id="contact-heading"
        className="text-xs font-medium uppercase tracking-[0.2em] text-taupe mb-5"
      >
        Contact
      </h2>

      <div className="space-y-4">
        <InputField
          id="fullName"
          type="text"
          name="fullName"
          isRequired
          hideRequiredMark
          defaultValue={defaultName}
          hasLabel
          labelText="Full name"
          autoComplete="name"
          enterKeyHint="next"
          error={errors.fullName}
        />

        <InputField
          id="email"
          type="email"
          name="email"
          isRequired
          hideRequiredMark
          defaultValue={defaultEmail}
          hasLabel
          labelText="Email"
          autoComplete="email"
          inputMode="email"
          enterKeyHint="next"
          error={errors.email}
        />

        <InputField
          id="phoneNumber"
          type="tel"
          name="phoneNumber"
          defaultValue={defaultPhone}
          hasLabel
          labelText="Phone number"
          hint="(optional)"
          autoComplete="tel"
          inputMode="tel"
          enterKeyHint="next"
          error={errors.phoneNumber}
        />
      </div>
    </section>
  );
};

export default CustomerInfo;
