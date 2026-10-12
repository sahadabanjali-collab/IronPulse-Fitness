import { useState } from "react";
import {
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Database,
  Copy,
  Check,
  Code2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AccessDeniedProps {
  onBackToSite: () => void;
}

export default function AccessDenied({ onBackToSite }: AccessDeniedProps) {
  const { user, missingAdminsTable, signOut } = useAuth();
  const [copied, setCopied] = useState(false);

  const userId = user?.id || "<YOUR_SUPABASE_USER_ID>";
  const userEmail = user?.email || "admin@example.com";

  // SQL snippet to create the admins table and add the current user
  const sqlSnippet = `-- 1. Create the 'admins' table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. Allow authenticated admins to read their own record
CREATE POLICY "Admins can view their own admin status"
ON public.admins
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Register current authenticated user as Administrator
INSERT INTO public.admins (user_id, email)
VALUES ('${userId}', '${userEmail}')
ON CONFLICT (user_id) DO NOTHING;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-zinc-900/90 border border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500 shadow-inner">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            403 - Administrator Authorization Required
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            {missingAdminsTable
              ? "Your account is authenticated with Supabase, but the 'admins' table has not been initialized in your database yet."
              : "Your account is authenticated with Supabase, but your User ID is not registered in the 'admins' table."}
          </p>
        </div>

        {/* Authenticated Account Details */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-800/80 pb-2">
            <span>Authenticated Supabase Account:</span>
            <span className="font-semibold text-white font-mono">{userEmail}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>Supabase User ID (<code className="text-zinc-300">auth.users.id</code>):</span>
            <span className="font-mono text-zinc-300 text-[11px] truncate max-w-[200px] sm:max-w-xs">{userId}</span>
          </div>
        </div>

        {/* SQL Setup Helper for Admins Table */}
        <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <Database className="h-4 w-4 text-red-500" />
              <span>Supabase SQL Setup (<code className="text-red-400">public.admins</code> table)</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied SQL" : "Copy SQL"}</span>
            </button>
          </div>
          <p className="text-[11px] text-zinc-400">
            Run this query in your Supabase project's <strong className="text-zinc-200">SQL Editor</strong> to register your account as an authorized administrator:
          </p>
          <pre className="bg-black/80 border border-zinc-900 rounded-xl p-3 text-[11px] text-zinc-300 font-mono overflow-x-auto max-h-48 scrollbar-thin">
            {sqlSnippet}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onBackToSite}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl border border-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Public Website</span>
          </button>

          <button
            onClick={() => signOut()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out & Try Another Account</span>
          </button>
        </div>

      </div>
    </div>
  );
}
