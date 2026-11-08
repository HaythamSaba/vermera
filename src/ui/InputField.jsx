import { forwardRef } from "react";

// Shared labelled input. Optional extras (all backwards-compatible):
// - error: message rendered below the field, wired up via aria-invalid and
//   aria-describedby, with an error-coloured border.
// - hint: secondary label text, e.g. "(optional)".
// - hideRequiredMark: drop the "*" when the form instead states up front
//   that every field is required unless marked optional (checkout).
// - autoComplete / inputMode / enterKeyHint / onBlur: passed through.
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
    onBlur,
    hasLabel,
    onKeyDown,
    labelText,
    className,
    error,
    hint,
    hideRequiredMark = false,
    autoComplete,
    inputMode,
    enterKeyHint,
  },
  ref
) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      {hasLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-charcoal mb-2"
        >
          {labelText}
          {isRequired && !hideRequiredMark && <span> *</span>}
          {hint && <span className="font-normal text-taupe"> {hint}</span>}
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
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`${className ?? ""} w-full border ${
          error ? "border-error" : "border-stone"
        } bg-cream p-3 transition`}
      />
      {error && (
        <p id={errorId} className="text-error text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

export default InputField;
