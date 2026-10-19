"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/lib/admin/adminStore";

const emptySubscribe = () => () => {};
const useIsMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  Utensils,
  Package,
  CreditCard,
  Sparkles,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Coffee,
  Store,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    orders,
    inventory,
  } = useAdmin();

  const mounted = useIsMounted();

  // Dynamic counter badges
  const pendingOrdersCount = (orders || []).filter(
    (o) => o.status === "pending" || o.status === "preparing"
  ).length;

  const lowStockCount = (inventory || []).filter(
    (i) => i.status === "low" || i.status === "critical"
  ).length;

  const navGroups = [
    {
      group: "Core Operations",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        {
          label: "Live Orders & KDS",
          href: "/admin/orders",
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
          badgeVariant: "amber",
        },
        { label: "Tables & Floor Plan", href: "/admin/tables", icon: Grid },
      ],
    },
    {
      group: "Menu & Inventory",
      items: [
        { label: "Menu Catalog", href: "/admin/menu", icon: Utensils },
        {
          label: "Raw Inventory",
          href: "/admin/inventory",
          icon: Package,
          badge: lowStockCount > 0 ? lowStockCount : null,
          badgeVariant: "danger",
        },
      ],
    },
    {
      group: "Sales & Marketing",
      items: [
        { label: "Payments & Invoices", href: "/admin/payments", icon: CreditCard },
        { label: "Offers & Coupons", href: "/admin/offers", icon: Sparkles },
      ],
    },
    {
      group: "Management",
      items: [
        { label: "Website Content CMS", href: "/admin/content", icon: Globe },
        { label: "Settings & Outlets", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const renderBadge = (count, variant) => {
    if (!mounted || !count) return null;
    const colors = {
      amber: "bg-[#D4A853]/15 text-[#E6BC65] border border-[#D4A853]/30",
      gold: "bg-[#D4A853]/15 text-[#E6BC65] border border-[#D4A853]/30",
      danger: "bg-rose-500/15 text-rose-300 border border-rose-500/25",
      white: "bg-white/10 text-white border border-white/15",
    };
    return (
      <span
        suppressHydrationWarning
        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono leading-none ${
          colors[variant] || colors.gold
        }`}
      >
        {count}
      </span>
    );
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0D0B0A] border-r border-[#201A15] select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#201A15]">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 overflow-hidden group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1C1814] border border-gold/30 flex items-center justify-center shrink-0 shadow-inner group-hover:border-gold/60 transition-colors">
            <Coffee className="w-4.5 h-4.5 text-gold" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-google-sans font-bold text-sm tracking-wide text-cream truncate">
              Chaat &amp; Chill
            </span>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-[#A89F91] hover:text-cream hover:bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#665D53]">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? "bg-[#1C1814] text-[#F7F4EE] font-semibold border border-gold/30 shadow-sm"
                        : "text-[#9E9689] hover:text-[#F7F4EE] hover:bg-white/4"
                    } ${sidebarCollapsed ? "justify-center" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? "text-gold" : "text-[#6E665C] group-hover:text-gold"
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!sidebarCollapsed && renderBadge(item.badge, item.badgeVariant)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status & Collapse Toggle */}
      <div className="p-3 border-t border-[#26201B] bg-[#100E0C]">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E867B]" />
              <span className="text-[11px] text-[#A89F91]">2 Outlets Online</span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-[#8E867B] hover:text-cream hover:bg-white/5 cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              className="p-1.5 rounded-lg text-[#8E867B] hover:text-cream hover:bg-white/5 cursor-pointer"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-250 z-30 h-screen sticky top-0 ${
          sidebarCollapsed ? "w-18" : "w-64"
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-72 bg-[#12100E] shadow-2xl">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
