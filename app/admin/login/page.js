"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/lib/admin/adminStore";
import {
  Coffee,
  Mail,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginUser } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, password });
      if (res?.success) {
        router.push("/admin");
      } else {
        setError(res?.error || "Invalid administrator credentials. Please check your email and password.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred during authentication. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-[#EDE8E1] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden admin-scope">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-gold to-[#B3832B] shadow-xl shadow-gold/20 mb-2">
            <Coffee className="w-8 h-8 text-[#141210]" />
          </div>
          <h1 className="font-google-sans font-bold text-2xl sm:text-3xl text-cream tracking-tight">
            Chaat & Chill Café
          </h1>
          <p className="text-xs text-[#A89F91]">
            Centralized Restaurant Operations & Management Suite
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#161412] border border-[#2E2721] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-gold text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator Portal</span>
            </div>
            <h2 className="font-semibold text-lg text-cream">
              Sign In to Admin Console
            </h2>
            <p className="text-xs text-[#8E867B] mt-0.5">
              Enter your verified restaurant administrator credentials to proceed.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-cream block">
                Administrator Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="w-4 h-4 text-[#7E7568] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cafe.com"
                  required
                  autoComplete="email"
                  className="w-full bg-[#1C1814] border border-[#2E2721] rounded-xl pl-10 pr-3 py-2.5 text-xs text-cream placeholder:text-[#5E5548] focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-cream block">
                  Password
                </label>
              </div>
              <div className="relative mt-1.5">
                <Lock className="w-4 h-4 text-[#7E7568] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#1C1814] border border-[#2E2721] rounded-xl pl-10 pr-10 py-2.5 text-xs text-cream placeholder:text-[#5E5548] focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E7568] hover:text-cream cursor-pointer p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-gold to-[#E6BC65] hover:from-[#E6BC65] hover:to-[#F3CF7A] text-[#141210] font-semibold text-xs shadow-lg shadow-gold/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In as Administrator"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="text-center text-xs text-[#8E867B]">
          <Link
            href="/"
            className="hover:text-cream transition-colors underline"
          >
            ← Return to Public Café Website
          </Link>
        </div>
      </div>
    </div>
  );
}
