"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdmin, OUTLETS, MASTER_ADMIN } from "@/lib/admin/adminStore";

const emptySubscribe = () => () => { };
const useIsMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

import {
  Menu,
  ChevronDown,
  LogOut,
  Check,
  ExternalLink,
  PlusCircle,
  Coffee,
} from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();
  const {
    currentUser,
    logoutUser,
    selectedOutlet,
    setSelectedOutlet,
    setMobileMenuOpen,
    setIsPosOpen,
  } = useAdmin();

  const mounted = useIsMounted();

  const [outletMenuOpen, setOutletMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const currentOutletObj = OUTLETS.find((o) => o.id === selectedOutlet) || OUTLETS[0];

  const fullName = mounted ? (currentUser?.name || MASTER_ADMIN.name) : MASTER_ADMIN.name;
  const adminFirstName = fullName.trim().split(" ")[0] || "Mohan";
  const firstLetter = adminFirstName.charAt(0).toUpperCase() || "M";
  const displayEmail = mounted ? (currentUser?.email || MASTER_ADMIN.email) : MASTER_ADMIN.email;
  const displayAvatar = mounted ? (currentUser?.avatar ?? MASTER_ADMIN.avatar) : MASTER_ADMIN.avatar;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0D0B0A]/95 backdrop-blur-md border-b border-[#201A15] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu, Brand Logo & Outlet Selector */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Sidebar Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-[#A89F91] hover:text-cream hover:bg-white/5 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Subtle Vertical Divider */}
        <div className="h-5 w-px bg-[#26201A] hidden sm:block" />

        {/* Outlet Switcher Dropdown (Only All Outlets, Jamakhandi, Rabakavi) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOutletMenuOpen((prev) => !prev);
              setProfileMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141210] border border-[#26201B] hover:border-gold/40 text-xs font-medium text-cream transition-all cursor-pointer"
          >
            <span className="max-w-45 sm:max-w-none truncate">{currentOutletObj.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E867B]" />
          </button>

          {outletMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOutletMenuOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-72 bg-[#141210] border border-[#26201B] rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-150">
                {OUTLETS.map((outlet) => (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => {
                      setSelectedOutlet(outlet.id);
                      setOutletMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${selectedOutlet === outlet.id
                      ? "bg-gold/15 text-gold font-semibold"
                      : "text-[#D8CEBF] hover:bg-[#1E1A16]"
                      }`}
                  >
                    <span className="font-medium">{outlet.name}</span>
                    {selectedOutlet === outlet.id && (
                      <Check className="w-4 h-4 text-gold" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Controls: Quick POS & Admin Profile with First Name & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick POS Punch Button */}
        <button
          type="button"
          onClick={() => setIsPosOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold hover:bg-[#E2B765] text-[#12100E] text-xs font-semibold shadow-md shadow-gold/10 transition-all cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick POS</span>
        </button>

        {/* Admin First Name & Right Corner Avatar / Letter Fallback */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen((prev) => !prev);
              setOutletMenuOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-2.5 p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            {/* Admin First Name */}
            <span suppressHydrationWarning className="font-semibold text-xs sm:text-sm text-[#F7F4EE]">
              {adminFirstName}
            </span>

            {/* Avatar Image or Initial Fallback */}
            {displayAvatar && !imageError ? (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/50 bg-[#1C1814] relative shrink-0 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayAvatar}
                  alt={adminFirstName}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1C1814] border border-gold/60 flex items-center justify-center text-gold font-bold text-xs sm:text-sm shrink-0 shadow-sm">
                {firstLetter}
              </div>
            )}

            <ChevronDown className="w-3.5 h-3.5 text-[#8E867B]" />
          </button>

          {profileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-[#141210] border border-[#26201B] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                {/* User Header */}
                <div className="px-3 py-2.5 border-b border-[#221C16]">
                  <p suppressHydrationWarning className="font-semibold text-sm text-cream">
                    {fullName}
                  </p>
                  <p suppressHydrationWarning className="text-xs text-[#8E867B]">{displayEmail}</p>
                  <div className="mt-2">
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-gold/10 text-gold border-gold/20">
                      Master Administrator
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="pt-1.5 space-y-0.5">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#D8CEBF] hover:text-cream hover:bg-[#1E1A16] rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                    <span>View Public Café Website</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logoutUser();
                      setProfileMenuOpen(false);
                      router.push("/admin/login");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
