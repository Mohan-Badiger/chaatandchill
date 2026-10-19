"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin/adminStore";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminDrawer from "@/components/admin/ui/AdminDrawer";
import {
  ShoppingBag,
  Clock,
  Printer,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  ChefHat,
  ArrowRight,
  Receipt,
  FileText,
  CreditCard,
  IndianRupee,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

export default function AdminOrdersPage() {
  const {
    orders,
    selectedOutlet,
    updateOrderStatus,
    markOrderPaid,
    setIsPosOpen,
    addToast,
  } = useAdmin();

  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "table"
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesOutlet = selectedOutlet === "ALL" || ord.outlet === selectedOutlet;
    const matchesStatus = statusFilter === "all" || ord.status === statusFilter;
    const matchesType = typeFilter === "all" || ord.type === typeFilter;
    const matchesSearch =
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.table?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesOutlet && matchesStatus && matchesType && matchesSearch;
  });

  const columns = [
    { id: "pending", title: "New Orders", icon: Clock, badgeVariant: "warning" },
    { id: "preparing", title: "Live Kitchen (KDS)", icon: ChefHat, badgeVariant: "amber" },
    { id: "ready", title: "Ready for Pickup", icon: CheckCircle2, badgeVariant: "info" },
    { id: "completed", title: "Completed & Paid", icon: Receipt, badgeVariant: "success" },
  ];

  const handlePrintReceipt = (ord) => {
    setSelectedOrder(ord);
    setIsReceiptOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-google-sans font-bold tracking-tight text-cream">
            Live Orders & Kitchen Display System (KDS)
          </h1>
          <p className="text-xs sm:text-sm text-[#A89F91] mt-0.5">
            Real-time kitchen order dispatch, tawa sequencing, token tracking, and guest billing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AdminButton
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setIsPosOpen(true)}
          >
            Punch New Order
          </AdminButton>
        </div>
      </div>

      {/* Filter and View Toggle Bar */}
      <AdminCard noPadding className="p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#7E7568] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order #, table or guest..."
              className="w-full bg-espresso border border-[#2E2721] rounded-xl pl-9 pr-3 py-2 text-xs text-cream placeholder:text-[#7E7568] focus:border-gold focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-espresso border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden"
            >
              <option value="all">All Order Types</option>
              <option value="Dine-in">Dine-in</option>
              <option value="Takeaway">Takeaway Parcel</option>
              <option value="Delivery">Delivery</option>
            </select>

            {/* Status filter (mainly useful in table mode) */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-espresso border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">In Kitchen</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-espresso p-1 rounded-xl border border-[#2E2721]">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-gold text-[#141210] font-bold"
                    : "text-[#A89F91] hover:text-cream"
                }`}
              >
                Kanban KDS
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-gold text-[#141210] font-bold"
                    : "text-[#A89F91] hover:text-cream"
                }`}
              >
                Data Ledger
              </button>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* KANBAN VIEW (KDS) */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {columns.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.id);
            const Icon = col.icon;
            return (
              <div
                key={col.id}
                className="bg-[#141210] border border-[#25201B] rounded-2xl p-4 space-y-4 min-h-125 flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#231E19]">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gold" />
                    <h3 className="font-semibold text-xs text-cream uppercase tracking-wider">
                      {col.title}
                    </h3>
                  </div>
                  <AdminBadge variant={col.badgeVariant} size="sm" suppressHydrationWarning>
                    <span suppressHydrationWarning>{colOrders.length}</span>
                  </AdminBadge>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colOrders.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-center text-xs text-[#6F665A] border border-dashed border-[#231E19] rounded-xl p-4">
                      No orders in {col.title.toLowerCase()}
                    </div>
                  ) : (
                    colOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-espresso border border-[#2A241F] hover:border-[#3E342A] rounded-xl p-3.5 space-y-3 shadow-md transition-all group"
                      >
                        {/* Order Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs text-cream">
                                {ord.id}
                              </span>
                              <span className="text-[10px] text-gold bg-gold/10 px-1.5 py-0.5 rounded font-medium">
                                {ord.outlet}
                              </span>
                            </div>
                            <p className="text-xs text-[#D8CEBF] font-medium mt-0.5">
                              {ord.type} • {ord.table || "Takeaway"}
                            </p>
                            <p className="text-[11px] text-[#8E867B]">
                              {ord.customer?.name}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePrintReceipt(ord)}
                            className="p-1 rounded-lg text-[#8E867B] hover:text-cream hover:bg-white/5 transition-colors cursor-pointer"
                            title="View KOT / Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Items Breakdown */}
                        <div className="space-y-1.5 py-2 border-t border-b border-[#241F1A] text-xs">
                          {ord.items.map((line, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <div className="flex justify-between items-center text-cream">
                                <span className="font-medium">
                                  {line.quantity}× {line.title}
                                </span>
                                <span className="font-mono text-[11px] text-[#A89F91]">
                                  ₹{line.price * line.quantity}
                                </span>
                              </div>
                              {line.notes && (
                                <p className="text-[10px] text-amber-400/90 italic pl-3">
                                  ↳ {line.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Footer & Transition Actions */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-sm text-[#E6BC65]">
                              ₹{ord.total}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                ord.paymentStatus === "paid"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              {ord.paymentStatus === "paid" ? "PAID" : "UNPAID"}
                            </span>
                          </div>

                          {/* Quick Workflow Action Button */}
                          <div className="pt-1 flex gap-1.5">
                            {ord.status === "pending" && (
                              <AdminButton
                                variant="outlineGold"
                                size="xs"
                                className="w-full"
                                onClick={() => updateOrderStatus(ord.id, "preparing")}
                              >
                                Send to Kitchen
                              </AdminButton>
                            )}

                            {ord.status === "preparing" && (
                              <AdminButton
                                variant="amber"
                                size="xs"
                                className="w-full bg-amber hover:bg-[#FFA043] text-white"
                                onClick={() => updateOrderStatus(ord.id, "ready")}
                              >
                                Mark Ready
                              </AdminButton>
                            )}

                            {ord.status === "ready" && (
                              <AdminButton
                                variant="success"
                                size="xs"
                                className="w-full"
                                onClick={() => {
                                  updateOrderStatus(ord.id, "completed");
                                  if (ord.paymentStatus !== "paid") {
                                    markOrderPaid(ord.id, "Cash at Desk");
                                  }
                                }}
                              >
                                Deliver & Settle
                              </AdminButton>
                            )}

                            {ord.status === "completed" && (
                              <div className="w-full py-1 text-center text-[11px] text-emerald-400/80 font-medium">
                                ✓ Order Fulfilled
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LEDGER VIEW */
        <AdminCard noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181512] text-[#8E867B] uppercase font-bold text-[10px] tracking-wider border-b border-[#25201B]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Outlet</th>
                  <th className="py-3 px-4">Type / Table</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231E19]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs text-[#7E7568]">
                      No orders found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      className="hover:bg-espresso transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-cream">
                        {ord.id}
                      </td>
                      <td className="py-3 px-4 text-[#A89F91]">
                        {ord.outlet}
                      </td>
                      <td className="py-3 px-4 text-[#D8CEBF] font-medium">
                        {ord.type} {ord.table ? `(${ord.table})` : ""}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-cream">{ord.customer?.name}</p>
                        <p className="text-[10px] text-[#7E7568]">{ord.customer?.phone}</p>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[#A89F91]">
                        {ord.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#E6BC65]">
                        ₹{ord.total}
                      </td>
                      <td className="py-3 px-4">
                        <AdminBadge
                          variant={
                            ord.status === "completed"
                              ? "success"
                              : ord.status === "ready"
                              ? "info"
                              : ord.status === "preparing"
                              ? "amber"
                              : "warning"
                          }
                          size="sm"
                        >
                          {ord.status}
                        </AdminBadge>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            ord.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {ord.paymentStatus?.toUpperCase()} ({ord.paymentMode})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <AdminButton
                          variant="ghost"
                          size="xs"
                          icon={Receipt}
                          onClick={() => handlePrintReceipt(ord)}
                        >
                          Invoice
                        </AdminButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* KOT & Tax Receipt Slide-Over Drawer */}
      <AdminDrawer
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title={selectedOrder?.status === "completed" ? "Official Tax Invoice" : "Kitchen Order Ticket (KOT)"}
        subtitle={`Order Ref: ${selectedOrder?.id} • ${selectedOrder?.outlet}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-[#8E867B]">Thermal 80mm ESC/POS format</span>
            <AdminButton
              variant="primary"
              size="sm"
              icon={Printer}
              onClick={() => {
                addToast("KOT sent to thermal receipt printer", "success");
                setIsReceiptOpen(false);
              }}
            >
              Print Ticket
            </AdminButton>
          </div>
        }
      >
        {selectedOrder && (
          <div className="bg-[#100E0C] border border-[#2E2721] p-5 rounded-xl font-mono text-xs text-[#D8CEBF] space-y-4 shadow-inner">
            {/* Header info */}
            <div className="text-center pb-3 border-b border-dashed border-[#362D24] space-y-1">
              <h4 className="font-bold text-sm text-cream">
                CHAAT & CHILL CAFÉ
              </h4>
              <p className="text-[11px] text-[#A89F91]">
                {selectedOrder.outlet === "Jamakhandi"
                  ? "Navanagar Main Road, Jamakhandi 587301"
                  : "Main Market Road, Rabakavi Banhatti 587311"}
              </p>
              <p className="text-[10px] text-[#7E7568]">GSTIN: 29AABCC1234F1Z8</p>
              <div className="pt-2 flex justify-between text-[11px] text-cream">
                <span>Order: {selectedOrder.id}</span>
                <span>{selectedOrder.type}</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#8E867B]">
                <span>Table: {selectedOrder.table || "Parcel"}</span>
                <span>{new Date(selectedOrder.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Guest */}
            <div className="text-[11px] text-[#A89F91]">
              <p>Guest: <span className="text-cream">{selectedOrder.customer?.name}</span></p>
              <p>Phone: {selectedOrder.customer?.phone}</p>
            </div>

            {/* Line items */}
            <div className="py-2 border-t border-b border-dashed border-[#362D24] space-y-2">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-center text-cream">
                    <span>
                      {item.quantity}× {item.title}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-gold italic pl-2">
                      * {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1 text-right">
              <div className="flex justify-between text-[#8E867B]">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#8E867B]">
                <span>CGST (2.5%):</span>
                <span>₹{(selectedOrder.tax / 2)?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#8E867B]">
                <span>SGST (2.5%):</span>
                <span>₹{(selectedOrder.tax / 2)?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#E6BC65] pt-2 border-t border-dashed border-[#362D24]">
                <span>Grand Total:</span>
                <span>₹{selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="pt-2 text-center border-t border-dashed border-[#362D24] text-[10px] text-[#8E867B] space-y-1">
              <p>
                Payment: <span className="text-emerald-400 font-bold">{selectedOrder.paymentStatus?.toUpperCase()}</span> via {selectedOrder.paymentMode}
              </p>
              <p>Pure Cow Ghee • Freshly Brewed • Zero Freezers</p>
              <p className="text-[9px] text-[#635B50]">
                Thank you for dining with Chaat & Chill!
              </p>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
