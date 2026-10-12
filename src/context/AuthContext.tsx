import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase, AdminRecord } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  adminRecord: AdminRecord | null;
  loading: boolean;
  isAdmin: boolean;
  isVerifyingAdmin: boolean;
  authError: string | null;
  missingAdminsTable: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminRecord, setAdminRecord] = useState<AdminRecord | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [missingAdminsTable, setMissingAdminsTable] = useState(false);

  /**
   * Verify if the authenticated user exists in the Supabase `admins` table.
   * Expected columns: id, user_id, email, created_at
   * auth.users.id must match admins.user_id
   */
  const verifyAdminAuthorization = useCallback(
    async (
      currentUser: User | null
    ): Promise<{
      isAdmin: boolean;
      record: AdminRecord | null;
      tableMissing: boolean;
      errorMessage?: string;
    }> => {
      if (!currentUser) {
        setIsAdmin(false);
        setAdminRecord(null);
        setMissingAdminsTable(false);
        return { isAdmin: false, record: null, tableMissing: false };
      }

      setIsVerifyingAdmin(true);
      try {
        // Query the 'admins' table where user_id matches auth.users.id
        const { data, error, status } = await supabase
          .from("admins")
          .select("id, user_id, email, created_at")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (error) {
          console.warn("Supabase query on 'admins' table:", error.message);
          // Check if the table hasn't been created yet in PostgreSQL
          if (
            error.code === "PGRST205" ||
            status === 404 ||
            error.message?.toLowerCase().includes("not find the table") ||
            error.message?.toLowerCase().includes("admins")
          ) {
            setMissingAdminsTable(true);
            setIsAdmin(false);
            setAdminRecord(null);
            return {
              isAdmin: false,
              record: null,
              tableMissing: true,
              errorMessage:
                "The 'admins' table is not found in your Supabase schema. Please create it in your Supabase SQL Editor.",
            };
          }

          setIsAdmin(false);
          setAdminRecord(null);
          return {
            isAdmin: false,
            record: null,
            tableMissing: false,
            errorMessage: error.message,
          };
        }

        // If a matching record is found where admins.user_id matches currentUser.id
        if (data && (data.user_id === currentUser.id || data.email?.toLowerCase() === currentUser.email?.toLowerCase())) {
          setIsAdmin(true);
          setAdminRecord(data as AdminRecord);
          setMissingAdminsTable(false);
          return { isAdmin: true, record: data as AdminRecord, tableMissing: false };
        }

        // User authenticated in Supabase but not in 'admins' table
        setIsAdmin(false);
        setAdminRecord(null);
        setMissingAdminsTable(false);
        return { isAdmin: false, record: null, tableMissing: false };
      } catch (err: any) {
        console.error("Authorization check exception:", err);
        setIsAdmin(false);
        setAdminRecord(null);
        return {
          isAdmin: false,
          record: null,
          tableMissing: false,
          errorMessage: err?.message || "Error validating admin authorization",
        };
      } finally {
        setIsVerifyingAdmin(false);
      }
    },
    []
  );

  // Initialize session and listen for auth state changes
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.warn("Error getting initial session:", error.message);
        }

        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            await verifyAdminAuthorization(initialSession.user);
          } else {
            setIsAdmin(false);
            setAdminRecord(null);
          }
        }
      } catch (err) {
        console.warn("Auth initialization error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // Subscribe to Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      const newUser = newSession?.user ?? null;
      setUser(newUser);

      if (newUser) {
        await verifyAdminAuthorization(newUser);
      } else {
        setIsAdmin(false);
        setAdminRecord(null);
        setMissingAdminsTable(false);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [verifyAdminAuthorization]);

  /**
   * Supabase Email + Password Sign In with verification against the 'admins' table
   */
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
    setAuthError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password.trim(),
      });

      if (error) {
        const readableError = getFriendlyErrorMessage(error);
        setAuthError(readableError);
        return { success: false, error: readableError };
      }

      if (!data.user) {
        const err = "No user account returned from authentication provider.";
        setAuthError(err);
        return { success: false, error: err };
      }

      setUser(data.user);
      setSession(data.session);

      // Verify admin role in the 'admins' table
      const authResult = await verifyAdminAuthorization(data.user);

      if (!authResult.isAdmin) {
        if (authResult.tableMissing) {
          return {
            success: true,
            isAdmin: false,
            error:
              "Authentication successful, but the 'admins' table has not been created yet in Supabase.",
          };
        }
        return {
          success: true,
          isAdmin: false,
          error: "Access Denied: Your account is not registered in the 'admins' table.",
        };
      }

      return { success: true, isAdmin: true };
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred during sign in.";
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  /**
   * Sign out from Supabase and clear admin state
   */
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out warning:", err);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setAdminRecord(null);
      setAuthError(null);
      setMissingAdminsTable(false);
    }
  };

  const refreshAdminStatus = async (): Promise<boolean> => {
    if (!user) return false;
    const res = await verifyAdminAuthorization(user);
    return res.isAdmin;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        adminRecord,
        loading,
        isAdmin,
        isVerifyingAdmin,
        authError,
        missingAdminsTable,
        signIn,
        signOut,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function getFriendlyErrorMessage(error: AuthError): string {
  const msg = error.message.toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
    return "Invalid email or password. Please verify your credentials in Supabase.";
  }
  if (msg.includes("email not confirmed")) {
    return "Your email address has not been confirmed in Supabase. Please confirm your email or disable confirmation in Supabase Auth settings.";
  }
  if (msg.includes("too many requests") || msg.includes("rate limit")) {
    return "Too many failed attempts. Please wait a moment and try again.";
  }
  if (msg.includes("user not found")) {
    return "No user found with this email in Supabase Authentication.";
  }
  return error.message || "Authentication failed. Please try again.";
}
