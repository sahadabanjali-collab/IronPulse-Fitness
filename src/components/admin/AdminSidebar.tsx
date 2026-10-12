import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  MessageSquare,
  Dumbbell,
  Image as ImageIcon,
  Star,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export type AdminTab =
  | "dashboard"
  | "bookings"
  | "users"
  | "messages"
  | "services"
  | "gallery"
  | "testimonials"
  | "settings";

interface AdminSidebarProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onBackToSite: () => void;
  unreadCount?: number;
}

export default function AdminSidebar({
  currentTab,
  onTabChange,
  isOpen,
  onClose,
  onBackToSite,
  unreadCount = 0,
}: AdminSidebarProps) {
  const { user, adminRecord, signOut } = useAuth();

  const navItems: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
    { id: "users", label: "Users", icon: Users },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: "services", label: "Services", icon: Dumbbell },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSelectTab = (tabId: AdminTab) => {
    onTabChange(tabId);
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
  };

  const userEmail = user?.email || adminRecord?.email || "admin@ironpulse.com";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container (Desktop Fixed + Mobile Slide-out Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-zinc-950/95 lg:bg-zinc-900/90 border-r border-zinc-800 flex flex-col justify-between transition-transform duration-300 ease-in-out backdrop-blur-md ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="h-16 px-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-xl shadow-md shadow-red-600/20">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-sans font-black text-base tracking-wider text-white">
                  IRON<span className="text-red-500">PULSE</span>
                </span>
                <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Admin Workspace
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3.5 space-y-1">
            <p className="px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-white" : "text-zinc-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User Info & Footer Actions */}
        <div className="p-3.5 border-t border-zinc-800/80 space-y-3 bg-zinc-950/40">
          
          {/* User Profile Card */}
          <div className="px-3 py-2.5 bg-zinc-900/90 rounded-2xl border border-zinc-800/80 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-zinc-900 border border-red-500/30 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  Admin Account
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              </div>
              <p
                className="text-[11px] text-zinc-400 font-mono truncate"
                title={userEmail}
              >
                {userEmail}
              </p>
            </div>
          </div>

          {/* Action Buttons: Public Website & Logout */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBackToSite}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-rose-300 hover:text-rose-100 border border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
