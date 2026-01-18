import { useState, useEffect, useCallback } from "react";

/**
 * Toast Component
 * @module components/ui/Toast
 *
 * Toast notification with auto-dismiss and multiple variants.
 */

/**
 * @typedef {'success' | 'error' | 'warning' | 'info'} ToastType
 */

/**
 * Toast component props
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message
 * @param {ToastType} [props.type='info'] - Toast type/variant
 * @param {number} [props.duration=4000] - Auto-dismiss duration in ms
 * @param {Function} props.onClose - Close handler
 * @param {boolean} [props.showIcon=true] - Show type icon
 * @returns {JSX.Element} Toast component
 */
const Toast = ({
  message,
  type = "info",
  duration = 4000,
  onClose,
  showIcon = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  }, [onClose]);

  // Auto-dismiss
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!isVisible) return null;

  // Type-specific styles and icons
  const typeStyles = {
    success: {
      bg: "bg-green-500/20 border-green-500/50",
      text: "text-green-400",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-500/20 border-red-500/50",
      text: "text-red-400",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    warning: {
      bg: "bg-amber-500/20 border-amber-500/50",
      text: "text-amber-400",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    info: {
      bg: "bg-blue-500/20 border-blue-500/50",
      text: "text-blue-400",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const { bg, text, icon } = typeStyles[type];

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3
        ${bg} border rounded-xl
        shadow-lg shadow-black/20
        ${isExiting ? "animate-slide-out" : "animate-slide-in"}
      `}
      role="alert"
    >
      {showIcon && <span className={text}>{icon}</span>}
      <p className="text-white text-sm flex-1">{message}</p>
      <button
        onClick={handleClose}
        className="p-1 text-slate-400 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

/**
 * Toast Container - renders at fixed position
 */
export const ToastContainer = ({ toasts, onRemove }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={() => onRemove(toast.id)}
      />
    ))}
  </div>
);

export default Toast;
