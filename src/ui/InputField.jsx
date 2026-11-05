import { forwardRef } from "react";

const InputField = forwardRef(function InputField(
  {
    id,
    type,
    name,
    placeholder,
    isRequired,
    defaultValue,
    value,
    onChange,
    hasLabel,
    onKeyDown,
    labelText,
    className,
  },
  ref
) {
  return (
    <div>
      {hasLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-charcoal mb-2"
        >
          {labelText} {isRequired && <span>*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        name={name}
        required={isRequired}
        placeholder={placeholder}
        // Controlled when the caller passes `value` (with onChange),
        // uncontrolled otherwise. Never both: React warns on that.
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`${className} w-full border border-stone bg-cream p-3 transition`}
      />
    </div>
  );
});

export default InputField;
