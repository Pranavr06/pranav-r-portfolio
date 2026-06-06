"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type AdminDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
};

export default function AdminDrawer({ isOpen, onClose, title, children, maxWidth = "550px" }: AdminDrawerProps) {
  // Prevent scrolling on body when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(2px)",
          zIndex: 50,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: maxWidth,
          backgroundColor: "var(--admin-bg)",
          boxShadow: "-4px 0 15px rgba(0,0,0,0.1)",
          zIndex: 51,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          borderLeft: "1px solid var(--admin-border)"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.5rem",
          borderBottom: "1px solid var(--admin-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0, color: "var(--admin-text-main)" }}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--admin-text-muted)",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--admin-card-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem"
        }}>
          {children}
        </div>
      </div>
    </>
  );
}
