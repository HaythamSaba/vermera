const MainButton = ({
  content,
  size = "large",
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  iconPosition = "left",
  children,
  ...rest
}) => {
  // Size styles
  const sizeStyles = {
    small: "px-6 py-2 text-sm",
    medium: "px-8 py-3 text-base",
    large: "px-12 py-4 text-base",
  };

  // Variant styles
  const variantStyles = {
    primary:
      "bg-primary-500 border border-primary-500 text-white hover:bg-transparent hover:border hover:border-primary-500 hover:text-primary-500",
    secondary:
      "bg-white text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white",
    outline:
      "bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white",
    ghost:
      "bg-transparent text-primary-500 hover:bg-primary-500 hover:bg-opacity-10",
    danger: "bg-white text-red-600 hover:text-white hover:bg-red-700",
    quiet:
      "bg-espresso border border-espresso text-cream hover:bg-transparent hover:text-espresso",
    // Same idea as "quiet", inverted for use on dark surfaces (e.g. the
    // product-card hover overlay) where a solid espresso button would
    // disappear into the background.
    light:
      "bg-cream border border-cream text-espresso hover:bg-transparent hover:text-cream",
  };

  // Base styles
  const baseStyle = `
    flex items-center justify-center gap-2 
    capitalize font-bold
    cursor-pointer
    outline-none 
    transition-all duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-500 disabled:hover:text-white disabled:hover:border-0
    ${sizeStyles[size]} 
    ${variantStyles[variant]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  // Render icon and content based on position
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </>
      );
    }

    if (iconPosition === "left") {
      return (
        <>
          {children}
          {content && <span>{content}</span>}
        </>
      );
    } else {
      return (
        <>
          {content && <span>{content}</span>}
          {children}
        </>
      );
    }
  };

  return (
    <button
      type={type}
      className={baseStyle.trim()}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {renderContent()}
    </button>
  );
};

export default MainButton;
