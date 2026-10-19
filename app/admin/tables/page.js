"use client";

import { useState, useSyncExternalStore } from "react";
import { useAdmin, INITIAL_TABLES } from "@/lib/admin/adminStore";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminDrawer from "@/components/admin/ui/AdminDrawer";

const emptySubscribe = () => () => {};
const useIsMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);
import {
  Users,
  Clock,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  CalendarCheck,
  UtensilsCrossed,
  Search,
  UserCheck,
  XCircle,
  Plus,
  Minus,
} from "lucide-react";

export default function AdminTablesPage() {
  const {
    tables,
    orders,
    updateTableStatus,
    releaseTable,
    setIsPosOpen,
    addToast,
  } = useAdmin();

  const mounted = useIsMounted();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [editGuests, setEditGuests] = useState(2);
  const [editReservedFor, setEditReservedFor] = useState("");

  // Ensure SSR & initial client hydration match INITIAL_TABLES exactly
  const currentTablesList = mounted && tables && tables.length > 0 ? tables : INITIAL_TABLES;
  const mainTables = currentTablesList.slice(0, 12);

  // Status counts
  const availableCount = mainTables.filter((t) => t.status === "available").length;
  const diningCount = mainTables.filter((t) => t.status === "dining").length;
  const reservedCount = mainTables.filter((t) => t.status === "reserved").length;

  const totalGuestsSeated = mainTables
    .filter((t) => t.status === "dining")
    .reduce((sum, t) => sum + (t.guests || 2), 0);

  // Filtered tables
  const filteredTables = mainTables.filter((tbl) => {
    const matchesStatus = statusFilter === "all" || tbl.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      tbl.code?.toLowerCase().includes(query) ||
      tbl.name?.toLowerCase().includes(query) ||
      tbl.currentOrder?.toLowerCase().includes(query) ||
      tbl.reservedFor?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleOpenDrawer = (tbl) => {
    setSelectedTable(tbl);
    setEditGuests(tbl.guests || 2);
    setEditReservedFor(tbl.reservedFor || "");
  };

  const handleQuickStatusChange = (e, tableId, newStatus, extra = {}) => {
    e.stopPropagation();
    updateTableStatus(tableId, newStatus, extra);
  };

  // Find linked order if table is dining
  const linkedOrder = selectedTable?.currentOrder
    ? orders.find((o) => o.id === selectedTable.currentOrder)
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-google-sans font-bold tracking-tight text-cream">
            Main Tables Management
          </h1>
          <p className="text-xs sm:text-sm text-[#8E867B] mt-0.5">
            12 Main Dining Tables • Instant Status Switching (Available, Dining, Reserved)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              localStorage.setItem("chaat_admin_tables", JSON.stringify(INITIAL_TABLES));
              window.location.reload();
            }}
            title="Reset tables to default layout"
          >
            Reset Tables
          </AdminButton>

          <AdminButton
            variant="primary"
            size="sm"
            icon={ShoppingBag}
            onClick={() => setIsPosOpen(true)}
          >
            New POS Order
          </AdminButton>
        </div>
      </div>

      {/* 3 Unified Single-Lite-Color KPI Stat Cards (Only Tags are Colorful) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Card */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === "available" ? "all" : "available")}
          className={`p-4 rounded-2xl bg-[#13110F] border text-left transition-all cursor-pointer ${
            statusFilter === "available"
              ? "border-gold/60 shadow-lg shadow-black/40 ring-1 ring-gold/30"
              : "border-[#241F1A] hover:border-[#3A3126]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8E867B] font-medium uppercase tracking-wider">
              Available Tables
            </span>
            <AdminBadge variant="success" size="sm" dot>
              Available
            </AdminBadge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p suppressHydrationWarning className="text-3xl font-google-sans font-bold text-cream">
              {availableCount}
            </p>
            <span className="text-xs text-[#8E867B]">/ 12 Total</span>
          </div>
          <p className="text-xs text-[#8E867B] mt-1">
            Vacant tables ready for immediate seating
          </p>
        </button>

        {/* Dining Card */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === "dining" ? "all" : "dining")}
          className={`p-4 rounded-2xl bg-[#13110F] border text-left transition-all cursor-pointer ${
            statusFilter === "dining"
              ? "border-gold/60 shadow-lg shadow-black/40 ring-1 ring-gold/30"
              : "border-[#241F1A] hover:border-[#3A3126]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8E867B] font-medium uppercase tracking-wider">
              Dining & Active
            </span>
            <AdminBadge variant="gold" size="sm" dot>
              Dining
            </AdminBadge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p suppressHydrationWarning className="text-3xl font-google-sans font-bold text-cream">
              {diningCount}
            </p>
            <span suppressHydrationWarning className="text-xs text-[#8E867B]">
              Tables ({totalGuestsSeated} Guests Seated)
            </span>
          </div>
          <p className="text-xs text-[#8E867B] mt-1">
            Currently seated guests with active service
          </p>
        </button>

        {/* Reserved Card */}
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === "reserved" ? "all" : "reserved")}
          className={`p-4 rounded-2xl bg-[#13110F] border text-left transition-all cursor-pointer ${
            statusFilter === "reserved"
              ? "border-gold/60 shadow-lg shadow-black/40 ring-1 ring-gold/30"
              : "border-[#241F1A] hover:border-[#3A3126]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8E867B] font-medium uppercase tracking-wider">
              Advance Bookings
            </span>
            <AdminBadge variant="info" size="sm" dot>
              Reserved
            </AdminBadge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p suppressHydrationWarning className="text-3xl font-google-sans font-bold text-cream">
              {reservedCount}
            </p>
            <span className="text-xs text-[#8E867B]">/ 12 Total</span>
          </div>
          <p className="text-xs text-[#8E867B] mt-1">
            Tables reserved for upcoming guest arrivals
          </p>
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#13110F] p-2 rounded-2xl border border-[#241F1A]">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto menu-scroll">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#221C17] border border-[#3A3024] text-cream font-bold"
                : "text-[#8E867B] hover:text-cream hover:bg-white/5"
            }`}
          >
            All 12 Tables
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("available")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === "available"
                ? "bg-[#221C17] border border-[#3A3024] text-cream font-bold"
                : "text-[#8E867B] hover:text-cream hover:bg-white/5"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Available ({availableCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("dining")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === "dining"
                ? "bg-[#221C17] border border-[#3A3024] text-cream font-bold"
                : "text-[#8E867B] hover:text-cream hover:bg-white/5"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Dining ({diningCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("reserved")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === "reserved"
                ? "bg-[#221C17] border border-[#3A3024] text-cream font-bold"
                : "text-[#8E867B] hover:text-cream hover:bg-white/5"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span suppressHydrationWarning>Reserved ({reservedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-55">
          <Search className="w-3.5 h-3.5 text-[#7E7568] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Table #, order..."
            className="w-full bg-[#181512] border border-[#26201B] rounded-xl pl-9 pr-3 py-1.5 text-xs text-cream placeholder:text-[#7E7568] focus:border-gold focus:outline-hidden"
          />
        </div>
      </div>

      {/* 12 Main Table Cards Grid (Single Lite Premium Color, Tags Only Colorful) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTables.map((tbl) => {
          const isAvailable = tbl.status === "available";
          const isDining = tbl.status === "dining";
          const isReserved = tbl.status === "reserved";

          return (
            <div
              key={tbl.id}
              onClick={() => handleOpenDrawer(tbl)}
              className="p-5 rounded-2xl bg-[#13110F] border border-[#241F1A] hover:border-[#3A3126] transition-all cursor-pointer select-none flex flex-col justify-between min-h-55 shadow-lg group relative"
            >
              {/* Card Top: Code & Tag */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-mono text-2xl font-bold text-cream group-hover:text-gold transition-colors">
                      {tbl.code}
                    </h3>
                    <p className="text-xs text-[#8E867B] font-medium mt-0.5">
                      {tbl.name || `Table ${tbl.code?.replace("T-", "")}`}
                    </p>
                  </div>

                  {/* ONLY THE TAG IS COLORFUL */}
                  {isAvailable && (
                    <AdminBadge variant="success" size="sm" dot>
                      Available
                    </AdminBadge>
                  )}
                  {isDining && (
                    <AdminBadge variant="gold" size="sm" dot>
                      Dining
                    </AdminBadge>
                  )}
                  {isReserved && (
                    <AdminBadge variant="info" size="sm" dot>
                      Reserved
                    </AdminBadge>
                  )}
                </div>

                {/* Card Center: Info Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#8E867B]">
                    <Users className="w-3.5 h-3.5 text-[#7E7568]" />
                    <span>Capacity: {tbl.capacity} Pax</span>
                  </div>

                  {isDining && (
                    <div className="space-y-1 pt-1.5 border-t border-[#25201B]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8E867B]">Seated:</span>
                        <span className="font-medium text-cream">
                          {tbl.guests || 2} Guests
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8E867B] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#7E7568]" />
                          Time:
                        </span>
                        <span className="font-mono text-[#D8CEBF]">
                          ~{tbl.elapsedMins || 15} mins
                        </span>
                      </div>
                      {tbl.currentOrder && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8E867B]">Order:</span>
                          <span className="font-mono text-cream font-semibold">
                            {tbl.currentOrder}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {isReserved && (
                    <div className="pt-1.5 border-t border-[#25201B] space-y-1">
                      <span className="text-[10px] text-[#8E867B] uppercase font-bold tracking-wider">
                        Reserved For:
                      </span>
                      <p className="text-xs text-cream font-medium truncate">
                        {tbl.reservedFor || "Confirmed Guest"}
                      </p>
                    </div>
                  )}

                  {isAvailable && (
                    <div className="pt-1.5 border-t border-[#25201B]">
                      <p className="text-xs text-[#8E867B] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" />
                        Ready for seating
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Bottom: Sleek Monochromatic Action Buttons */}
              <div
                className="pt-3 border-t border-[#25201B] mt-3 space-y-2"
                onClick={(e) => e.stopPropagation()}
              >
                {isAvailable && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={(e) =>
                        handleQuickStatusChange(e, tbl.id, "dining", {
                          guests: tbl.capacity > 2 ? 4 : 2,
                        })
                      }
                      className="py-1.5 px-2.5 rounded-xl bg-[#1C1814] hover:bg-[#25201B] border border-[#2A241F] hover:border-[#3E342B] text-xs font-medium text-[#D8CEBF] hover:text-cream transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UtensilsCrossed className="w-3 h-3 text-[#A89F91]" />
                      <span>Seat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDrawer(tbl)}
                      className="py-1.5 px-2.5 rounded-xl bg-[#1C1814] hover:bg-[#25201B] border border-[#2A241F] hover:border-[#3E342B] text-xs font-medium text-[#D8CEBF] hover:text-cream transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CalendarCheck className="w-3 h-3 text-[#A89F91]" />
                      <span>Reserve</span>
                    </button>
                  </div>
                )}

                {isDining && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, tbl.id, "available")}
                      className="py-1.5 px-2.5 rounded-xl bg-[#1C1814] hover:bg-[#25201B] border border-[#2A241F] hover:border-[#3E342B] text-xs font-medium text-[#D8CEBF] hover:text-cream transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#A89F91]" />
                      <span>Vacate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDrawer(tbl)}
                      className="py-1.5 px-2.5 rounded-xl bg-[#1C1814] hover:bg-[#25201B] border border-[#2A241F] hover:border-[#3E342B] text-xs font-medium text-[#D8CEBF] hover:text-gold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Manage →</span>
                    </button>
                  </div>
                )}

                {isReserved && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={(e) =>
                        handleQuickStatusChange(e, tbl.id, "dining", { guests: 2 })
                      }
                      className="py-1.5 px-2.5 rounded-xl bg-[#1C1814] hover:bg-[#25201B] border border-[#2A241F] hover:border-[#3E342B] text-xs font-medium text-[#D8CEBF] hover:text-cream transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3 h-3 text-[#A89F91]" />
                      <span>Seat</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, tbl.id, "available")}
                      className="py-1.5 px-2.5 rounded-xl bg-[#1C1814] hover:bg-[#25201B] border border-[#2A241F] hover:border-[#3E342B] text-xs font-medium text-[#D8CEBF] hover:text-cream transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3 h-3 text-[#A89F91]" />
                      <span>Release</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Table Detail & Status Drawer */}
      <AdminDrawer
        isOpen={Boolean(selectedTable)}
        onClose={() => setSelectedTable(null)}
        title={`${selectedTable?.name || selectedTable?.code} Controls`}
        subtitle={`Seating Capacity: ${selectedTable?.capacity || 4} Pax • Main Dining Area`}
      >
        {selectedTable && (
          <div className="space-y-6">
            {/* Status Switcher (Sleek dark buttons with colorful indicator dots) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-cream block">
                Update Status (1-Click)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateTableStatus(selectedTable.id, "available");
                    setSelectedTable((prev) => ({ ...prev, status: "available" }));
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedTable.status === "available"
                      ? "bg-[#25201B] border-gold/50 text-cream font-bold shadow-md"
                      : "bg-[#181512] border-[#2A241F] text-[#8E867B] hover:text-cream hover:border-[#3E342B]"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-1.5" />
                  <span className="text-xs">Available</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateTableStatus(selectedTable.id, "dining", { guests: editGuests });
                    setSelectedTable((prev) => ({ ...prev, status: "dining", guests: editGuests }));
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedTable.status === "dining"
                      ? "bg-[#25201B] border-gold/50 text-cream font-bold shadow-md"
                      : "bg-[#181512] border-[#2A241F] text-[#8E867B] hover:text-cream hover:border-[#3E342B]"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#E6BC65] mx-auto mb-1.5" />
                  <span className="text-xs">Dining</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const guestNote = editReservedFor || "Reserved Guest";
                    updateTableStatus(selectedTable.id, "reserved", { reservedFor: guestNote });
                    setSelectedTable((prev) => ({ ...prev, status: "reserved", reservedFor: guestNote }));
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedTable.status === "reserved"
                      ? "bg-[#25201B] border-gold/50 text-cream font-bold shadow-md"
                      : "bg-[#181512] border-[#2A241F] text-[#8E867B] hover:text-cream hover:border-[#3E342B]"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-sky-400 mx-auto mb-1.5" />
                  <span className="text-xs">Reserved</span>
                </button>
              </div>
            </div>

            {/* Contextual Options based on selected status */}
            {selectedTable.status === "dining" && (
              <div className="p-4 rounded-2xl bg-[#181512] border border-[#2A241F] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cream">
                    Seated Guests Count
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newCount = Math.max(1, editGuests - 1);
                        setEditGuests(newCount);
                        updateTableStatus(selectedTable.id, "dining", { guests: newCount });
                        setSelectedTable((prev) => ({ ...prev, guests: newCount }));
                      }}
                      className="p-1 rounded-lg bg-[#25201B] hover:bg-white/10 text-cream cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold text-gold px-2">
                      {editGuests} Pax
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newCount = Math.min(selectedTable.capacity + 2, editGuests + 1);
                        setEditGuests(newCount);
                        updateTableStatus(selectedTable.id, "dining", { guests: newCount });
                        setSelectedTable((prev) => ({ ...prev, guests: newCount }));
                      }}
                      className="p-1 rounded-lg bg-[#25201B] hover:bg-white/10 text-cream cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {linkedOrder ? (
                  <div className="space-y-3 pt-3 border-t border-[#25201B]">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-cream">
                        Active Bill: {linkedOrder.id}
                      </h4>
                      <AdminBadge variant="amber" size="sm">
                        {linkedOrder.status}
                      </AdminBadge>
                    </div>

                    <div className="p-3 bg-[#13110F] border border-[#25201B] rounded-xl text-xs space-y-2">
                      <div className="flex justify-between text-[#8E867B] text-[11px]">
                        <span>Guest: {linkedOrder.customer?.name}</span>
                        <span>{new Date(linkedOrder.timestamp).toLocaleTimeString()}</span>
                      </div>

                      <div className="divide-y divide-[#231E19] py-1">
                        {linkedOrder.items.map((line, idx) => (
                          <div key={idx} className="flex justify-between py-1 text-cream">
                            <span>{line.quantity}× {line.title}</span>
                            <span className="font-mono text-gold">₹{line.price * line.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between font-bold text-sm text-[#E6BC65] pt-1 border-t border-[#231E19]">
                        <span>Total Bill</span>
                        <span className="font-mono">₹{linkedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTable(null);
                        setIsPosOpen(true);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#221C16] hover:bg-[#2A231C] text-[#E6BC65] border border-gold/30 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Create POS Order for {selectedTable.code}</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    releaseTable(selectedTable.id);
                    setSelectedTable(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#221C16] hover:bg-[#2A231C] border border-[#2E2721] text-cream font-semibold text-xs cursor-pointer transition-colors"
                >
                  Vacate Table & Mark Available
                </button>
              </div>
            )}

            {selectedTable.status === "reserved" && (
              <div className="p-4 rounded-2xl bg-[#181512] border border-[#2A241F] space-y-3">
                <label className="text-xs font-semibold text-cream block">
                  Reservation Notes & Guest Details
                </label>
                <input
                  type="text"
                  value={editReservedFor}
                  onChange={(e) => setEditReservedFor(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni (08:30 PM)"
                  className="w-full bg-[#141210] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:border-gold focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateTableStatus(selectedTable.id, "reserved", { reservedFor: editReservedFor });
                    setSelectedTable((prev) => ({ ...prev, reservedFor: editReservedFor }));
                    addToast("Reservation guest details updated", "success");
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#25201B] hover:bg-[#2E2721] border border-[#3E342B] text-cream text-xs font-semibold cursor-pointer transition-colors"
                >
                  Save Guest Details
                </button>

                <div className="pt-2 border-t border-[#25201B]">
                  <button
                    type="button"
                    onClick={() => {
                      updateTableStatus(selectedTable.id, "dining", { guests: selectedTable.capacity > 2 ? 4 : 2 });
                      setSelectedTable((prev) => ({ ...prev, status: "dining" }));
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-gold to-[#E6BC65] hover:from-[#E6BC65] hover:to-[#F3CF7A] text-[#141210] font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Guest Arrived → Seat as Dining</span>
                  </button>
                </div>
              </div>
            )}

            {selectedTable.status === "available" && (
              <div className="p-4 rounded-2xl bg-[#181512] border border-[#2A241F] space-y-3">
                <div className="flex items-center gap-2 text-cream text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Table is sanitized and vacant</span>
                </div>
                <p className="text-xs text-[#8E867B]">
                  Table {selectedTable.code} has capacity for {selectedTable.capacity} guests and is ready for seating.
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateTableStatus(selectedTable.id, "dining", { guests: selectedTable.capacity > 2 ? 4 : 2 });
                      setSelectedTable((prev) => ({ ...prev, status: "dining", guests: 2 }));
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-gold to-[#E6BC65] hover:from-[#E6BC65] hover:to-[#F3CF7A] text-[#141210] font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Seat Walk-in Guests (Dining)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTable(null);
                      setIsPosOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#25201B] hover:bg-[#2E2721] border border-[#3E342B] text-cream text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Open POS Terminal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
