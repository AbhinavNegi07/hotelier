/**
 * useAuth Hook
 * @module hooks/useAuth
 *
 * Custom hook for authentication operations using Supabase.
 * Provides sign-in, sign-up, sign-out, and session management.
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Custom hook to access authentication context and methods
 * @returns {Object} Auth context value
 * @throws {Error} If used outside of AuthProvider
 * @example
 * const { user, signIn, signOut, loading } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default useAuth;
