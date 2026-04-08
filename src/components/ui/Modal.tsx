"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizes: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={`relative w-full ${sizes[size]} bg-surface-container rounded-[28px] p-0 max-h-[92vh] overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-400 shadow-2xl`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-on-surface">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-[8px] text-on-surface-variant hover:bg-surface-container-high transition-colors duration-150"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export { Modal };
export type { ModalProps };
