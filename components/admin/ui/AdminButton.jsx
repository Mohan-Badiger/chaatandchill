"use client";

export default function AdminButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  loading = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-[#D4A853] hover:bg-[#E2B765] text-[#12100E] font-semibold shadow-md shadow-[#D4A853]/15 active:scale-[0.98]",
    secondary:
      "bg-[#181512] hover:bg-[#221D18] text-[#EDE8E1] border border-[#2A241F] hover:border-[#3E3428] active:scale-[0.98]",
    dark:
      "bg-[#13110F] hover:bg-[#1A1714] text-[#D8CEBF] border border-[#221C16] active:scale-[0.98]",
    danger:
      "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 active:scale-[0.98]",
    success:
      "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-white/[0.04] text-[#8E867B] hover:text-[#FAF5EF]",
    outlineGold:
      "bg-transparent hover:bg-[#D4A853]/10 text-[#D4A853] border border-[#D4A853]/30 active:scale-[0.98]",
  };

  const sizes = {
    xs: "px-2.5 py-1 text-xs rounded-lg gap-1.5",
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2 text-sm rounded-xl gap-2",
    lg: "px-5 py-2.5 text-base rounded-xl gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-45 disabled:pointer-events-none ${
        variants[variant] || variants.primary
      } ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className={size === "xs" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      ) : null}

      <span>{children}</span>

      {IconRight && !loading && (
        <IconRight className={size === "xs" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      )}
    </button>
  );
}
