/**
 * Spinner Component
 * @module components/ui/Spinner
 *
 * Loading spinner with size variants.
 */

/**
 * Spinner component props
 * @param {Object} props - Component props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Spinner size
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Spinner component
 */
const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-slate-700 border-t-amber-500
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * Full page loading overlay
 */
export const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
    <Spinner size="lg" />
    <p className="mt-4 text-slate-300">{message}</p>
  </div>
);

/**
 * Inline loading spinner with text
 */
export const LoadingInline = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-8">
    <Spinner size="sm" />
    <span className="text-slate-400">{message}</span>
  </div>
);

export default Spinner;
