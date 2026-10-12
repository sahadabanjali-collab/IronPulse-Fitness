import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AccessDenied from "./AccessDenied";
import { AdminTab } from "./AdminSidebar";

interface AdminPortalProps {
  onBackToSite: () => void;
}

function AdminPortalContent({ onBackToSite }: AdminPortalProps) {
  const { user, loading, isAdmin, isVerifyingAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>("dashboard");

  // Determine current tab from URL pathname or hash
  useEffect(() => {
    const parseRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      const routeString = path.includes("/admin") ? path : hash;

      if (routeString.includes("bookings")) setCurrentTab("bookings");
      else if (routeString.includes("users")) setCurrentTab("users");
      else if (routeString.includes("messages")) setCurrentTab("messages");
      else if (routeString.includes("services")) setCurrentTab("services");
      else if (routeString.includes("gallery")) setCurrentTab("gallery");
      else if (routeString.includes("testimonials")) setCurrentTab("testimonials");
      else if (routeString.includes("settings")) setCurrentTab("settings");
      else setCurrentTab("dashboard");
    };

    parseRoute();
    window.addEventListener("popstate", parseRoute);
    window.addEventListener("hashchange", parseRoute);

    return () => {
      window.removeEventListener("popstate", parseRoute);
      window.removeEventListener("hashchange", parseRoute);
    };
  }, []);

  const handleTabChange = (tab: AdminTab) => {
    setCurrentTab(tab);
    // Update hash for deep linking without page refresh
    window.location.hash = `admin/${tab}`;
  };

  // 1. Loading State (prevent any flash of content)
  if (loading || isVerifyingAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 space-y-4">
        <div className="h-10 w-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-400 font-medium">Verifying Supabase Administrator authorization...</p>
      </div>
    );
  }

  // 2. Unauthenticated -> Login Screen
  if (!user) {
    return (
      <AdminLogin
        onBackToSite={onBackToSite}
        onLoginSuccess={() => {
          window.location.hash = "admin/dashboard";
        }}
      />
    );
  }

  // 3. Authenticated but not in 'admins' table -> Access Denied Screen
  if (!isAdmin) {
    return <AccessDenied onBackToSite={onBackToSite} />;
  }

  // 4. Authenticated & Verified Admin -> Admin Dashboard
  return (
    <AdminDashboard
      initialTab={currentTab}
      onBackToSite={onBackToSite}
      onNavigateTab={handleTabChange}
    />
  );
}

export default function AdminPortal({ onBackToSite }: AdminPortalProps) {
  return (
    <AuthProvider>
      <AdminPortalContent onBackToSite={onBackToSite} />
    </AuthProvider>
  );
}
