import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { isValidEmail, validatePassword } from "../utils/validators.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

/**
 * Signup Page
 * @module pages/Signup
 *
 * User registration page with email/password signup.
 */

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, loading, isConfigured } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Handle input change
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSubmitError("");
    setSuccessMessage("");
  };

  /**
   * Validate form
   * @returns {boolean} True if valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    const { error } = await signUp(formData.email, formData.password);

    if (error) {
      setSubmitError(
        error.message || "Failed to create account. Please try again.",
      );
    } else {
      if (isConfigured) {
        setSuccessMessage(
          "Account created! Please check your email to verify your account.",
        );
      } else {
        // Demo mode - redirect to login
        setSuccessMessage("Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2"
          >
            <span className="text-3xl">🏨</span>
            <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Hotelier
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-white mt-4">
            Create your account
          </h1>
          <p className="text-slate-400 mt-1">
            Start finding the best hotels today
          </p>
        </div>

        {/* Demo Mode Notice */}
        {!isConfigured && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-400 text-sm text-center">
              🔔 Demo Mode: Signup simulation active
            </p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm text-center">
              {successMessage}
            </p>
          </div>
        )}

        {/* Error Alert */}
        {submitError && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">{submitError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            }
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            helperText="Must be 8+ characters with uppercase, lowercase, and number"
            required
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
