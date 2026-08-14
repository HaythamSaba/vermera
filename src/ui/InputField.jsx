import { forwardRef } from "react";

const InputField = forwardRef(function InputField(
  {
    id,
    type,
    name,
    placeholder,
    isRequired,
    defaultValue,
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
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`${className} w-full border border-stone bg-cream outline-none p-3 transition`}
      />
    </div>
  );
});

export default InputField;
