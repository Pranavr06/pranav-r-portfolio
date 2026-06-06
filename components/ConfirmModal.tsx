"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      animation: "fadeIn 0.2s ease"
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
      <div style={{
        background: "var(--admin-card-bg, #fff)",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        border: "1px solid var(--admin-border, #e5e7eb)",
        overflow: "hidden",
        animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        <div style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--admin-border, #e5e7eb)"
        }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "var(--admin-text-main, #111827)" }}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-muted, #6b7280)", padding: "0.25rem", display: "flex" }}
          >
            <X size={18} />
          </button>
        </div>
        
        <div style={{ padding: "1.5rem", color: "var(--admin-text-muted, #4b5563)", fontSize: "0.95rem", lineHeight: 1.5 }}>
          {message}
        </div>
        
        <div style={{
          padding: "1rem 1.5rem",
          background: "var(--admin-bg, #f9fafb)",
          borderTop: "1px solid var(--admin-border, #e5e7eb)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.75rem"
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid var(--admin-border, #d1d5db)",
              background: "transparent",
              color: "var(--admin-text-main, #374151)",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              background: isDestructive ? "#ef4444" : "#3b82f6",
              color: "white",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "0.9rem",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
