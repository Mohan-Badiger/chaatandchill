"use client";

import { useState } from "react";
import { useAdmin, OUTLETS } from "@/lib/admin/adminStore";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  Settings,
  Store,
  Printer,
  ShieldCheck,
  RotateCcw,
  Download,
  Save,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const {
    currentUser,
    selectedOutlet,
    resetDatabaseToDefaults,
    addToast,
  } = useAdmin();

  const [settings, setSettings] = useState({
    gstNumber: "29AABCC1234F1Z8",
    gstRate: 5,
    serviceCharge: 0,
    currencySymbol: "₹",
    receiptWidth: "80mm",
    kotAutoPrint: true,
    roundOffTotals: true,
    smsAlertsEnabled: true,
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast("Store and operational settings saved successfully", "success");
  };

  const handleExportBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      user: currentUser,
      settings,
      outlets: OUTLETS,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `chaat_and_chill_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast("Configuration snapshot downloaded as JSON", "success");
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-google-sans font-bold tracking-tight text-cream">
            Store Settings & Operational Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#A89F91] mt-0.5">
            Configure GST taxation, thermal receipt printing, branch operating details, and demo state.
          </p>
        </div>

        <AdminButton
          variant="primary"
          size="sm"
          icon={Save}
          onClick={handleSaveSettings}
        >
          Save Configuration
        </AdminButton>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Outlets Directory */}
        <AdminCard
          title="Configured Physical Outlets"
          subtitle="Registered restaurant locations across Karnataka"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OUTLETS.filter((o) => o.id !== "ALL").map((outlet) => (
              <div
                key={outlet.id}
                className="p-4 rounded-xl bg-[#13110F] border border-[#241F1A] space-y-2 hover:border-[#382F24] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-cream">
                    {outlet.name}
                  </h3>
                  <AdminBadge variant="success" size="sm">
                    ONLINE
                  </AdminBadge>
                </div>
                <p className="text-xs text-[#A89F91]">
                  {outlet.address}
                </p>
                <div className="pt-2 border-t border-[#241F1A] flex justify-between text-xs text-[#8E867B]">
                  <span>Timing: {outlet.timing}</span>
                  <span className="font-mono text-gold">{outlet.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Taxation & GST Settings */}
        <AdminCard
          title="Taxation, GST & Financial Policies"
          subtitle="Standard Goods & Services Tax compliant with Indian restaurant laws"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-cream">
                GSTIN Registration Number
              </label>
              <input
                type="text"
                value={settings.gstNumber}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs font-mono uppercase text-cream focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Restaurant GST Rate (%)
              </label>
              <input
                type="number"
                value={settings.gstRate}
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs font-mono text-cream focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Discretionary Service Charge (%)
              </label>
              <input
                type="number"
                value={settings.serviceCharge}
                onChange={(e) => setSettings({ ...settings, serviceCharge: Number(e.target.value) })}
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs font-mono text-cream focus:border-gold focus:outline-hidden"
              />
            </div>
          </div>
        </AdminCard>

        {/* Hardware & Printer Config */}
        <AdminCard
          title="Kitchen KOT & Receipt Thermal Printer"
          subtitle="ESC/POS thermal printer hardware synchronization"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-cream">
                  Paper Roll Specification
                </label>
                <select
                  value={settings.receiptWidth}
                  onChange={(e) => setSettings({ ...settings, receiptWidth: e.target.value })}
                  className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden"
                >
                  <option value="80mm">Standard 80mm High-Speed Thermal</option>
                  <option value="58mm">Compact 58mm Mobile Bluetooth</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-cream pb-2">
                  <input
                    type="checkbox"
                    checked={settings.kotAutoPrint}
                    onChange={(e) => setSettings({ ...settings, kotAutoPrint: e.target.checked })}
                    className="rounded accent-gold"
                  />
                  <span>Automatically print KOT on order punch</span>
                </label>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Database Management & Factory Reset */}
        <AdminCard
          title="Demo Data & System Snapshot"
          subtitle="Backup current state or restore fresh out-of-the-box demo data"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-cream">
                Factory Reset Demo Database
              </p>
              <p className="text-xs text-[#8E867B] mt-0.5">
                Resets all live orders, tables, and menu catalog back to default seed state.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleExportBackup}
              >
                Export Snapshot
              </AdminButton>

              <AdminButton
                type="button"
                variant="danger"
                size="sm"
                icon={RotateCcw}
                onClick={() => {
                  if (confirm("Reset demo database back to default state?")) {
                    resetDatabaseToDefaults();
                  }
                }}
              >
                Reset to Defaults
              </AdminButton>
            </div>
          </div>
        </AdminCard>
      </form>
    </div>
  );
}
