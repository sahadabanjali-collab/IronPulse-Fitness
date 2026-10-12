import {
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AccessDeniedProps {
  onBackToSite: () => void;
}

export default function AccessDenied({ onBackToSite }: AccessDeniedProps) {
  const { user, signOut } = useAuth();

  const userEmail = user?.email || "admin@ironpulse.com";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-zinc-900/90 border border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500 shadow-inner">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Administrator Access Required
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Your account ({userEmail}) does not have administrative privileges for the IronPulse portal.
          </p>
        </div>

        {/* Guidance */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-xs space-y-2.5">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold">
            <Lock className="h-4 w-4 text-red-500" />
            <span>Authorized Accounts:</span>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Please sign in using your designated manager or owner credentials (e.g. <span className="text-zinc-200 font-mono">admin@ironpulse.com</span> or <span className="text-zinc-200 font-mono">sahadabanjali@gmail.com</span>).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onBackToSite}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl border border-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Website</span>
          </button>

          <button
            onClick={() => signOut()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign In as Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
}
