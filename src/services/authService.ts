import { AdminUser, UserRole } from "../types/inquiry";
import { supabase } from "../lib/supabase";

const CUSTOM_USERS_KEY = "ironpulse_admin_custom_users";
const AUTH_STORAGE_KEY = "ironpulse_admin_session";

export const INITIAL_DEFAULT_USERS: (AdminUser & { password: string })[] = [
  {
    id: "usr_admin_1",
    name: "Vikram Malhotra",
    email: "admin@ironpulse.com",
    password: "admin123",
    role: "admin",
    title: "Head Operations & General Manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "usr_admin_owner",
    name: "Debanjan Saha (Admin)",
    email: "sahadabanjali@gmail.com",
    password: "admin123",
    role: "admin",
    title: "Website Owner & Super Administrator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "usr_manager_1",
    name: "Ananya Sharma",
    email: "manager@ironpulse.com",
    password: "manager123",
    role: "manager",
    title: "Admissions & Membership Lead",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "usr_staff_1",
    name: "Rohan Verma",
    email: "staff@ironpulse.com",
    password: "staff123",
    role: "staff",
    title: "Front Desk & Fitness Consultant",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
];

function getStoredUsers(): (AdminUser & { password: string })[] {
  try {
    const raw = localStorage.getItem(CUSTOM_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not parse custom users:", err);
  }
  return INITIAL_DEFAULT_USERS;
}

function saveStoredUsers(users: (AdminUser & { password: string })[]) {
  try {
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save custom users:", err);
  }
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

export function getCurrentSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe = true
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // 1. Check with Supabase Auth first if applicable
  try {
    const { data: supaAuthData, error: supaAuthError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (!supaAuthError && supaAuthData.user) {
      const supaUser: AdminUser = {
        id: supaAuthData.user.id,
        name: supaAuthData.user.user_metadata?.name || cleanEmail.split("@")[0],
        email: cleanEmail,
        role: "admin",
        title: "Authenticated Administrator (Supabase)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      };

      const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const session: AuthSession = {
        user: supaUser,
        token: supaAuthData.session?.access_token || `token_${supaUser.id}_${Date.now()}`,
        expiresAt: Date.now() + durationMs,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true, user: supaUser };
    }
  } catch (supErr) {
    console.warn("Supabase auth check notice, falling back to local credentials:", supErr);
  }

  // 2. Check local/in-app credential store
  const allUsers = getStoredUsers();
  const found = allUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
  );

  if (!found) {
    return {
      success: false,
      error: "Invalid email or password. Please verify your admin credentials.",
    };
  }

  const { password: _, ...userWithoutPassword } = found;
  const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const session: AuthSession = {
    user: userWithoutPassword,
    token: `token_${found.id}_${Date.now()}`,
    expiresAt: Date.now() + durationMs,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return { success: true, user: userWithoutPassword };
}

export function updateAdminPassword(userId: string, newPassword: string): { success: boolean; message: string } {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters long." };
  }

  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return { success: false, message: "Admin user not found." };
  }

  users[index].password = newPassword;
  saveStoredUsers(users);
  return { success: true, message: "Password updated successfully!" };
}

export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase signOut error:", err);
  }
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// Role permission checks
export function hasPermission(
  role: UserRole,
  action: "delete_inquiry" | "export_csv" | "manage_team" | "update_status" | "add_notes"
): boolean {
  switch (action) {
    case "delete_inquiry":
      return role === "admin";
    case "manage_team":
      return role === "admin";
    case "export_csv":
      return role === "admin" || role === "manager";
    case "update_status":
    case "add_notes":
      return role === "admin" || role === "manager" || role === "staff";
    default:
      return false;
  }
}

