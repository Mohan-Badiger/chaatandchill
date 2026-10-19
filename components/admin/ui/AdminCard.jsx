"use client";

export default function AdminCard({
  children,
  className = "",
  title,
  subtitle,
  action,
  headerBorder = true,
  noPadding = false,
  badge,
}) {
  return (
    <div
      className={`bg-[#13110F] border border-[#241F1A] rounded-2xl shadow-xl overflow-hidden hover:border-[#382F26] transition-colors ${className}`}
    >
      {(title || subtitle || action || badge) && (
        <div
          className={`px-5 py-4 flex flex-wrap items-center justify-between gap-3 ${
            headerBorder ? "border-b border-[#201A15]" : ""
          }`}
        >
          <div>
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="font-google-sans font-semibold text-base text-[#F7F4EE] tracking-tight">
                  {title}
                </h3>
              )}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && (
              <p suppressHydrationWarning className="text-xs text-[#8E867B] mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}
