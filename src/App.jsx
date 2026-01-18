import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { HotelProvider } from "./context/HotelContext.jsx";
import { ProtectedRoute } from "./components/layout/index.js";

// Pages
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Comparison from "./pages/Comparison.jsx";
import NotFound from "./pages/NotFound.jsx";

/**
 * Root Application Component
 * @module App
 *
 * Sets up application routing and context providers.
 * All protected routes are wrapped with ProtectedRoute for auth.
 */
const App = () => {
  return (
    <AuthProvider>
      <HotelProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comparison"
            element={
              <ProtectedRoute>
                <Comparison />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HotelProvider>
    </AuthProvider>
  );
};

export default App;
