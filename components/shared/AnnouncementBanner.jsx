"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useCms } from "@/lib/useCms";

export default function AnnouncementBanner() {
  const { cmsContent } = useCms();
  const [isDismissed, setIsDismissed] = useState(false);

  const announcement = cmsContent?.announcementBar;

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const dismissed = sessionStorage.getItem("chaat_announcement_dismissed");
        if (dismissed === "true") {
          setIsDismissed(true);
        }
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("chaat_announcement_dismissed", "true");
      }
    } catch {
      // ignore
    }
  };

  if (!announcement || !announcement.enabled || isDismissed) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="relative z-50 bg-linear-to-r from-[#181410] via-[#2A2118] to-[#181410] border-b border-gold/30 text-cream px-4 py-2 sm:py-2.5 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse hidden sm:inline" />
          <p className="truncate sm:whitespace-normal font-sans text-cream/95 text-[11px] sm:text-xs">
            {announcement.text}
          </p>

          {announcement.highlight && announcement.link && (
            <Link
              href={announcement.link}
              className="inline-flex items-center gap-1 font-semibold text-gold hover:text-[#E8C87A] shrink-0 underline underline-offset-2 ml-1 transition-colors text-[11px] sm:text-xs"
            >
              <span>{announcement.highlight}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="p-1 rounded-md text-cream/60 hover:text-cream hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
