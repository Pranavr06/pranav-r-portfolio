"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function AdminTestimonials() {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

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

      // Refresh list
      fetchTestimonials();
      addToast(action === 'delete' ? "Testimonial deleted" : "Testimonial updated", "success");
    } catch (err: any) {
      addToast(err.message, "error");
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
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ fontSize: "2rem" }}>Manage Testimonials</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin/testimonials/new" className="btn btn-color-1">Add Testimonial</Link>
          <Link href="/admin" className="btn btn-color-2">Back to Dashboard</Link>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.05)", textAlign: "left" }}>
              <th style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>User</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>Message</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>Status</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "1rem" }}>
                  <strong>{t.name}</strong>
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "gray" }}>{t.role}</span>
                  <br />
                  <span style={{ fontSize: "0.85rem", color: "gray" }}>{t.email}</span>
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                    {t.linkedin_url && <a href={t.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "#0a66c2", fontSize: "0.8rem" }}>LinkedIn</a>}
                    {t.github_url && <a href={t.github_url} target="_blank" rel="noopener noreferrer" style={{ color: "#333", fontSize: "0.8rem" }}>GitHub</a>}
                  </div>
                </td>
                <td style={{ padding: "1rem", maxWidth: "300px" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5, wordBreak: "break-word" }}>{t.message}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "gray", marginTop: "0.5rem" }}>
                    IP Hash: {t.ip_hash ? `${t.ip_hash.substring(0, 8)}...` : 'N/A'}
                  </p>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <span style={{ padding: "0.2rem 0.5rem", borderRadius: "0.3rem", fontSize: "0.8rem", background: t.is_approved ? "rgba(24, 128, 56, 0.1)" : "rgba(217, 48, 37, 0.1)", color: t.is_approved ? "#188038" : "#d93025", alignSelf: "flex-start" }}>
                      {t.is_approved ? "Approved" : "Pending"}
                    </span>
                    {t.is_verified && <span style={{ padding: "0.2rem 0.5rem", borderRadius: "0.3rem", fontSize: "0.8rem", background: "rgba(10, 102, 194, 0.1)", color: "#0a66c2", alignSelf: "flex-start" }}>Verified LinkedIn</span>}
                    {t.is_github_verified && <span style={{ padding: "0.2rem 0.5rem", borderRadius: "0.3rem", fontSize: "0.8rem", background: "rgba(51, 51, 51, 0.1)", color: "#333", alignSelf: "flex-start" }}>Verified GitHub</span>}
                    
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "gray" }}>Sort:</span>
                      <input 
                        type="number" 
                        defaultValue={t.sort_order || 0}
                        onBlur={async (e) => {
                          const newSort = parseInt(e.target.value) || 0;
                          if (newSort !== (t.sort_order || 0)) {
                            handleAction(t.id, 'update', { sort_order: newSort });
                          }
                        }}
                        style={{ width: "50px", padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(0,0,0,0.05)", color: "inherit", border: "1px solid #ccc" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "gray" }}>Home Display:</span>
                      <input 
                        type="number" 
                        placeholder="-"
                        defaultValue={t.display_order ?? ""}
                        onBlur={async (e) => {
                          const val = e.target.value;
                          const newOrder = val === "" ? null : parseInt(val);
                          if (newOrder !== (t.display_order ?? null)) {
                            handleAction(t.id, 'update', { display_order: newOrder });
                          }
                        }}
                        style={{ width: "50px", padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(0,0,0,0.05)", color: "inherit", border: "1px solid #ccc" }}
                      />
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", maxWidth: "250px" }}>
                    <button 
                      onClick={() => handleAction(t.id, 'update', { is_approved: !t.is_approved })}
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", background: t.is_approved ? "#f1f3f4" : "#188038", color: t.is_approved ? "#333" : "#fff", border: "none", borderRadius: "0.2rem", cursor: "pointer" }}
                    >
                      {t.is_approved ? "Unapprove" : "Approve"}
                    </button>
                    <button 
                      onClick={() => handleAction(t.id, 'update', { is_verified: !t.is_verified })}
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", background: t.is_verified ? "#f1f3f4" : "#0a66c2", color: t.is_verified ? "#333" : "#fff", border: "none", borderRadius: "0.2rem", cursor: "pointer" }}
                    >
                      {t.is_verified ? "Unverify LI" : "Verify LinkedIn"}
                    </button>
                    {t.github_url && (
                      <button 
                        onClick={() => handleAction(t.id, 'update', { is_github_verified: !t.is_github_verified })}
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", background: t.is_github_verified ? "#f1f3f4" : "#333", color: t.is_github_verified ? "#333" : "#fff", border: "none", borderRadius: "0.2rem", cursor: "pointer" }}
                      >
                        {t.is_github_verified ? "Unverify GH" : "Verify GitHub"}
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        sessionStorage.setItem("editTestimonial", JSON.stringify(t));
                        router.push("/admin/testimonials/new");
                      }}
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", background: "#fbbc04", color: "#333", border: "none", borderRadius: "0.2rem", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to permanently delete this testimonial?")) {
                          handleAction(t.id, 'delete');
                        }
                      }}
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", background: "#d93025", color: "#fff", border: "none", borderRadius: "0.2rem", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "2rem", textAlign: "center" }}>No testimonials found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
