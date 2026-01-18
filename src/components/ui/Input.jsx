/**
 * Input Component
 * @module components/ui/Input
 *
 * Reusable input component with label, validation, and icons.
 */

/**
 * Input component props
 * @param {Object} props - Component props
 * @param {string} [props.label] - Input label
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text below input
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.required=false] - Required field
 * @param {React.ReactNode} [props.leftIcon] - Icon on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon on the right
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.id] - Input ID (auto-generated if not provided)
 * @returns {JSX.Element} Input component
 */
const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  className = "",
  id,
  name,
  ...props
}) => {
  // Generate ID if not provided
  const inputId =
    id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = `
    w-full px-4 py-3 
    bg-slate-900/80 
    border ${error ? "border-red-500" : "border-slate-700"} 
    rounded-xl
    text-white placeholder-slate-500
    transition-all duration-200
    focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
    disabled:opacity-50 disabled:cursor-not-allowed
    ${leftIcon ? "pl-11" : ""}
    ${rightIcon ? "pr-11" : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-500 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
