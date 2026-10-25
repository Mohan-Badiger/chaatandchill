"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin/adminStore";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  Globe,
  Save,
  Sparkles,
  Megaphone,
  Clock,
  Eye,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AdminContentPage() {
  const { cmsContent, updateCmsContent, addToast } = useAdmin();

  const [formData, setFormData] = useState(cmsContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cmsContent) {
      setFormData(cmsContent);
    }
  }, [cmsContent]);

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    try {
      await updateCmsContent(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-google-sans font-bold tracking-tight text-cream">
            Website Content & Headless CMS
          </h1>
          <p className="text-xs sm:text-sm text-[#A89F91] mt-0.5">
            Update festival announcement banners, hero statements, and store notices without code redeploys.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25201B] hover:bg-[#322A23] text-xs font-medium text-cream transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-gold" />
            <span>Preview Website</span>
          </Link>

          <AdminButton
            variant="primary"
            size="sm"
            icon={isSaving ? Loader2 : Save}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Publishing..." : "Save Changes Live"}
          </AdminButton>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Announcement Bar CMS */}
        <AdminCard
          title="Top Announcement Ticker"
          subtitle="Displayed prominently across the header for all café visitors"
          badge={
            <AdminBadge variant={formData.announcementBar?.enabled ? "success" : "default"} size="sm">
              {formData.announcementBar?.enabled ? "ACTIVE LIVE" : "DISABLED"}
            </AdminBadge>
          }
        >
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-cream">
              <input
                type="checkbox"
                checked={formData.announcementBar?.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: {
                      ...formData.announcementBar,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="rounded accent-gold"
              />
              <span className="font-semibold">Enable Announcement Banner on Website</span>
            </label>

            <div>
              <label className="text-xs font-semibold text-cream">
                Announcement Copy
              </label>
              <input
                type="text"
                value={formData.announcementBar?.text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: {
                      ...formData.announcementBar,
                      text: e.target.value,
                    },
                  })
                }
                className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-cream">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.announcementBar?.highlight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementBar: {
                        ...formData.announcementBar,
                        highlight: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-cream">
                  Target Link Destination
                </label>
                <input
                  type="text"
                  value={formData.announcementBar?.link}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementBar: {
                        ...formData.announcementBar,
                        link: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:border-gold focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Hero Copy CMS */}
        <AdminCard
          title="Hero Banner Messaging"
          subtitle="Primary headline and authentic South Indian street food philosophy"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-cream">
                Brand Eyebrow Badge
              </label>
              <input
                type="text"
                value={formData.heroBanner?.badge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heroBanner: {
                      ...formData.heroBanner,
                      badge: e.target.value,
                    },
                  })
                }
                className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Main Headline
              </label>
              <input
                type="text"
                value={formData.heroBanner?.headline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heroBanner: {
                      ...formData.heroBanner,
                      headline: e.target.value,
                    },
                  })
                }
                className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cream">
                Subheadline & Tagline
              </label>
              <textarea
                rows={2}
                value={formData.heroBanner?.subheadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heroBanner: {
                      ...formData.heroBanner,
                      subheadline: e.target.value,
                    },
                  })
                }
                className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl p-3 text-xs text-cream focus:border-gold focus:outline-hidden"
              />
            </div>
          </div>
        </AdminCard>

        {/* Operational Notice CMS */}
        <AdminCard
          title="Daily Operational Status & Timings"
          subtitle="Broadcast status notices (e.g., Festival hours, VIP private event notice)"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-cream">
                  Operational State
                </label>
                <select
                  value={formData.operationalNotice?.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      operationalNotice: {
                        ...formData.operationalNotice,
                        status: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:outline-hidden"
                >
                  <option value="Normal Operations">Normal Operations</option>
                  <option value="Extended Festival Hours">Extended Festival Hours (Open till 1 AM)</option>
                  <option value="Private Wedding Catering Today">Private Wedding Catering Today</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-cream">
                  Notice Description
                </label>
                <input
                  type="text"
                  value={formData.operationalNotice?.message}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      operationalNotice: {
                        ...formData.operationalNotice,
                        message: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-1.5 bg-[#1C1814] border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:border-gold focus:outline-hidden"
                />
              </div>
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
            {isSaving ? "Publishing Live Changes..." : "Save & Publish Live CMS"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
