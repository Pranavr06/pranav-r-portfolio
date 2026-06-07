"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash, X, Lock } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

function AuthConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
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
    
    // We get the current user's email since we need it for signInWithPassword
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

type TrashItem = {
  id: string;
  title: string;
  type: "project" | "blog" | "certificate" | "testimonial" | "experience" | "experience hub" | "note";
  table: "projects" | "blogs" | "certificates" | "testimonials" | "experiences" | "experience_hubs" | "admin_notes";
  date: string;
};

export default function AdminTrash() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<{id: string, table: TrashItem["table"]} | null>(null);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    fetchTrash();
  }, [router]);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const [projectsRes, blogsRes, certsRes, testRes, expRes, hubRes, notesRes] = await Promise.all([
        supabase.from("projects").select("id, title, created_at").eq("is_archived", true),
        supabase.from("blogs").select("id, title, created_at").eq("is_archived", true),
        supabase.from("certificates").select("id, title, created_at").eq("is_archived", true),
        supabase.from("testimonials").select("id, name, created_at").eq("is_archived", true),
        supabase.from("experiences").select("id, title, created_at").eq("is_archived", true),
        supabase.from("experience_hubs").select("id, title, created_at").eq("is_archived", true),
        supabase.from("admin_notes").select("id, title, created_at").eq("is_archived", true),
      ]);

      const trashItems: TrashItem[] = [];

      projectsRes.data?.forEach(p => {
        trashItems.push({ id: p.id, title: p.title, type: "project", table: "projects", date: p.created_at });
      });

      blogsRes.data?.forEach(b => {
        trashItems.push({ id: b.id, title: b.title, type: "blog", table: "blogs", date: b.created_at });
      });

      certsRes.data?.forEach(c => {
        trashItems.push({ id: c.id, title: c.title, type: "certificate", table: "certificates", date: c.created_at });
      });

      testRes.data?.forEach(t => {
        trashItems.push({ id: t.id, title: `Testimonial by ${t.name}`, type: "testimonial", table: "testimonials", date: t.created_at });
      });

      expRes.data?.forEach(e => {
        trashItems.push({ id: e.id, title: e.title, type: "experience", table: "experiences", date: e.created_at });
      });

      hubRes.data?.forEach(h => {
        trashItems.push({ id: h.id, title: h.title, type: "experience hub", table: "experience_hubs", date: h.created_at });
      });

      notesRes.data?.forEach(n => {
        trashItems.push({ id: n.id, title: n.title, type: "note", table: "admin_notes", date: n.created_at });
      });

      // Sort by date descending
      trashItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setItems(trashItems);
    } catch (error) {
      console.error("Error fetching trash:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string, table: TrashItem["table"]) => {
    const { error } = await supabase.from(table).update({ is_archived: false }).eq("id", id);
    if (error) {
      addToast(`Error restoring item`, "error");
    } else {
      addToast(`Item restored successfully`, "success");
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const confirmPermanentDelete = async () => {
    if (!deleteItem) return;
    
    const { id, table } = deleteItem;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      addToast(`Error deleting item`, "error");
    } else {
      addToast(`Item permanently deleted`, "success");
      setItems(prev => prev.filter(item => item.id !== id));
    }
    setDeleteItem(null);
  };

  const handlePermanentDelete = (id: string, table: TrashItem["table"]) => {
    setDeleteItem({ id, table });
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading trash...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Trash</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage deleted projects, blogs, and certificates.
          </p>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
          <div>Title</div>
          <div>Type</div>
          <div>Deleted Date</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        
        {items.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>Trash is empty.</div>
        ) : (
          items.map((item) => (
            <div key={`${item.table}-${item.id}`} className="admin-table-row" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
              <div style={{ fontWeight: 500, color: "var(--admin-text-main)" }}>
                {item.title}
              </div>
              
              <div>
                <span className="admin-badge neutral" style={{ backgroundColor: "var(--admin-card-hover)", color: "var(--admin-text-main)", textTransform: "capitalize" }}>
                  {item.type}
                </span>
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>
                {new Date(item.date).toLocaleDateString()}
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button 
                  onClick={() => handleRestore(item.id, item.table)} 
                  className="admin-btn admin-btn-secondary" 
                  style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem", gap: "0.25rem" }}
                  title="Restore"
                >
                  <RotateCcw size={14} /> Restore
                </button>
                <button 
                  onClick={() => handlePermanentDelete(item.id, item.table)} 
                  className="admin-btn admin-btn-danger" 
                  style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem", gap: "0.25rem" }}
                  title="Delete Permanently"
                >
                  <Trash size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AuthConfirmModal 
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmPermanentDelete}
        title="Authentication Required"
        message="Permanently deleting this item cannot be undone. Please verify your identity."
      />
    </div>
  );
}
