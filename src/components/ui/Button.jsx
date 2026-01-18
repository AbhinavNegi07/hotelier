/**
 * Button Component
 * @module components/ui/Button
 *
 * Reusable button component with multiple variants and sizes.
 */

/**
 * @typedef {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} ButtonVariant
 * @typedef {'sm' | 'md' | 'lg'} ButtonSize
 */

/**
 * Button component props
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {ButtonVariant} [props.variant='primary'] - Button style variant
 * @param {ButtonSize} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading state
 * @param {boolean} [props.fullWidth=false] - Full width button
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='button'] - Button type attribute
 * @param {Function} [props.onClick] - Click handler
 * @returns {JSX.Element} Button component
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center font-semibold
    rounded-xl transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900
      hover:from-amber-400 hover:to-amber-500
      focus:ring-amber-500
      shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40
      hover:-translate-y-0.5 active:translate-y-0
    `,
    secondary: `
      bg-slate-800 text-white border border-slate-700
      hover:bg-slate-700 hover:border-slate-600
      focus:ring-slate-500
    `,
    outline: `
      bg-transparent text-amber-500 border-2 border-amber-500
      hover:bg-amber-500/10
      focus:ring-amber-500
    `,
    ghost: `
      bg-transparent text-slate-300
      hover:bg-slate-800 hover:text-white
      focus:ring-slate-500
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-500
      focus:ring-red-500
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-base gap-2",
    lg: "px-7 py-3.5 text-lg gap-2.5",
  };

  const classes = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 h-4 w-4"
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
