import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentSession, loginUser, logoutUser } from "../services/authService";

export interface AdminRecord {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar?: string;
  };
}

export interface AuthSession {
  access_token: string;
  user: AuthUser;
  expires_at: number;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [adminRecord, setAdminRecord] = useState<AdminRecord | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize session from local auth store
  useEffect(() => {
    try {
      const active = getCurrentSession();
      if (active && active.user) {
        const authUser: AuthUser = {
          id: active.user.id,
          email: active.user.email,
          user_metadata: {
            name: active.user.name,
            avatar: active.user.avatar,
          },
        };

        const authSession: AuthSession = {
          access_token: active.token,
          user: authUser,
          expires_at: active.expiresAt,
        };

        const rec: AdminRecord = {
          id: active.user.id,
          user_id: active.user.id,
          email: active.user.email,
          name: active.user.name,
          role: active.user.role,
        };

        setUser(authUser);
        setSession(authSession);
        setAdminRecord(rec);
        setIsAdmin(true);
      } else {
        setUser(null);
        setSession(null);
        setAdminRecord(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.warn("Auth initialization notice:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
    setAuthError(null);
    setIsVerifyingAdmin(true);
    try {
      const result = await loginUser(email, password, true);
      if (!result.success || !result.user) {
        const errMessage = result.error || "Invalid email or password.";
        setAuthError(errMessage);
        return { success: false, error: errMessage, isAdmin: false };
      }

      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        user_metadata: {
          name: result.user.name,
          avatar: result.user.avatar,
        },
      };

      const authSession: AuthSession = {
        access_token: `token_${result.user.id}_${Date.now()}`,
        user: authUser,
        expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

      const rec: AdminRecord = {
        id: result.user.id,
        user_id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      };

      setUser(authUser);
      setSession(authSession);
      setAdminRecord(rec);
      setIsAdmin(true);
      return { success: true, isAdmin: true };
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred during sign in.";
      setAuthError(msg);
      return { success: false, error: msg, isAdmin: false };
    } finally {
      setIsVerifyingAdmin(false);
    }
  };

  const signOut = async (): Promise<void> => {
    await logoutUser();
    setUser(null);
    setSession(null);
    setAdminRecord(null);
    setIsAdmin(false);
    setAuthError(null);
  };

  const refreshAdminStatus = async (): Promise<boolean> => {
    return isAdmin;
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
        missingAdminsTable: false,
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
