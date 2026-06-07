"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import AdminDrawer from "@/components/AdminDrawer";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminTestimonials() {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isGithubVerified, setIsGithubVerified] = useState(false);
  const [status, setStatus] = useState("Published");
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/testimonials", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (res.status === 401) {
        setError("Unauthorized. You must be an authorized admin to view this page.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch testimonials");

      const data = await res.json();
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDrawerForNew = () => {
    setEditingId(null);
    setName(""); setRole(""); setEmail(""); setMessage(""); 
    setLinkedinUrl(""); setGithubUrl("");
    setIsApproved(true); setIsVerified(false); setIsGithubVerified(false);
    setStatus("Published");
    setSortOrder("0"); setDisplayOrder("");
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (t: any) => {
    setEditingId(t.id);
    setName(t.name || "");
    setRole(t.role || "");
    setEmail(t.email || "");
    setMessage(t.message || "");
    setLinkedinUrl(t.linkedin_url || "");
    setGithubUrl(t.github_url || "");
    setIsApproved(t.is_approved || false);
    setIsVerified(t.is_verified || false);
    setIsGithubVerified(t.is_github_verified || false);
    setStatus(t.status || "Published");
    setSortOrder((t.sort_order || 0).toString());
    setDisplayOrder(t.display_order !== null ? t.display_order.toString() : "");
    setDrawerOpen(true);
  };

  const handleAction = async (id: string, action: 'update' | 'delete', updates?: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/admin/testimonials", {
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

      fetchTestimonials();
      addToast(action === 'delete' ? "Testimonial deleted" : "Testimonial updated", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const tData = {
      name, role, email, message, linkedin_url: linkedinUrl, github_url: githubUrl, 
      is_approved: isApproved, is_verified: isVerified, is_github_verified: isGithubVerified,
      status, sort_order: parseInt(sortOrder) || 0, display_order: displayOrder ? parseInt(displayOrder) : null
    };

    if (editingId) {
      await handleAction(editingId, 'update', tData);
      setDrawerOpen(false);
    } else {
      // Create new testimonial directly via supabase (bypassing /api/admin/testimonials POST since it doesn't handle inserts)
      const { error } = await supabase.from("testimonials").insert([{ ...tData, ip_hash: "admin-manual-entry" }]);
      if (error) {
        addToast("Error adding testimonial: " + error.message, "error");
      } else {
        addToast("Testimonial created", "success");
        setDrawerOpen(false);
        fetchTestimonials();
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "80vh", textAlign: "center" }}>
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
          <h1 className="admin-page-title">Testimonials</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Review and approve user testimonials.
          </p>
        </div>
        <button onClick={openDrawerForNew} className="admin-btn admin-btn-primary">Add Testimonial</button>
      </div>

      <div className="admin-table-container" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
          <thead>
            <tr style={{ background: "var(--admin-card-hover)", textAlign: "left" }}>
              <th style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--admin-border)", color: "var(--admin-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>User</th>
              <th style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--admin-border)", color: "var(--admin-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>Message</th>
              <th style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--admin-border)", color: "var(--admin-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--admin-border)", color: "var(--admin-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid var(--admin-border)", transition: "background-color 0.2s ease" }}>
                <td style={{ padding: "1.5rem" }}>
                  <strong style={{ color: "var(--admin-text-main)" }}>{t.name}</strong>
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>{t.role}</span>
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>{t.email}</span>
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                    {t.linkedin_url && <a href={t.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "0.8rem", textDecoration: "none", fontWeight: 500 }}>LinkedIn</a>}
                    {t.github_url && <a href={t.github_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--admin-text-main)", fontSize: "0.8rem", textDecoration: "none", fontWeight: 500 }}>GitHub</a>}
                  </div>
                </td>
                <td style={{ padding: "1.5rem", maxWidth: "300px" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5, wordBreak: "break-word", color: "var(--admin-text-main)" }}>{t.message}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--admin-text-muted)", marginTop: "0.5rem" }}>
                    IP Hash: {t.ip_hash ? `${t.ip_hash.substring(0, 8)}...` : 'N/A'}
                  </p>
                </td>
                <td style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <span className={`admin-badge ${t.status === "Draft" ? "draft" : "published"}`} style={{ backgroundColor: t.status === "Draft" ? "rgba(107, 114, 128, 0.1)" : "rgba(59, 130, 246, 0.1)", color: t.status === "Draft" ? "var(--admin-text-main)" : "#3b82f6", alignSelf: "flex-start" }}>
                      {t.status || "Published"}
                    </span>
                    <span className={`admin-badge ${t.is_approved ? 'published' : 'draft'}`} style={{ alignSelf: "flex-start" }}>
                      {t.is_approved ? "Approved" : "Pending"}
                    </span>
                    {t.is_verified && <span className="admin-badge neutral" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", alignSelf: "flex-start" }}>Verified LinkedIn</span>}
                    {t.is_github_verified && <span className="admin-badge neutral" style={{ backgroundColor: "rgba(107, 114, 128, 0.1)", color: "var(--admin-text-main)", alignSelf: "flex-start" }}>Verified GitHub</span>}
                    
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>Sort:</span>
                      <input 
                        type="number" 
                        min="0"
                        defaultValue={t.sort_order || 0}
                        onBlur={async (e) => {
                          const newSort = parseInt(e.target.value) || 0;
                          if (newSort !== (t.sort_order || 0)) {
                            handleAction(t.id, 'update', { sort_order: Math.max(0, newSort) });
                          }
                        }}
                        style={{ width: "50px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>Display:</span>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="-"
                        defaultValue={t.display_order ?? ""}
                        onBlur={async (e) => {
                          const val = e.target.value;
                          const newOrder = val === "" ? null : Math.max(0, parseInt(val));
                          if (newOrder !== (t.display_order ?? null)) {
                            handleAction(t.id, 'update', { display_order: newOrder });
                          }
                        }}
                        style={{ width: "50px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      <button 
                        onClick={() => handleAction(t.id, 'update', { is_approved: !t.is_approved })}
                        className={`admin-btn ${t.is_approved ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                      >
                        {t.is_approved ? "Unapprove" : "Approve"}
                      </button>
                      <button 
                        onClick={() => handleAction(t.id, 'update', { is_verified: !t.is_verified })}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                      >
                        {t.is_verified ? "Unverify LinkedIn" : "Verify LinkedIn"}
                      </button>
                      {t.github_url && (
                        <button 
                          onClick={() => handleAction(t.id, 'update', { is_github_verified: !t.is_github_verified })}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                        >
                          {t.is_github_verified ? "Unverify GitHub" : "Verify GitHub"}
                        </button>
                      )}
                      <button 
                        onClick={() => openDrawerForEdit(t)}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteItem(t.id)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                      >
                        Delete
                      </button>
                    </div>
                </td>
              </tr>
            ))}
            
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No testimonials found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingId ? "Edit Testimonial" : "New Testimonial"}>
        <form onSubmit={handleSaveTestimonial} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Name</label>
              <input placeholder="E.g. Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Role/Title</label>
              <input placeholder="E.g. CEO at TechCorp" value={role} onChange={(e) => setRole(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Email</label>
            <input type="email" placeholder="E.g. jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Message</label>
            <textarea placeholder="Their actual testimonial..." value={message} onChange={(e) => setMessage(e.target.value)} required style={{...inputStyle, minHeight: "120px", resize: "vertical"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Links</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input placeholder="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} style={{...inputStyle, flex: 1}} />
              <input placeholder="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} style={{...inputStyle, flex: 1}} />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Global Sort Order</label>
              <input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Home Display</label>
              <input type="number" min="0" placeholder="-" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Status & Verification</label>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.25rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--admin-text-main)", cursor: "pointer" }}>
                <input type="checkbox" checked={isApproved} onChange={(e) => setIsApproved(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                Approved
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--admin-text-main)", cursor: "pointer" }}>
                <input type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                Verified LinkedIn
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--admin-text-main)", cursor: "pointer" }}>
                <input type="checkbox" checked={isGithubVerified} onChange={(e) => setIsGithubVerified(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                Verified GitHub
              </label>
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" onClick={() => setDrawerOpen(false)} className="admin-btn admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{editingId ? "Save Changes" : "Create Testimonial"}</button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmModal 
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem) handleAction(deleteItem, 'delete');
          setDeleteItem(null);
        }}
        title="Permanently Delete Testimonial"
        message="Are you sure you want to permanently delete this testimonial? This action cannot be undone."
        confirmText="Permanently Delete"
        isDestructive={true}
      />
    </div>
  );
}

const inputStyle = {
  width: "100%", 
  padding: "0.6rem 0.8rem", 
  borderRadius: "6px", 
  border: "1px solid var(--admin-border)", 
  background: "var(--admin-bg)", 
  color: "var(--admin-text-main)",
  fontSize: "0.9rem"
};
