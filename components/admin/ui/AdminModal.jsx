"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-xl",
  footer,
}) {
  // Handle ESC key to close
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className={`relative w-full ${maxWidth} bg-[#13110F] border border-[#26201A] rounded-2xl shadow-2xl shadow-black/80 z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#201A15] flex items-center justify-between gap-4 shrink-0 bg-[#161412]">
          <div>
            <h3 className="font-semibold text-lg text-[#F7F4EE]">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[#8E867B] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A89F91] hover:text-[#FAF5EF] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#D8CEBF]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-[#2A241F] bg-[#141210] flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
