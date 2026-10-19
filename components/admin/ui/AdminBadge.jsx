"use client";

export default function AdminBadge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  suppressHydrationWarning = true,
  ...props
}) {
  const variants = {
    default: "bg-white/[0.04] text-[#C8BFB2] border-white/[0.08]",
    gold: "bg-[#D4A853]/10 text-[#E6BC65] border-[#D4A853]/25",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    danger: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    info: "bg-white/[0.06] text-[#EDE8E1] border-white/10",
    purple: "bg-white/[0.06] text-[#EDE8E1] border-white/10",
  };

  const sizes = {
    sm: "text-[10px] px-2.5 py-0.5 tracking-wider uppercase font-semibold",
    md: "text-xs px-2.5 py-1 font-medium",
    lg: "text-sm px-3.5 py-1.5 font-medium",
  };

  const dotColors = {
    default: "bg-[#8E867B]",
    gold: "bg-[#D4A853]",
    amber: "bg-amber-400",
    success: "bg-emerald-400",
    danger: "bg-rose-400",
    warning: "bg-amber-400",
    info: "bg-[#EDE8E1]",
    purple: "bg-[#EDE8E1]",
  };

  return (
    <span
      suppressHydrationWarning={suppressHydrationWarning}
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            dotColors[variant] || dotColors.default
          }`}
        />
      )}
      {children}
    </span>
  );
}
