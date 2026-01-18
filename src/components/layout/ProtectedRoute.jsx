import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { LoadingOverlay } from "../ui/Spinner.jsx";

/**
 * ProtectedRoute Component
 * @module components/layout/ProtectedRoute
 *
 * Wrapper component that redirects unauthenticated users to login.
 */

/**
 * ProtectedRoute component props
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected content
 * @returns {JSX.Element} Protected content or redirect
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (loading) {
    return <LoadingOverlay message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
