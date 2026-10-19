"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAdmin, OUTLETS, MASTER_ADMIN } from "@/lib/admin/adminStore";

const emptySubscribe = () => () => {};
const useIsMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);
import {
  Search,
  PlusCircle,
  Zap,
  Menu,
  ChevronDown,
  LogOut,
  Check,
  ExternalLink,
} from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();
  const {
    currentUser,
    logoutUser,
    selectedOutlet,
    setSelectedOutlet,
    setMobileMenuOpen,
    setIsCommandOpen,
    setIsPosOpen,
    simulateIncomingLiveOrder,
  } = useAdmin();

  const mounted = useIsMounted();

  const [outletMenuOpen, setOutletMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const currentOutletObj = OUTLETS.find((o) => o.id === selectedOutlet) || OUTLETS[0];

  const displayName = mounted ? (currentUser?.name || MASTER_ADMIN.name) : MASTER_ADMIN.name;
  const displayEmail = mounted ? (currentUser?.email || MASTER_ADMIN.email) : MASTER_ADMIN.email;
  const displayAvatar = mounted ? (currentUser?.avatar || MASTER_ADMIN.avatar) : MASTER_ADMIN.avatar;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#12100E]/95 backdrop-blur-md border-b border-[#26201B] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Outlet Switcher */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-[#A89F91] hover:text-cream hover:bg-white/5 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Outlet Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOutletMenuOpen((prev) => !prev);
              setProfileMenuOpen(false);
              setNotifMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-espresso border border-[#2E2721] hover:border-gold/40 text-xs font-medium text-cream transition-all cursor-pointer"
          >
            <span className="hidden sm:inline font-semibold text-gold">Branch:</span>
            <span className="max-w-35 sm:max-w-none truncate">{currentOutletObj.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E867B]" />
          </button>

          {outletMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOutletMenuOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 bg-[#161412] border border-[#2E2721] rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 text-[10px] uppercase font-bold text-[#8E867B] tracking-wider border-b border-[#25201B]">
                  Select Operating Branch
                </div>
                {OUTLETS.map((outlet) => (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => {
                      setSelectedOutlet(outlet.id);
                      setOutletMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      selectedOutlet === outlet.id
                        ? "bg-gold/15 text-[#E6BC65] font-semibold"
                        : "text-[#D8CEBF] hover:bg-[#25201B]"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{outlet.name}</p>
                      <p className="text-[10px] text-[#8E867B]">{outlet.city} • {outlet.tablesCount} Tables</p>
                    </div>
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

      {/* Center: Global Search Bar Trigger */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          type="button"
          onClick={() => setIsCommandOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#181512] border border-[#2A241F] hover:border-gold/40 text-xs text-[#7E7568] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
            <span>Search orders, menu, patrons...</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] bg-[#221C17] border border-[#362D24] px-1.5 py-0.5 rounded text-[#A89F91]">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Controls: Quick Actions, Notifs & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Order Trigger */}
        <button
          type="button"
          onClick={simulateIncomingLiveOrder}
          title="Receive incoming live order"
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 hover:border-emerald-500/40 text-xs font-medium transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Live Order</span>
        </button>

        {/* Quick POS Biller Button */}
        <button
          type="button"
          onClick={() => setIsPosOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-gold to-[#E6BC65] hover:from-[#E6BC65] hover:to-[#F3CF7A] text-[#141210] text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick POS</span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen((prev) => !prev);
              setOutletMenuOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/40 bg-[#25201B] relative">
              <Image
                src={displayAvatar}
                alt={displayName}
                width={32}
                height={32}
                quality={85}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:block text-left text-xs">
              <p suppressHydrationWarning className="font-semibold text-cream leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-gold font-medium mt-0.5">
                Administrator
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E867B] hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-[#161412] border border-[#2E2721] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                {/* User Header */}
                <div className="px-3 py-2.5 border-b border-[#25201B]">
                  <p suppressHydrationWarning className="font-semibold text-sm text-cream">
                    {displayName}
                  </p>
                  <p suppressHydrationWarning className="text-xs text-[#8E867B]">{displayEmail}</p>
                  <div className="mt-2">
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
                      Master Administrator
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="pt-1.5 space-y-0.5">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#D8CEBF] hover:text-cream hover:bg-[#25201B] rounded-xl transition-colors"
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
