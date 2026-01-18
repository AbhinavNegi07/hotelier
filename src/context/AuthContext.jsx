import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { supabase, isSupabaseConfigured } from "../api/supabase.js";

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {Object} [user_metadata] - Additional user metadata
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {User|null} user - Current authenticated user
 * @property {Object|null} session - Current session
 * @property {boolean} loading - Auth state loading
 * @property {boolean} isConfigured - Whether Supabase is configured
 * @property {(email: string, password: string) => Promise<{data: any, error: any}>} signIn - Sign in method
 * @property {(email: string, password: string) => Promise<{data: any, error: any}>} signUp - Sign up method
 * @property {() => Promise<void>} signOut - Sign out method
 */

/**
 * Authentication Context
 * @type {React.Context<AuthContextValue>}
 */
export const AuthContext = createContext(undefined);

/**
 * Authentication Provider Component
 * Wraps the application to provide authentication state and methods
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        if (!isConfigured) {
          // Demo mode - no Supabase configured
          console.info("Supabase not configured. Running in demo mode.");
          setLoading(false);
          return;
        }

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    if (isConfigured) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [isConfigured]);

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{data: any, error: any}>} Sign in result
   */
  const signIn = useCallback(
    async (email, password) => {
      if (!isConfigured) {
        // Demo mode - simulate successful login
        const demoUser = {
          id: "demo-user-id",
          email: email,
          user_metadata: { name: "Demo User" },
        };
        setUser(demoUser);
        setSession({ user: demoUser, access_token: "demo-token" });
        return { data: { user: demoUser }, error: null };
      }

      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { data: null, error };
        }

        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [isConfigured],
  );

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{data: any, error: any}>} Sign up result
   */
  const signUp = useCallback(
    async (email, password) => {
      if (!isConfigured) {
        // Demo mode - simulate successful signup
        return {
          data: { user: { email }, message: "Demo signup successful!" },
          error: null,
        };
      }

      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          return { data: null, error };
        }

        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [isConfigured],
  );

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);

      if (isConfigured) {
        await supabase.auth.signOut();
      }

      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [user, session, loading, isConfigured, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
