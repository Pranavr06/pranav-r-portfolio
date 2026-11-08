"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Lock } from "lucide-react";

export default function AuthConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Authentication Required",
  message = "Permanently deleting this item cannot be undone. Please verify your identity.",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    setLoading(false);
    if (authError) {
      setError("Incorrect password.");
    } else {
      onConfirm();
      onClose();
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeIn 0.2s ease" }}>
      <div style={{ background: "var(--admin-card-bg)", borderRadius: "12px", width: "100%", maxWidth: "450px", border: "1px solid var(--admin-border)", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--admin-border)" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lock size={18} color="#ef4444" /> {title}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        
        <div style={{ padding: "1.5rem", color: "var(--admin-text-muted)", fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "1.5rem" }}>{message}</p>
          
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Admin Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to confirm"
                required
                style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--admin-border)", background: "var(--admin-bg)", color: "inherit", fontSize: "0.95rem" }}
              />
            </div>
            
            {error && <div style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</div>}
            
            <button type="submit" className="admin-btn admin-btn-danger" disabled={loading} style={{ width: "100%", padding: "0.75rem", justifyContent: "center", fontSize: "0.95rem" }}>
              {loading ? "Verifying..." : "Verify & Delete Permanently"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
