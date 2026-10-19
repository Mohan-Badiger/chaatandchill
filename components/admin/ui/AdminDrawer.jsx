"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function AdminDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-md",
  footer,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          className={`w-screen ${width} bg-[#13110F] border-l border-[#241F1A] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#241F1A] flex items-center justify-between gap-4 shrink-0 bg-[#0F0D0C]">
            <div>
              <h3 className="font-google-sans font-semibold text-lg text-cream">{title}</h3>
              {subtitle && (
                <p className="text-xs text-[#A89F91] mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A89F91] hover:text-cream hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm text-[#D8CEBF]">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-[#241F1A] bg-[#0F0D0C] flex items-center justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
