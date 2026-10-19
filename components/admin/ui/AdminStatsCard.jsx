"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminStatsCard({
  title,
  value,
  trend,
  trendLabel = "vs yesterday",
  isPositive = true,
  icon: Icon,
  badgeText,
  className = "",
}) {
  return (
    <div
      className={`relative bg-[#13110F] border border-[#241F1A] hover:border-[#3E3428] rounded-2xl p-5 shadow-xl transition-all duration-200 group overflow-hidden ${className}`}
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-gold/5 blur-2xl pointer-events-none group-hover:bg-gold/10 transition-colors" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <p className="text-xs font-medium text-[#8E867B] tracking-wider uppercase">
            {title}
          </p>
          <h4 suppressHydrationWarning className="text-2xl sm:text-3xl font-bold text-[#F7F4EE] mt-1.5 font-sans tracking-tight">
            {value}
          </h4>
        </div>

        {Icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#1C1814] border border-[#2A241F] text-gold shadow-inner transition-transform group-hover:scale-105 group-hover:border-gold/40"
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend !== undefined || badgeText) && (
        <div suppressHydrationWarning className="mt-4 pt-3 border-t border-[#221C16] flex items-center justify-between text-xs relative z-10">
          {trend !== undefined ? (
            <div suppressHydrationWarning className="flex items-center gap-1.5 font-medium">
              <span
                suppressHydrationWarning
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {trend}
              </span>
              <span suppressHydrationWarning className="text-[#8E867B]">{trendLabel}</span>
            </div>
          ) : (
            <span suppressHydrationWarning className="text-[#8E867B]">{trendLabel}</span>
          )}

          {badgeText && (
            <span suppressHydrationWarning className="text-[11px] font-medium text-gold bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-full">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
