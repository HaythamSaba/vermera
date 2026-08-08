const InputField = ({
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
  className
}) => {
  return (
    <>
      {hasLabel && (
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {labelText} {isRequired && <span>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        required={isRequired}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`${className} w-full border-2 border-gray-300 focus:border-primary-500 outline-none rounded-lg p-3 transition`}
      />
    </>
  )
};

export default InputField;
