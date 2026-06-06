"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  purpose: string;
  company?: string;
  linkedin_url?: string;
  github_url?: string;
  source_page?: string;
  source_type?: string;
  source_slug?: string;
  is_read: boolean;
  is_archived: boolean;
  is_starred: boolean;
  ip_hash: string;
  created_at: string;
};

export default function AdminContacts() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"inbox" | "starred" | "archived">("inbox");
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/contacts", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (res.status === 401) {
        setError("Unauthorized. Admin access required.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setContacts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'update' | 'delete', updates?: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action, id, updates })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Action failed");
      }

      // Optimistic UI update
      if (action === 'update') {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      } else if (action === 'delete') {
        setContacts(prev => prev.filter(c => c.id !== id));
      }

      if (updates?.is_archived !== undefined) {
        addToast(updates.is_archived ? "Message archived." : "Message moved to inbox.", "success");
      }
    } catch (err: any) {
      addToast(err.message, "error");
      fetchContacts(); // revert on error
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (filter === "archived") return c.is_archived;
    if (filter === "starred") return c.is_starred && !c.is_archived;
    return !c.is_archived; // inbox
  });

  if (loading) return <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>;

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h1 className="title" style={{ color: "#d93025" }}>Access Denied</h1>
        <p style={{ marginTop: "1rem" }}>{error}</p>
        <Link href="/admin" className="btn btn-color-2" style={{ marginTop: "2rem", display: "inline-block" }}>Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Messages</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage contact form submissions.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button onClick={() => setFilter("inbox")} className={`admin-btn ${filter === "inbox" ? "admin-btn-primary" : "admin-btn-secondary"}`}>Inbox</button>
        <button onClick={() => setFilter("starred")} className={`admin-btn ${filter === "starred" ? "admin-btn-primary" : "admin-btn-secondary"}`}>Starred</button>
        <button onClick={() => setFilter("archived")} className={`admin-btn ${filter === "archived" ? "admin-btn-primary" : "admin-btn-secondary"}`}>Archived</button>
      </div>

      <div className="admin-table-container" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
          <thead>
            <tr style={{ background: "var(--admin-card-hover)", textAlign: "left" }}>
              <th style={{ padding: "1rem", borderBottom: "1px solid var(--admin-border)", width: "50px" }}></th>
              <th style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--admin-border)", width: "25%", color: "var(--admin-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>Sender</th>
              <th style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--admin-border)", color: "var(--admin-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>Message</th>
              <th style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--admin-border)", width: "15%", color: "var(--admin-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>Date</th>
              <th style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--admin-border)", width: "15%", color: "var(--admin-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--admin-border)", background: c.is_read ? "transparent" : "var(--admin-card-hover)", transition: "background-color 0.2s ease" }}>
                <td style={{ padding: "1.5rem", textAlign: "center" }}>
                  <button 
                    onClick={() => handleAction(c.id, 'update', { is_starred: !c.is_starred })}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: c.is_starred ? "#fbbc04" : "var(--admin-text-muted)" }}
                    title={c.is_starred ? "Unstar" : "Star"}
                  >
                    ★
                  </button>
                </td>
                <td style={{ padding: "1.5rem" }}>
                  <div style={{ fontWeight: c.is_read ? 500 : 600, color: "var(--admin-text-main)" }}>{c.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", fontWeight: "normal" }}>
                    <a href={`mailto:${c.email}`} style={{ color: "inherit", textDecoration: "none" }}>{c.email}</a>
                  </div>
                  {c.company && <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", fontWeight: "normal" }}>🏢 {c.company}</div>}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem", fontWeight: "normal" }}>
                    {c.linkedin_url && <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}>LinkedIn</a>}
                    {c.github_url && <a href={c.github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "var(--admin-text-main)", textDecoration: "none", fontWeight: 500 }}>GitHub</a>}
                  </div>
                </td>
                <td style={{ padding: "1.5rem" }}>
                  <div style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", fontWeight: "normal" }}>
                    <span className="admin-badge neutral" style={{ backgroundColor: "var(--admin-card-hover)", color: "var(--admin-text-main)" }}>{c.purpose}</span>
                    {c.source_type && c.source_type !== "general" && (
                      <span className="admin-badge neutral" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                        From {c.source_type}: {c.source_slug || "Page"}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5, wordBreak: "break-word", color: "var(--admin-text-main)", fontWeight: c.is_read ? "normal" : 500 }}>{c.message}</p>
                </td>
                <td style={{ padding: "1.5rem", fontSize: "0.85rem", color: "var(--admin-text-muted)", fontWeight: "normal" }}>
                  {new Date(c.created_at).toLocaleDateString()}
                  <br />
                  {new Date(c.created_at).toLocaleTimeString()}
                </td>
                <td style={{ padding: "1.5rem", fontWeight: "normal" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <button 
                      onClick={() => handleAction(c.id, 'update', { is_read: !c.is_read })}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: "0.4rem", fontSize: "0.8rem", width: "100%" }}
                    >
                      Mark {c.is_read ? "Unread" : "Read"}
                    </button>
                    {c.is_archived ? (
                      <button 
                        onClick={() => handleAction(c.id, 'update', { is_archived: false })}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: "0.4rem", fontSize: "0.8rem", color: "#f59e0b", borderColor: "#f59e0b", width: "100%" }}
                      >
                        Unarchive
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAction(c.id, 'update', { is_archived: true, is_read: true })}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: "0.4rem", fontSize: "0.8rem", width: "100%" }}
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
                  No messages found in {filter}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
