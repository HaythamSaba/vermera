// Checkout field rules, shared by the form (validate on blur / on submit,
// with inline errors) and the route action (server-side backstop), so both
// always agree. Each rule returns an error message, or "" when valid.

const PHONE_PATTERN =
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const required = (label) => (value) =>
  value.trim() ? "" : `Please enter your ${label}.`;

// Email is required (it's the order-confirmation channel); phone is
// optional and only checked when given (audit decision F).
const rules = {
  fullName: required("full name"),
  email: (value) => {
    if (!value.trim()) return "Please enter your email address.";
    return EMAIL_PATTERN.test(value.trim())
      ? ""
      : "Enter a valid email address, e.g. name@example.com.";
  },
  phoneNumber: (value) =>
    !value.trim() || PHONE_PATTERN.test(value.trim())
      ? ""
      : "Enter a valid phone number, e.g. +353 1 555 0100.",
  address: required("street address"),
  city: required("city"),
  zipCode: required("postcode"),
  country: required("country"),
};

// Order matters: it's the on-screen order, used to focus the first invalid
// field after a failed submit.
export const CHECKOUT_FIELDS = Object.keys(rules);

export function validateField(name, value) {
  const rule = rules[name];
  return rule ? rule(String(value ?? "")) : "";
}

// values: a plain object (e.g. Object.fromEntries(formData)).
// Returns { fieldName: message } for invalid fields only.
export function validateCheckout(values) {
  return CHECKOUT_FIELDS.reduce((errors, name) => {
    const message = validateField(name, values[name]);
    return message ? { ...errors, [name]: message } : errors;
  }, {});
}
