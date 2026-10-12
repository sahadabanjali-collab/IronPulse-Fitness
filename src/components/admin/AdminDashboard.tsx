import { useState, useEffect } from "react";
import {
  Menu,
  RefreshCw,
  Download,
  Search,
  ExternalLink,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Trash2,
  BellRing,
  Inbox,
  Clock,
  ShieldCheck,
  Dumbbell,
  CalendarCheck,
  Users,
  Image as ImageIcon,
  Star,
  Settings as SettingsIcon,
  CheckCircle,
  Database,
  Lock,
  Plus,
  Filter,
} from "lucide-react";
import { Inquiry } from "../../types/inquiry";
import {
  getInquiries,
  deleteInquiry,
  exportInquiriesToCSV,
} from "../../services/inquiryService";
import { fetchMemberships } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar, { AdminTab } from "./AdminSidebar";
import InquiryDetailModal from "./InquiryDetailModal";
import { PROGRAMS, TESTIMONIALS, GALLERY } from "../../data";

interface AdminDashboardProps {
  initialTab?: AdminTab;
  onBackToSite: () => void;
  onNavigateTab?: (tab: AdminTab) => void;
}

export default function AdminDashboard({
  initialTab = "dashboard",
  onBackToSite,
  onNavigateTab,
}: AdminDashboardProps) {
  const { user, adminRecord, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inquiries State (Messages)
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showNewLeadBanner, setShowNewLeadBanner] = useState(false);

  // Memberships State (Bookings)
  const [memberships, setMemberships] = useState<any[]>([]);
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(true);

  // Sync tab with props
  useEffect(() => {
    if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: AdminTab) => {
    setCurrentTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  // Load inquiries and bookings
  const loadData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const [inqData, memData] = await Promise.all([
        getInquiries(),
        fetchMemberships(),
      ]);
      setInquiries(inqData);
      setMemberships(memData);
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    } finally {
      setIsLoadingInquiries(false);
      setIsLoadingMemberships(false);
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  };

  useEffect(() => {
    loadData();

    // 1. Listen for new real-time inquiries
    const handleNewInquiryEvent = (e: any) => {
      const newInq = e.detail as Inquiry;
      if (newInq) {
        setInquiries((prev) => [newInq, ...prev.filter((i) => i.id !== newInq.id)]);
        setShowNewLeadBanner(true);
        setTimeout(() => setShowNewLeadBanner(false), 8000);
      }
    };

    window.addEventListener("ironpulse:new_inquiry", handleNewInquiryEvent);

    // 2. Periodic poll for sync
    const pollInterval = setInterval(() => {
      loadData();
    }, 8000);

    return () => {
      window.removeEventListener("ironpulse:new_inquiry", handleNewInquiryEvent);
      clearInterval(pollInterval);
    };
  }, []);

  const handleDeleteInquiry = async (id: string) => {
    await deleteInquiry(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchQuery.toLowerCase();
    return (
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.phone.includes(q) ||
      inq.subject.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex">
      
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onBackToSite={onBackToSite}
        unreadCount={inquiries.length}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-zinc-900/90 border-b border-zinc-800 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Current Section Title */}
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white capitalize flex items-center gap-2">
                <span>{currentTab}</span>
                <span className="text-[11px] font-normal text-zinc-500 font-mono hidden sm:inline">
                  /admin/{currentTab}
                </span>
              </h2>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Supabase Live Status */}
            <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px] hidden sm:inline">Supabase Connected</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-red-500" : ""}`} />
            </button>

            {/* Return to Public Website */}
            <button
              onClick={onBackToSite}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 hover:text-white px-3 py-1.5 rounded-xl border border-zinc-700 transition-colors cursor-pointer"
            >
              <span>Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Live Submission Alert Banner */}
        {showNewLeadBanner && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-lg animate-bounce">
            <BellRing className="h-4 w-4" />
            <span>New Contact Form Submission Received & Synced to Supabase!</span>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {currentTab === "dashboard" && (
            <div className="space-y-6">
              {/* Top Welcome Card */}
              <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
                <div className="max-w-xl space-y-2">
                  <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                    Administrator Command Center
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    Welcome back, {adminRecord?.email?.split("@")[0] || user?.email?.split("@")[0] || "Admin"}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Your IronPulse gym management system is actively connected to Supabase PostgreSQL with real-time lead capture and role authorization.
                  </p>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Inquiries</span>
                    <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white">{inquiries.length}</div>
                  <p className="text-[11px] text-zinc-500">Live contact submissions</p>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Memberships & Trials</span>
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <CalendarCheck className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white">{memberships.length}</div>
                  <p className="text-[11px] text-zinc-500">Recorded bookings in Supabase</p>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Programs</span>
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                      <Dumbbell className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white">{PROGRAMS.length}</div>
                  <p className="text-[11px] text-zinc-500">Training categories</p>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Auth Status</span>
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-lg font-bold text-white flex items-center gap-1.5 pt-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Verified Admin</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate font-mono">{user?.email}</p>
                </div>
              </div>

              {/* Recent Inquiries Quick Preview */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Recent Website Submissions</h3>
                    <p className="text-xs text-zinc-400">Latest leads submitted through the public contact form</p>
                  </div>
                  <button
                    onClick={() => handleTabChange("messages")}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    View all ({inquiries.length}) &rarr;
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-xs">
                    No inquiries recorded yet. When a visitor submits the contact form, it will appear here.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800/80">
                    {inquiries.slice(0, 5).map((inq) => (
                      <div key={inq.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{inq.name}</p>
                          <p className="text-xs text-zinc-400 truncate">{inq.email} • {inq.phone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-md font-semibold">
                            {inq.subject}
                          </span>
                          <span className="text-[10px] text-zinc-500 hidden sm:inline">{inq.submittedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {currentTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Bookings & Trial Requests</h1>
                  <p className="text-xs text-zinc-400">
                    Recorded member passes, trial bookings, and subscription plans in Supabase.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                {isLoadingMemberships ? (
                  <div className="p-16 text-center text-zinc-400 space-y-3">
                    <div className="h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs">Loading bookings from Supabase...</p>
                  </div>
                ) : memberships.length === 0 ? (
                  <div className="p-16 text-center text-zinc-400 space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                      <CalendarCheck className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-200">No bookings recorded in Supabase yet</p>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      When visitors complete the checkout or trial registration on the public website, entries are stored in the <code className="text-zinc-300">memberships</code> table.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3.5 px-4">Member Name</th>
                          <th className="py-3.5 px-4">Contact</th>
                          <th className="py-3.5 px-4">Plan Selected</th>
                          <th className="py-3.5 px-4">Billing Cycle</th>
                          <th className="py-3.5 px-4">Price Paid</th>
                          <th className="py-3.5 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {memberships.map((mem, idx) => (
                          <tr key={mem.id || idx} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="py-4 px-4 whitespace-nowrap">
                              <p className="font-bold text-white text-sm">{mem.name}</p>
                              <span className="text-[10px] text-zinc-500 font-mono">{mem.payment_id || "Direct Entry"}</span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <p className="text-zinc-300 font-mono">{mem.phone}</p>
                              <p className="text-zinc-500 text-[11px]">{mem.email}</p>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[11px]">
                                {mem.plan_name}
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-zinc-300 capitalize">
                              {mem.billing_cycle || "Monthly"}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap font-bold text-white font-mono">
                              {mem.price || "₹0"}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-zinc-400 text-[11px]">
                              {mem.created_at ? new Date(mem.created_at).toLocaleDateString() : "Recent"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: USERS & AUTH ROLES */}
          {currentTab === "users" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white">Administrator Accounts</h1>
                <p className="text-xs text-zinc-400">
                  Users registered in the Supabase <code className="text-red-400">admins</code> table with authorization privileges.
                </p>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Current Authenticated Admin</h3>
                      <p className="text-xs text-zinc-400">Verified via Supabase Authentication &amp; RLS</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold font-mono">
                    ACTIVE SESSION
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-1.5">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Admin Email</span>
                    <p className="text-white font-bold text-sm font-mono">{user?.email}</p>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-1.5">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Supabase User ID (auth.users.id)</span>
                    <p className="text-zinc-300 font-mono text-xs truncate">{user?.id}</p>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-1.5">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Role Designation</span>
                    <p className="text-emerald-400 font-bold">Authorized Super Administrator</p>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-1.5">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Authorization Method</span>
                    <p className="text-zinc-300 font-mono">admins.user_id = auth.users.id</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES (CONTACT SUBMISSIONS) */}
          {currentTab === "messages" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    <span>Contact Form Submissions</span>
                    <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      {inquiries.length} total
                    </span>
                  </h1>
                  <p className="text-xs text-zinc-400 mt-1">
                    Every contact form submission on the website automatically persists to Supabase and displays here.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => loadData(true)}
                    disabled={isRefreshing}
                    className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-red-500" : ""}`} />
                    <span>Refresh</span>
                  </button>

                  {inquiries.length > 0 && (
                    <button
                      onClick={() => exportInquiriesToCSV(inquiries)}
                      className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Export CSV</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Search Toolbar */}
              <div className="relative">
                <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search submissions by name, email, phone, or goal..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              {/* Table of Submissions */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                {isLoadingInquiries ? (
                  <div className="p-16 text-center text-zinc-400 space-y-3">
                    <div className="h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs">Loading contact form submissions...</p>
                  </div>
                ) : filteredInquiries.length === 0 ? (
                  <div className="p-16 text-center text-zinc-400 space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-200">
                      {searchQuery ? "No matching submissions found" : "No form submissions yet"}
                    </p>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      {searchQuery
                        ? "Try searching with a different name, phone number, or email."
                        : "When any user fills out and submits the contact form on the website, their details will automatically appear here."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3.5 px-4">Full Name</th>
                          <th className="py-3.5 px-4">Contact Info</th>
                          <th className="py-3.5 px-4">Subject / Goal</th>
                          <th className="py-3.5 px-4">Message</th>
                          <th className="py-3.5 px-4">Date & Time</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {filteredInquiries.map((inq) => {
                          const cleanPhone = inq.phone.replace(/\D/g, "");
                          const waUrl = `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                            `Hi ${inq.name}! Thank you for reaching out to IronPulse Fitness regarding ${inq.subject}. How can we assist you?`
                          )}`;

                          return (
                            <tr key={inq.id} className="hover:bg-zinc-800/30 transition-colors group">
                              <td className="py-4 px-4 whitespace-nowrap">
                                <p className="font-bold text-white text-sm">{inq.name}</p>
                                <span className="text-[10px] text-zinc-500">{inq.source}</span>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="space-y-0.5">
                                  <p className="font-mono text-zinc-300 flex items-center gap-1.5">
                                    <Phone className="h-3 w-3 text-zinc-500" />
                                    <span>{inq.phone}</span>
                                  </p>
                                  <p className="text-zinc-400 text-[11px] flex items-center gap-1.5">
                                    <Mail className="h-3 w-3 text-zinc-500" />
                                    <span>{inq.email}</span>
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg text-[11px]">
                                  {inq.subject}
                                </span>
                              </td>
                              <td className="py-4 px-4 max-w-xs">
                                <p className="text-zinc-300 text-xs truncate" title={inq.message}>
                                  {inq.message || "—"}
                                </p>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <p className="text-zinc-400 text-[11px] flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-zinc-500" />
                                  <span>{inq.submittedAt}</span>
                                </p>
                              </td>
                              <td className="py-4 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 rounded-lg transition-colors"
                                    title="Chat on WhatsApp"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                  </a>
                                  <a
                                    href={`tel:${inq.phone}`}
                                    className="p-2 bg-blue-600/10 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 rounded-lg transition-colors"
                                    title="Call Phone"
                                  >
                                    <Phone className="h-3.5 w-3.5" />
                                  </a>
                                  <button
                                    onClick={() => setSelectedInquiry(inq)}
                                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5 text-zinc-400" />
                                    <span>View</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete submission from "${inq.name}"?`)) {
                                        handleDeleteInquiry(inq.id);
                                      }
                                    }}
                                    className="p-2 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
                                    title="Delete Submission"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SERVICES */}
          {currentTab === "services" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white">Fitness Programs &amp; Services</h1>
                <p className="text-xs text-zinc-400">Gym workout categories and specialty training programs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {PROGRAMS.map((prog) => (
                  <div key={prog.id} className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-4 hover:border-zinc-700 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                        Active Program
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">ID: {prog.id}</span>
                    </div>
                    <h3 className="text-lg font-black text-white">{prog.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{prog.description}</p>
                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
                      <span>Icon: <strong className="text-zinc-300">{prog.iconName}</strong></span>
                      <span className="text-emerald-400 font-semibold">Available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GALLERY */}
          {currentTab === "gallery" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white">Facility Photo Gallery</h1>
                <p className="text-xs text-zinc-400">Gym floor visuals, Olympic weight stations, and studio spaces.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {GALLERY.map((img) => (
                  <div key={img.id} className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-4/3">
                    <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">{img.category}</span>
                      <h4 className="text-sm font-bold text-white">{img.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TESTIMONIALS */}
          {currentTab === "testimonials" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white">Member Reviews &amp; Testimonials</h1>
                <p className="text-xs text-zinc-400">Verified transformation reviews and client feedback.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {TESTIMONIALS.map((test) => (
                  <div key={test.id} className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={test.image} alt={test.name} className="h-11 w-11 rounded-full object-cover border border-red-500/30" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{test.name}</h4>
                        <span className="text-xs text-red-400 font-semibold">{test.role}</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">"{test.comment}"</p>
                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Verified Client</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: test.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {currentTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white">System &amp; Database Settings</h1>
                <p className="text-xs text-zinc-400">Supabase connection status, PostgreSQL tables, and credentials.</p>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                  <div className="p-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Supabase Cloud Database</h3>
                    <p className="text-xs text-zinc-400">PostgreSQL Backend Connection</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Project Endpoint URL</label>
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-zinc-200">
                      https://iqvihkdbkzjfzazeozts.supabase.co
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Publishable Client Key</label>
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-zinc-400 truncate">
                      sb_publishable_h9fyBf4t6yYbe_YZBDolmg_1MTza7lU
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Database Tables Active</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono">
                      <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                        <span className="text-zinc-200">admins</span>
                        <span className="text-[10px] text-emerald-400">RLS Active</span>
                      </div>
                      <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                        <span className="text-zinc-200">contact_inquiries</span>
                        <span className="text-[10px] text-emerald-400">Live Sync</span>
                      </div>
                      <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                        <span className="text-zinc-200">memberships</span>
                        <span className="text-[10px] text-emerald-400">Live Sync</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onDelete={handleDeleteInquiry}
        />
      )}

    </div>
  );
}
