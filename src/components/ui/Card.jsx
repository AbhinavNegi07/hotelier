/**
 * Card Component
 * @module components/ui/Card
 *
 * Reusable card container with glassmorphism effect.
 */

/**
 * Card component props
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.hoverable=false] - Enable hover effects
 * @param {boolean} [props.padding=true] - Include default padding
 * @param {Function} [props.onClick] - Click handler
 * @returns {JSX.Element} Card component
 */
const Card = ({
  children,
  className = "",
  hoverable = false,
  padding = true,
  onClick,
  ...props
}) => {
  const baseClasses = `
    bg-slate-800/60 
    backdrop-blur-xl 
    border border-slate-700/50
    rounded-2xl
    overflow-hidden
    transition-all duration-300 ease-out
  `;

  const hoverClasses = hoverable
    ? "hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 cursor-pointer"
    : "";

  const paddingClasses = padding ? "p-6" : "";

  const classes = `
    ${baseClasses}
    ${hoverClasses}
    ${paddingClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Header subcomponent
 */
export const CardHeader = ({ children, className = "" }) => (
  <div className={`pb-4 border-b border-slate-700/50 ${className}`}>
    {children}
  </div>
);

/**
 * Card Body subcomponent
 */
export const CardBody = ({ children, className = "" }) => (
  <div className={`py-4 ${className}`}>{children}</div>
);

/**
 * Card Footer subcomponent
 */
export const CardFooter = ({ children, className = "" }) => (
  <div className={`pt-4 border-t border-slate-700/50 ${className}`}>
    {children}
  </div>
);

export default Card;
