"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin/adminStore";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminModal from "@/components/admin/ui/AdminModal";
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Phone,
  Truck,
  RotateCcw,
  Search,
  Filter,
} from "lucide-react";

export default function AdminInventoryPage() {
  const {
    inventory,
    selectedOutlet,
    updateStock,
    logRestock,
    addToast,
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItemForRestock, setSelectedItemForRestock] = useState(null);
  const [restockQty, setRestockQty] = useState(10);

  const filteredInventory = inventory.filter((item) => {
    const matchesOutlet =
      selectedOutlet === "ALL" || item.outlet === "ALL" || item.outlet === selectedOutlet;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesOutlet && matchesStatus && matchesSearch;
  });

  const lowCount = inventory.filter((i) => i.status === "low").length;
  const criticalCount = inventory.filter((i) => i.status === "critical").length;
  const goodCount = inventory.filter((i) => i.status === "good").length;

  const handleOpenRestockModal = (item) => {
    setSelectedItemForRestock(item);
    setRestockQty(Math.ceil(item.minThreshold * 1.5));
  };

  const handleConfirmRestock = (e) => {
    e.preventDefault();
    if (!selectedItemForRestock || restockQty <= 0) return;

    logRestock(selectedItemForRestock.id, restockQty);
    setSelectedItemForRestock(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-google-sans font-bold tracking-tight text-cream">
            Raw Inventory & Zero-Chiller Freshness
          </h1>
          <p className="text-xs sm:text-sm text-[#A89F91] mt-0.5">
            Monitor KMF Nandini ghee levels, Chikmagalur beans, stone-ground pulses, and eco serveware.
          </p>
        </div>

        <AdminButton
          variant="primary"
          size="sm"
          icon={Truck}
          onClick={() => handleOpenRestockModal(inventory[0])}
        >
          Log Stock Delivery
        </AdminButton>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#13110F] border border-[#241F1A] p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#8E867B] uppercase font-bold tracking-wider">
              Critical Shortages
            </p>
            <p className="text-2xl font-bold font-mono text-cream mt-0.5">
              {criticalCount} Items
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/4 border border-white/5 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#13110F] border border-[#241F1A] p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#8E867B] uppercase font-bold tracking-wider">
              Below Safe Threshold
            </p>
            <p className="text-2xl font-bold font-mono text-cream mt-0.5">
              {lowCount} Items
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/4 border border-white/5 flex items-center justify-center text-gold">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#13110F] border border-[#241F1A] p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#8E867B] uppercase font-bold tracking-wider">
              Adequate & Healthy
            </p>
            <p className="text-2xl font-bold font-mono text-cream mt-0.5">
              {goodCount} Items
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/4 border border-white/5 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <AdminCard noPadding className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="w-3.5 h-3.5 text-[#7E7568] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ingredient, supplier, or category..."
              className="w-full bg-[#181512] border border-[#26201B] rounded-xl pl-9 pr-3 py-2 text-xs text-cream placeholder:text-[#7E7568] focus:border-gold focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden"
          >
            <option value="all">All Inventory Statuses</option>
            <option value="critical">Critical Shortages Only</option>
            <option value="low">Low Stock (Reorder Needed)</option>
            <option value="good">Optimal Supply</option>
          </select>
        </div>
      </AdminCard>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredInventory.map((item) => {
          const ratio = Math.min(100, Math.round((item.currentStock / (item.minThreshold * 2)) * 100));
          return (
            <AdminCard
              key={item.id}
              className="transition-all flex flex-col justify-between hover:border-[#382F24]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-cream">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#8E867B]">
                      {item.category} • {item.outlet}
                    </p>
                  </div>
                  <AdminBadge
                    variant={
                      item.status === "critical"
                        ? "danger"
                        : item.status === "low"
                        ? "warning"
                        : "success"
                    }
                    size="sm"
                    dot={item.status !== "good"}
                  >
                    {item.status.toUpperCase()}
                  </AdminBadge>
                </div>

                {/* Stock Level Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-mono text-xl font-bold text-cream">
                      {item.currentStock} {item.unit}
                    </span>
                    <span className="text-[11px] text-[#8E867B]">
                      Min: {item.minThreshold} {item.unit}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-[#25201B] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${ratio}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.status === "critical"
                          ? "bg-rose-500"
                          : item.status === "low"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Supplier info */}
                <div className="p-2.5 rounded-xl bg-[#141210] border border-[#25201B] text-[11px] space-y-1">
                  <div className="flex justify-between text-cream">
                    <span className="truncate">{item.supplier}</span>
                    <span className="font-mono text-gold">₹{item.costPerUnit}/{item.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8E867B]">
                    <span>Last: {item.lastRestocked}</span>
                    <a
                      href={`tel:${item.supplierContact}`}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{item.supplierContact}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-[#25201B] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateStock(item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-[#25201B] hover:bg-[#322A23] text-xs font-bold flex items-center justify-center text-[#D8CEBF] cursor-pointer"
                    title="Log usage (-1)"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStock(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-[#25201B] hover:bg-[#322A23] text-xs font-bold flex items-center justify-center text-[#D8CEBF] cursor-pointer"
                    title="Quick add (+1)"
                  >
                    +
                  </button>
                </div>

                <AdminButton
                  variant="outlineGold"
                  size="xs"
                  icon={Truck}
                  onClick={() => handleOpenRestockModal(item)}
                >
                  Log Delivery
                </AdminButton>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {/* Restock Delivery Modal */}
      <AdminModal
        isOpen={Boolean(selectedItemForRestock)}
        onClose={() => setSelectedItemForRestock(null)}
        title="Log Ingredient Delivery"
        subtitle={`Supplier: ${selectedItemForRestock?.supplier}`}
        footer={
          <div className="flex justify-end gap-2.5">
            <AdminButton
              variant="dark"
              size="sm"
              onClick={() => setSelectedItemForRestock(null)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              size="sm"
              onClick={handleConfirmRestock}
            >
              Confirm Delivery
            </AdminButton>
          </div>
        }
      >
        {selectedItemForRestock && (
          <form onSubmit={handleConfirmRestock} className="space-y-4">
            <div className="p-3 rounded-xl bg-espresso border border-[#2A241F] text-xs space-y-1">
              <p className="font-semibold text-cream">
                {selectedItemForRestock.name}
              </p>
              <p className="text-[#8E867B]">
                Current Stock: {selectedItemForRestock.currentStock} {selectedItemForRestock.unit} • Threshold: {selectedItemForRestock.minThreshold} {selectedItemForRestock.unit}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Delivered Quantity ({selectedItemForRestock.unit}) *
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                required
                className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream font-mono focus:border-gold focus:outline-hidden"
              />
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
