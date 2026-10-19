"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin/adminStore";
import {
  Search,
  Command,
  Utensils,
  ShoppingBag,
  Grid,
  Package,
  Sparkles,
  CreditCard,
  Settings,
  X,
  PlusCircle,
  Zap,
} from "lucide-react";

export default function AdminCommandPalette() {
  const router = useRouter();
  const {
    isCommandOpen,
    setIsCommandOpen,
    menuItems,
    orders,
    setIsPosOpen,
    resetDatabaseToDefaults,
  } = useAdmin();

  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isCommandOpen) {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandOpen, setIsCommandOpen]);

  if (!isCommandOpen) return null;

  const quickNav = [
    { title: "Live Orders & KDS", icon: ShoppingBag, href: "/admin/orders", badge: "Live" },
    { title: "Menu & Food Catalog", icon: Utensils, href: "/admin/menu", badge: "Catalog" },
    { title: "Tables & Floor Plan", icon: Grid, href: "/admin/tables", badge: "Floors" },
    { title: "Raw Inventory & Stock", icon: Package, href: "/admin/inventory", badge: "Stock" },
    { title: "Offers & Coupons", icon: Sparkles, href: "/admin/offers", badge: "Discounts" },
    { title: "Payments & Invoicing", icon: CreditCard, href: "/admin/payments", badge: "Ledger" },
    { title: "Store Settings & Tax", icon: Settings, href: "/admin/settings", badge: "Config" },
  ];

  const filteredNav = quickNav.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMenu = (menuItems || []).filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredOrders = (orders || []).filter((o) =>
    o.id.toLowerCase().includes(query.toLowerCase()) ||
    o.customer?.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleNavigate = (path) => {
    setIsCommandOpen(false);
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCommandOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-[#161412] border border-[#2E2721] rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="px-5 py-4 border-b border-[#2A241F] flex items-center gap-3 bg-espresso">
          <Search className="w-5 h-5 text-gold" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu items, orders, patrons, or type command..."
            className="flex-1 bg-transparent text-sm text-cream placeholder-[#7E7568] focus:outline-hidden"
            autoFocus
          />
          <div className="flex items-center gap-1.5">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono bg-[#25201B] border border-[#3C332A] rounded text-[#A89F91]">
              ESC
            </kbd>
            <button
              onClick={() => setIsCommandOpen(false)}
              className="p-1 rounded-md text-[#A89F91] hover:text-cream hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {/* Quick Actions */}
          <div>
            <p className="px-3 py-1 text-[11px] font-semibold text-[#8E867B] uppercase tracking-wider">
              Quick Actions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCommandOpen(false);
                  setIsPosOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm text-cream hover:bg-gold/15 hover:text-[#E6BC65] transition-colors cursor-pointer group"
              >
                <PlusCircle className="w-4 h-4 text-gold" />
                <span className="font-medium">New Quick Order (POS)</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          {filteredNav.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-semibold text-[#8E867B] uppercase tracking-wider">
                Admin Navigation
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleNavigate(item.href)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-[#D8CEBF] hover:text-cream hover:bg-[#25201B] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[#A89F91]" />
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-espresso border border-[#2E2721] px-2 py-0.5 rounded text-[#A89F91]">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu Items matching query */}
          {query.trim() && filteredMenu.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-semibold text-[#8E867B] uppercase tracking-wider">
                Matching Dishes & Menu Items
              </p>
              <div className="space-y-1 mt-1">
                {filteredMenu.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate("/admin/menu")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-[#D8CEBF] hover:text-cream hover:bg-[#25201B] transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-cream">{item.title}</p>
                      <p className="text-xs text-[#8E867B]">{item.category}</p>
                    </div>
                    <span className="font-mono text-xs text-gold">
                      ₹{item.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Orders */}
          {query.trim() && filteredOrders.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-semibold text-[#8E867B] uppercase tracking-wider">
                Matching Orders
              </p>
              <div className="space-y-1 mt-1">
                {filteredOrders.map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => handleNavigate("/admin/orders")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-[#D8CEBF] hover:text-cream hover:bg-[#25201B] transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-cream">{ord.id} • {ord.customer?.name}</p>
                      <p className="text-xs text-[#8E867B]">{ord.type} • Table {ord.table || "N/A"}</p>
                    </div>
                    <span className="font-mono text-xs text-emerald-400">
                      ₹{ord.total}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 border-t border-[#2A241F] bg-[#141210] flex items-center justify-between text-[11px] text-[#7E7568]">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="font-mono bg-[#25201B] px-1 py-0.5 rounded border border-[#362D24] text-[#A89F91]">↑</kbd> <kbd className="font-mono bg-[#25201B] px-1 py-0.5 rounded border border-[#362D24] text-[#A89F91]">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-[#25201B] px-1 py-0.5 rounded border border-[#362D24] text-[#A89F91]">Enter</kbd> to select</span>
          </div>
          <span className="hidden sm:inline">Chaat & Chill Admin Suite</span>
        </div>
      </div>
    </div>
  );
}
