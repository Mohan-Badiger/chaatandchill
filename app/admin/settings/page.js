"use client";

import { useState, useEffect } from "react";
import { useAdmin, OUTLETS, DEFAULT_SETTINGS } from "@/lib/admin/adminStore";
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
  Loader2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function AdminSettingsPage() {
  const {
    currentUser,
    selectedOutlet,
    settings: globalSettings,
    updateSettings,
    resetDatabaseToDefaults,
    addToast,
  } = useAdmin();

  const [formData, setFormData] = useState(globalSettings || DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  // Sync form state when backend settings hydrate or refresh
  useEffect(() => {
    if (globalSettings) {
      setFormData((prev) => ({
        ...prev,
        ...globalSettings,
      }));
    }
  }, [globalSettings]);

  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      user: currentUser,
      settings: formData,
      outlets: OUTLETS,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `chaat_and_chill_backup_${new Date().toISOString().split("T")[0]}.json`
    );
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
            Configure GST taxation, thermal receipt printing, branch operating details, and server persistence.
          </p>
        </div>

        <AdminButton
          variant="primary"
          size="sm"
          icon={isSaving ? Loader2 : Save}
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={isSaving ? "opacity-75 cursor-not-allowed" : ""}
        >
          {isSaving ? "Saving..." : "Save Configuration"}
        </AdminButton>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Store & Contact Identity */}
        <AdminCard
          title="Store Identity & Contact Information"
          subtitle="Brand information printed on customer receipts and shown across digital invoices"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-cream">
                Restaurant Brand Name
              </label>
              <input
                type="text"
                value={formData.storeName || ""}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs text-cream focus:border-gold focus:outline-hidden"
                placeholder="Chaat & Chill Café"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Official Support Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone || ""}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs font-mono text-cream focus:border-gold focus:outline-hidden"
                placeholder="+91 94801 23456"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Customer Support Email
              </label>
              <input
                type="email"
                value={formData.contactEmail || ""}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs text-cream focus:border-gold focus:outline-hidden"
                placeholder="contact@chaatandchill.in"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Headquarters Address
              </label>
              <input
                type="text"
                value={formData.supportAddress || ""}
                onChange={(e) => setFormData({ ...formData, supportAddress: e.target.value })}
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs text-cream focus:border-gold focus:outline-hidden"
                placeholder="Station Road, Jamakhandi & Rabakavi, Karnataka"
              />
            </div>
          </div>
        </AdminCard>

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
                <p className="text-xs text-[#A89F91]">{outlet.address}</p>
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
                value={formData.gstNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })
                }
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs font-mono uppercase text-cream focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Restaurant GST Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                step="0.5"
                value={formData.gstRate ?? 5}
                onChange={(e) =>
                  setFormData({ ...formData, gstRate: Number(e.target.value) })
                }
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs font-mono text-cream focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Discretionary Service Charge (%)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={formData.serviceCharge ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, serviceCharge: Number(e.target.value) })
                }
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs font-mono text-cream focus:border-gold focus:outline-hidden"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#241F1A] flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-cream">
              <input
                type="checkbox"
                checked={formData.roundOffTotals ?? true}
                onChange={(e) =>
                  setFormData({ ...formData, roundOffTotals: e.target.checked })
                }
                className="rounded accent-gold"
              />
              <span>Round off total invoices to nearest rupee</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-cream">
              <input
                type="checkbox"
                checked={formData.smsAlertsEnabled ?? true}
                onChange={(e) =>
                  setFormData({ ...formData, smsAlertsEnabled: e.target.checked })
                }
                className="rounded accent-gold"
              />
              <span>Send SMS alerts to guests upon billing & KOT updates</span>
            </label>
          </div>
        </AdminCard>

        {/* Hardware & Printer Config */}
        <AdminCard
          title="Kitchen KOT & Receipt Thermal Printer"
          subtitle="ESC/POS thermal printer hardware synchronization"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-cream">
                Paper Roll Specification
              </label>
              <select
                value={formData.receiptWidth || "80mm"}
                onChange={(e) =>
                  setFormData({ ...formData, receiptWidth: e.target.value })
                }
                className="w-full mt-1.5 bg-[#181512] border border-[#26201B] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden cursor-pointer"
              >
                <option value="80mm">Standard 80mm High-Speed Thermal</option>
                <option value="58mm">Compact 58mm Mobile Bluetooth</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-cream pb-2">
                <input
                  type="checkbox"
                  checked={formData.kotAutoPrint ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, kotAutoPrint: e.target.checked })
                  }
                  className="rounded accent-gold"
                />
                <span>Automatically print KOT on order punch</span>
              </label>
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

        <div className="flex justify-end">
          <AdminButton
            type="submit"
            variant="primary"
            size="md"
            icon={isSaving ? Loader2 : Save}
            disabled={isSaving}
          >
            {isSaving ? "Saving Configuration..." : "Save & Persist Configuration"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
