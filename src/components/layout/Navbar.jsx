import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useHotelContext } from "../../context/HotelContext.jsx";
import Button from "../ui/Button.jsx";

/**
 * Navbar Component
 * @module components/layout/Navbar
 *
 * Main navigation bar with auth state, comparison cart, and responsive menu.
 */

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { comparisonCount } = useHotelContext();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  /**
   * Check if link is active
   * @param {string} path - Path to check
   * @returns {boolean} True if current path
   */
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white hover:text-amber-500 transition-colors"
          >
            <span className="text-2xl">🏨</span>
            <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Otelier
            </span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`
                  text-sm font-medium transition-colors
                  ${
                    isActive("/dashboard")
                      ? "text-amber-500"
                      : "text-slate-300 hover:text-white"
                  }
                `}
              >
                Search Hotels
              </Link>
              <Link
                to="/comparison"
                className={`
                  relative text-sm font-medium transition-colors
                  ${
                    isActive("/comparison")
                      ? "text-amber-500"
                      : "text-slate-300 hover:text-white"
                  }
                `}
              >
                Comparison
                {comparisonCount > 0 && (
                  <span className="absolute -top-2 -right-4 w-5 h-5 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {comparisonCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Comparison Cart - Mobile */}
                <Link
                  to="/comparison"
                  className="relative md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                  aria-label="View comparison"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {comparisonCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                      {comparisonCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-sm text-slate-400">
                    {user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
