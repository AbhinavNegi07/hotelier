import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

/**
 * NotFound Page (404)
 * @module pages/NotFound
 *
 * Displayed when user navigates to a non-existent route.
 */

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-amber-500 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="primary">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">Search Hotels</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
