"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  useAdmin,
  INITIAL_ORDERS,
  INITIAL_TABLES,
  INITIAL_INVENTORY,
} from "@/lib/admin/adminStore";
import AdminStatsCard from "@/components/admin/ui/AdminStatsCard";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";

const emptySubscribe = () => () => {};
const useIsMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);
import {
  IndianRupee,
  ShoppingBag,
  Grid,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  ChefHat,
  Coffee,
  Sparkles,
  Zap,
  Users,
  Store,
} from "lucide-react";

export default function AdminDashboardPage() {
  const {
    currentUser,
    selectedOutlet,
    orders,
    tables,
    inventory,
    menuItems,
    updateOrderStatus,
  } = useAdmin();

  const mounted = useIsMounted();
  const [salesTimeframe, setSalesTimeframe] = useState("today");

  // Synchronize SSR and initial client hydration with seed data
  const currentOrders = mounted && orders && orders.length > 0 ? orders : INITIAL_ORDERS;
  const currentTables = mounted && tables && tables.length > 0 ? tables : INITIAL_TABLES;
  const currentInventory = mounted && inventory && inventory.length > 0 ? inventory : INITIAL_INVENTORY;

  // Filter items by active outlet
  const filteredOrders = currentOrders.filter(
    (o) => selectedOutlet === "ALL" || o.outlet === selectedOutlet
  );

  const filteredTables = currentTables.filter(
    (t) => selectedOutlet === "ALL" || t.outlet === selectedOutlet
  );

  const activeOrders = filteredOrders.filter(
    (o) => o.status === "pending" || o.status === "preparing" || o.status === "ready"
  );

  const occupiedTables = filteredTables.filter((t) => t.status === "dining" || t.status === "occupied");
  const tableOccupancy = filteredTables.length > 0
    ? Math.round((occupiedTables.length / filteredTables.length) * 100)
    : 0;

  // Calculate gross revenue
  const totalRevenue = filteredOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const averageOrderValue = filteredOrders.length > 0
    ? Math.round((totalRevenue / filteredOrders.length) * 100) / 100
    : 0;

  const lowStockCount = currentInventory.filter(
    (i) => (selectedOutlet === "ALL" || i.outlet === "ALL" || i.outlet === selectedOutlet) &&
      (i.status === "low" || i.status === "critical")
  ).length;

  // Hourly distribution mock data
  const hourlyData = [
    { hour: "07 AM", revenue: 1420, orders: 12, height: "35%" },
    { hour: "08 AM", revenue: 3840, orders: 28, height: "75%" },
    { hour: "09 AM", revenue: 5120, orders: 36, height: "95%" },
    { hour: "10 AM", revenue: 4680, orders: 32, height: "85%" },
    { hour: "11 AM", revenue: 2950, orders: 21, height: "55%" },
    { hour: "12 PM", revenue: 3200, orders: 22, height: "60%" },
    { hour: "01 PM", revenue: 4100, orders: 27, height: "80%" },
    { hour: "04 PM", revenue: 3600, orders: 25, height: "70%" },
    { hour: "05 PM", revenue: 4800, orders: 34, height: "90%" },
    { hour: "07 PM", revenue: 5350, orders: 38, height: "100%" },
    { hour: "09 PM", revenue: 3900, orders: 26, height: "72%" },
  ];

  // Category shares
  const categoryShares = [
    { name: "Stars of the Morning Show", percent: 42, color: "bg-[#D4A853]" },
    { name: "Street Chaats & Snacks", percent: 24, color: "bg-[#D97200]" },
    { name: "Liquid Gold & Chais", percent: 22, color: "bg-emerald-500" },
    { name: "Grand Finale Classics", percent: 12, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Greeting */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-google-sans font-bold tracking-tight text-cream">
          Namaskara, {currentUser?.name || "Mohan"}
        </h1>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AdminStatsCard
          title="Today's Gross Sales"
          value={`₹${totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          trend="+18.4%"
          trendLabel="vs last Friday"
          isPositive={true}
          icon={IndianRupee}
          accentColor="gold"
          badgeText="Verified GST"
        />

        <AdminStatsCard
          title="Active Live Orders"
          value={activeOrders.length.toString()}
          trend={`${filteredOrders.length} Total`}
          trendLabel="today"
          isPositive={true}
          icon={ShoppingBag}
          accentColor="amber"
          badgeText="KDS Active"
        />

        <AdminStatsCard
          title="Table Occupancy"
          value={`${tableOccupancy}%`}
          trend={`${occupiedTables.length} / ${filteredTables.length}`}
          trendLabel="tables seated"
          isPositive={tableOccupancy > 50}
          icon={Grid}
          accentColor="purple"
          badgeText="Darshini Rush"
        />

        <AdminStatsCard
          title="Low Stock Alerts"
          value={lowStockCount.toString()}
          trend={lowStockCount === 0 ? "Optimal" : "Attention"}
          trendLabel={lowStockCount === 0 ? "No shortages" : "Needs reorder"}
          isPositive={lowStockCount === 0}
          icon={AlertTriangle}
          accentColor={lowStockCount > 0 ? "amber" : "emerald"}
          badgeText="Nandini Ghee Hub"
        />
      </div>

      {/* Grid: Sales Heatmap & Real-Time KDS Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Hourly Rush Curve & Category Split */}
        <div className="lg:col-span-8 space-y-6">
          <AdminCard
            title="Hourly Sales Velocity & Rush Heatmap"
            subtitle="Real-time footfall & billing curve across morning and evening peak windows"
            action={
              <div className="flex items-center gap-1 bg-espresso p-1 rounded-xl border border-[#2E2721] text-xs">
                {["today", "week", "month"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSalesTimeframe(tab)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${salesTimeframe === tab
                        ? "bg-gold text-[#141210] font-bold"
                        : "text-[#A89F91] hover:text-cream"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            }
          >
            {/* Visual Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {hourlyData.map((slot) => (
                  <div
                    key={slot.hour}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                  >
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#141210] border border-gold/40 text-cream text-[10px] px-2 py-1 rounded-lg shadow-xl whitespace-nowrap z-20 font-mono">
                        ₹{slot.revenue} ({slot.orders} orders)
                      </div>
                      <div
                        style={{ height: slot.height }}
                        className="w-full max-w-7 rounded-t-lg bg-linear-to-t from-[#B3832B]/50 to-[#E6BC65] group-hover:from-gold group-hover:to-[#FFF0C2] transition-all duration-200"
                      />
                    </div>
                    <span className="text-[10px] text-[#7E7568] font-mono group-hover:text-cream transition-colors">
                      {slot.hour}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom summary bar */}
            <div className="mt-4 pt-4 border-t border-[#25201B] grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[11px] text-[#8E867B]">Peak Window</p>
                <p className="font-semibold text-xs text-cream mt-0.5">
                  07:00 PM – 09:30 PM
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#8E867B]">Average Order Value</p>
                <p suppressHydrationWarning className="font-semibold text-xs text-[#E6BC65] mt-0.5 font-mono">
                  ₹{averageOrderValue}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#8E867B]">Table Turnaround</p>
                <p className="font-semibold text-xs text-emerald-400 mt-0.5">
                  21 Mins Avg
                </p>
              </div>
            </div>
          </AdminCard>

          {/* Category Revenue Distribution */}
          <AdminCard
            title="Sales Share by Menu Category"
            subtitle="Pure vegetarian South Indian repertoire & street food contribution"
          >
            <div className="space-y-4">
              <div className="h-3 w-full bg-[#1C1814] rounded-full overflow-hidden flex">
                {categoryShares.map((cat) => (
                  <div
                    key={cat.name}
                    style={{ width: `${cat.percent}%` }}
                    className={`${cat.color} h-full transition-all duration-300`}
                    title={`${cat.name}: ${cat.percent}%`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {categoryShares.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${cat.color}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-cream truncate">
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-[#8E867B] font-mono">
                        {cat.percent}% of sales
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Right 4 Cols: Live Kitchen Display / Order Feed */}
        <div className="lg:col-span-4 space-y-6">
          <AdminCard
            title="Live Orders Ticker"
            subtitle={`${activeOrders.length} orders actively in kitchen or awaiting pickup`}
            action={
              <Link
                href="/admin/orders"
                className="text-xs font-medium text-gold hover:underline flex items-center gap-1"
              >
                <span>Full KDS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
            noPadding
          >
            <div className="divide-y divide-[#231E19] max-h-115 overflow-y-auto">
              {activeOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#7E7568]">
                  No active orders right now. Click &quot;Live Order&quot; to test.
                </div>
              ) : (
                activeOrders.map((ord) => {
                  const statusColors = {
                    pending: "warning",
                    preparing: "amber",
                    ready: "success",
                  };
                  return (
                    <div
                      key={ord.id}
                      className="p-4 hover:bg-espresso transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-cream">
                              {ord.id}
                            </span>
                            <span className="text-[10px] text-[#A89F91]">
                              • {ord.outlet}
                            </span>
                          </div>
                          <p className="text-xs text-[#D8CEBF] font-medium">
                            {ord.type} {ord.table ? `• Table ${ord.table}` : ""}
                          </p>
                        </div>
                        <AdminBadge
                          variant={statusColors[ord.status] || "default"}
                          size="sm"
                          dot={ord.status === "preparing"}
                        >
                          {ord.status}
                        </AdminBadge>
                      </div>

                      {/* Item list */}
                      <div className="text-[11px] text-[#A89F91] space-y-1 bg-[#141210] p-2 rounded-lg border border-[#25201B]">
                        {ord.items.map((line, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center"
                          >
                            <span className="truncate">
                              {line.quantity}× {line.title}
                            </span>
                            <span className="font-mono text-[#D8CEBF]">
                              ₹{line.price * line.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Status action buttons */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="font-mono font-bold text-[#E6BC65]">
                          ₹{ord.total}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {ord.status === "pending" && (
                            <AdminButton
                              variant="outlineGold"
                              size="xs"
                              onClick={() => updateOrderStatus(ord.id, "preparing")}
                            >
                              Fire to Tawa
                            </AdminButton>
                          )}
                          {ord.status === "preparing" && (
                            <AdminButton
                              variant="success"
                              size="xs"
                              onClick={() => updateOrderStatus(ord.id, "ready")}
                            >
                              Mark Ready
                            </AdminButton>
                          )}
                          {ord.status === "ready" && (
                            <AdminButton
                              variant="primary"
                              size="xs"
                              onClick={() => updateOrderStatus(ord.id, "completed")}
                            >
                              Deliver / Paid
                            </AdminButton>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AdminCard>

          {/* Quick Outlet Comparison */}
          <AdminCard
            title="Outlet Performance Matrix"
            subtitle="Comparing Jamakhandi Flagship & Rabakavi Adda"
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-espresso border border-[#2A241F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cream">Chaat & Chill, Jamakhandi</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Open Now
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#26201B]">
                  <div>
                    <span className="text-[10px] text-[#8E867B]">Today&apos;s Sales</span>
                    <p className="font-mono font-semibold text-gold">₹18,450</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E867B]">Seated</span>
                    <p className="font-semibold text-cream">8 / 12 Tbls</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E867B]">Rating</span>
                    <p className="font-semibold text-cream">4.9 ★</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-espresso border border-[#2A241F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cream">The Shreeshailam Cafe, Rabakavi</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Open Now
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#26201B]">
                  <div>
                    <span className="text-[10px] text-[#8E867B]">Today&apos;s Sales</span>
                    <p className="font-mono font-semibold text-gold">₹10,000</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E867B]">Seated</span>
                    <p className="font-semibold text-cream">5 / 8 Tbls</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E867B]">Rating</span>
                    <p className="font-semibold text-cream">4.8 ★</p>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
