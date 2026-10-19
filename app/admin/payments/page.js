"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin/adminStore";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminModal from "@/components/admin/ui/AdminModal";
import {
  CreditCard,
  Download,
  IndianRupee,
  Search,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  QrCode,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const {
    transactions,
    selectedOutlet,
    addToast,
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [selectedTxnForRefund, setSelectedTxnForRefund] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  const filteredTxns = transactions.filter((t) => {
    const matchesOutlet = selectedOutlet === "ALL" || t.outlet === selectedOutlet;
    const matchesMode = modeFilter === "all" || t.mode.toLowerCase().includes(modeFilter.toLowerCase());
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gatewayRef.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesOutlet && matchesMode && matchesSearch;
  });

  const totalCollected = filteredTxns
    .filter((t) => t.status === "Successful")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = filteredTxns
    .filter((t) => t.status === "Refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  const gstCollected = Math.round((totalCollected * 0.05 / 1.05) * 100) / 100;

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Txn ID,Order ID,Outlet,Customer,Amount,Mode,Gateway Ref,Status,Time"]
        .concat(
          filteredTxns.map(
            (t) =>
              `${t.id},${t.orderId},${t.outlet},"${t.customer}",${t.amount},"${t.mode}",${t.gatewayRef},${t.status},"${t.timestamp}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chaat_chill_settlement_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("Financial settlement exported to CSV", "success");
  };

  const handleProcessRefund = (e) => {
    e.preventDefault();
    if (!selectedTxnForRefund) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTxnForRefund.id
          ? { ...t, status: "Refunded", refundReason: refundReason || "Customer Request" }
          : t
      )
    );
    addToast(`Refund of ₹${selectedTxnForRefund.amount} initiated for ${selectedTxnForRefund.id}`, "warning");
    setSelectedTxnForRefund(null);
    setRefundReason("");
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-google-sans font-bold tracking-tight text-cream">
            Payments, UPI Reconciliation & Settlement
          </h1>
          <p className="text-xs sm:text-sm text-[#A89F91] mt-0.5">
            Real-time merchant ledger, Razorpay QR codes, HDFC card swipes, and daily closing settlements.
          </p>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={handleExportCSV}
        >
          Export Settlement CSV
        </AdminButton>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#13110F] border border-[#241F1A] p-5 rounded-2xl hover:border-[#382F24] transition-colors">
          <p className="text-[10px] text-[#8E867B] uppercase font-bold tracking-wider">
            Net Settled Sales
          </p>
          <p className="text-2xl font-bold font-mono text-gold mt-1">
            ₹{totalCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-[#A89F91] mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            100% reconciled with bank
          </p>
        </div>

        <div className="bg-[#13110F] border border-[#241F1A] p-5 rounded-2xl hover:border-[#382F24] transition-colors">
          <p className="text-[10px] text-[#8E867B] uppercase font-bold tracking-wider">
            UPI Merchant Share
          </p>
          <p className="text-2xl font-bold font-mono text-[#F7F4EE] mt-1">
            78.4%
          </p>
          <p className="text-[11px] text-[#8E867B] mt-2">
            PhonePe, GPay & Paytm QR
          </p>
        </div>

        <div className="bg-[#13110F] border border-[#241F1A] p-5 rounded-2xl hover:border-[#382F24] transition-colors">
          <p className="text-[10px] text-[#8E867B] uppercase font-bold tracking-wider">
            Total GST Liability (5%)
          </p>
          <p className="text-2xl font-bold font-mono text-[#F7F4EE] mt-1">
            ₹{gstCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-[#8E867B] mt-2">
            CGST 2.5% + SGST 2.5%
          </p>
        </div>

        <div className="bg-[#13110F] border border-[#241F1A] p-5 rounded-2xl hover:border-[#382F24] transition-colors">
          <p className="text-[10px] text-[#8E867B] uppercase font-bold tracking-wider">
            Processed Refunds
          </p>
          <p className="text-2xl font-bold font-mono text-[#F7F4EE] mt-1">
            ₹{totalRefunded.toFixed(2)}
          </p>
          <p className="text-[11px] text-[#8E867B] mt-2">
            1 reversal recorded
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <AdminCard noPadding className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="w-3.5 h-3.5 text-[#7E7568] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Txn ID, Order #, or UPI ref..."
              className="w-full bg-[#181512] border border-[#26201B] rounded-xl pl-9 pr-3 py-2 text-xs text-cream focus:outline-hidden focus:border-gold"
            />
          </div>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden"
          >
            <option value="all">All Payment Channels</option>
            <option value="upi">UPI (PhonePe / GPay / Paytm)</option>
            <option value="card">HDFC Card / POS Terminal</option>
            <option value="cash">Cash Register</option>
            <option value="razorpay">Razorpay Gateway</option>
          </select>
        </div>
      </AdminCard>

      {/* Transactions Ledger Table */}
      <AdminCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181512] text-[#8E867B] uppercase font-bold text-[10px] tracking-wider border-b border-[#25201B]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Linked Order</th>
                <th className="py-3 px-4">Outlet</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Gateway Reference</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#231E19]">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-[#7E7568]">
                    No transactions match your search.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-espresso transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cream">
                      {txn.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-gold">
                      {txn.orderId}
                    </td>
                    <td className="py-3 px-4 text-[#A89F91]">
                      {txn.outlet}
                    </td>
                    <td className="py-3 px-4 text-cream font-medium">
                      {txn.customer}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sm text-[#E6BC65]">
                      ₹{txn.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-[#D8CEBF]">
                      {txn.mode}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#7E7568]">
                      {txn.gatewayRef}
                    </td>
                    <td className="py-3 px-4">
                      <AdminBadge
                        variant={txn.status === "Successful" ? "success" : "danger"}
                        size="sm"
                      >
                        {txn.status}
                      </AdminBadge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {txn.status === "Successful" ? (
                        <button
                          type="button"
                          onClick={() => setSelectedTxnForRefund(txn)}
                          className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                        >
                          Refund
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#7E7568] italic">
                          Reversed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Refund Modal */}
      <AdminModal
        isOpen={Boolean(selectedTxnForRefund)}
        onClose={() => setSelectedTxnForRefund(null)}
        title="Authorize Customer Refund"
        subtitle={`Transaction: ${selectedTxnForRefund?.id} • Amount: ₹${selectedTxnForRefund?.amount}`}
        footer={
          <div className="flex justify-end gap-2.5">
            <AdminButton
              variant="dark"
              size="sm"
              onClick={() => setSelectedTxnForRefund(null)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={handleProcessRefund}
            >
              Confirm Refund
            </AdminButton>
          </div>
        }
      >
        {selectedTxnForRefund && (
          <form onSubmit={handleProcessRefund} className="space-y-4">
            <div className="p-3 bg-[#1C1414] border border-rose-500/30 rounded-xl text-xs space-y-1">
              <p className="text-rose-300 font-semibold">
                Warning: Reversible financial action
              </p>
              <p className="text-[#A89F91]">
                This will reverse ₹{selectedTxnForRefund.amount} back to the customer&apos;s {selectedTxnForRefund.mode} account.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Audit Reason for Refund *
              </label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Accidental double scan, dish unavailable, guest returned dish"
                required
                className="w-full mt-1.5 bg-[#1C1814] border border-white/10 rounded-xl px-3 py-2 text-xs text-cream focus:outline-none"
              />
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
