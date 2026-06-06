"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, ExternalLink, Info } from "lucide-react";
import AdminDrawer from "@/components/AdminDrawer";
import Tooltip from "@/components/admin/Tooltip";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const router = useRouter();
  const { addToast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [issuer, setIssuer] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Published");
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, [router]);

  const fetchCertificates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .or('is_archived.is.null,is_archived.eq.false')
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
      
    if (!error && data) setCertificates(data);
    setLoading(false);
  };

  const openDrawerForNew = () => {
    setEditingId(null);
    setTitle(""); setDate(""); setIssuer(""); setPdfUrl(""); 
    setCategory(""); setDescription(""); setStatus("Published");
    setSortOrder("0"); setDisplayOrder("");
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (cert: any) => {
    setEditingId(cert.id);
    setTitle(cert.title || "");
    setDate(cert.date || "");
    setIssuer(cert.issuer || "");
    setPdfUrl(cert.pdf_url || "");
    setCategory(cert.category || "");
    setDescription(cert.description || "");
    setStatus(cert.status || "Published");
    setSortOrder((cert.sort_order || 0).toString());
    setDisplayOrder(cert.display_order !== null ? cert.display_order.toString() : "");
    setDrawerOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `certificates/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file);

    if (uploadError) {
      addToast("Upload failed: Make sure 'portfolio-media' bucket exists and is public.", "error");
      console.error(uploadError);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);
      
      setPdfUrl(publicUrl);
    }
  };

  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const certData = {
      title, date, issuer, pdf_url: pdfUrl, category, description, status, sort_order: parseInt(sortOrder) || 0, display_order: displayOrder ? parseInt(displayOrder) : null
    };

    let error;

    if (editingId) {
      const res = await supabase.from("certificates").update(certData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("certificates").insert([{ ...certData, is_archived: false }]);
      error = res.error;
    }

    if (error) {
      addToast("Error saving certificate: " + error.message, "error");
    } else {
      addToast(`Certificate ${editingId ? "updated" : "added"} successfully!`, "success");
      setDrawerOpen(false);
      fetchCertificates();
    }
  };

  const handleSoftDelete = (id: string) => {
    setDeleteItem(id);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    await supabase.from("certificates").update({ is_archived: true }).eq("id", deleteItem);
    fetchCertificates();
    addToast("Certificate moved to trash", "success");
    setDeleteItem(null);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading certificates...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Certificates</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage your achievements and certifications.
          </p>
        </div>
        <button onClick={openDrawerForNew} className="admin-btn admin-btn-primary">
          <Plus size={16} style={{ marginRight: "0.5rem" }} />
          Add Certificate
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
          <div>Certificate</div>
          <div>Issuer</div>
          <div>Display</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        
        {certificates.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>No active certificates found.</div>
        ) : (
          certificates.map((c) => (
            <div key={c.id} className="admin-table-row" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
              <div>
                <div style={{ fontWeight: 500 }}>
                  {c.title}
                  {c.status === "Draft" && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", padding: "0.1rem 0.4rem", borderRadius: "10px", backgroundColor: "rgba(107, 114, 128, 0.1)", color: "var(--admin-text-main)", fontWeight: 400 }}>Draft</span>}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>{c.category} • {c.date}</div>
              </div>
              
              <div>
                <span className="admin-badge neutral" style={{ backgroundColor: "var(--admin-card-hover)", color: "var(--admin-text-main)" }}>
                  {c.issuer}
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip content="Sort Order">
                  <input 
                    type="number" 
                    min="0"
                    defaultValue={c.sort_order || 0}
                    onBlur={async (e) => {
                      const newSort = parseInt(e.target.value) || 0;
                      if (newSort !== (c.sort_order || 0)) {
                        await supabase.from("certificates").update({ sort_order: Math.max(0, newSort) }).eq("id", c.id);
                        fetchCertificates();
                      }
                    }}
                    style={{ width: "45px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                  />
                </Tooltip>
                <Tooltip content="Home Display Order">
                  <input 
                    type="number" 
                    min="0"
                    placeholder="-"
                    defaultValue={c.display_order ?? ""}
                    onBlur={async (e) => {
                      const val = e.target.value;
                      const newDisplay = val === "" ? null : parseInt(val);
                      if (newDisplay !== c.display_order) {
                        await supabase.from("certificates").update({ display_order: newDisplay !== null ? Math.max(0, newDisplay) : null }).eq("id", c.id);
                        fetchCertificates();
                      }
                    }}
                    style={{ width: "45px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--admin-border)", background: "transparent", color: "inherit", fontSize: "0.85rem" }}
                  />
                </Tooltip>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                {c.pdf_url && (
                  <Tooltip content="View Credential">
                    <a href={c.pdf_url} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary" style={{ padding: "0.4rem" }}>
                      <ExternalLink size={16} />
                    </a>
                  </Tooltip>
                )}
                <Tooltip content="Edit Certificate">
                  <button onClick={() => openDrawerForEdit(c)} className="admin-btn admin-btn-secondary" style={{ padding: "0.4rem" }}>
                    <Edit2 size={16} />
                  </button>
                </Tooltip>
                <Tooltip content="Move to Trash" position="top">
                  <button onClick={() => handleSoftDelete(c.id)} className="admin-btn admin-btn-danger" style={{ padding: "0.4rem" }}>
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingId ? "Edit Certificate" : "New Certificate"}>
        <form onSubmit={handleSaveCertificate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Certificate Title</label>
            <input placeholder="E.g. AWS Certified Solutions Architect" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Date Issued</label>
              <input placeholder="e.g. May 2025" value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Issuer</label>
              <input placeholder="e.g. Amazon Web Services" value={issuer} onChange={(e) => setIssuer(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Category</label>
            <input placeholder="e.g. Cloud Computing, Paper Presentation" value={category} onChange={(e) => setCategory(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Description</label>
            <textarea placeholder="Brief details about the certificate..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{...inputStyle, minHeight: "80px", resize: "vertical"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>File/PDF URL</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input placeholder="File URL (or upload via button)" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} required style={{...inputStyle, flex: 1}} />
              <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ExternalLink size={16} />
                Upload
                <input type="file" accept="application/pdf,image/*" onChange={handleFileUpload} style={{ display: "none" }} />
              </label>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                Global Sort Order
                <Tooltip content="Lower numbers appear first">
                  <Info size={14} style={{ color: "var(--admin-text-muted)", cursor: "help" }} />
                </Tooltip>
              </label>
              <input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                Home Display
                <Tooltip content="Leave blank to hide from Homepage. Enter number to show.">
                  <Info size={14} style={{ color: "var(--admin-text-muted)", cursor: "help" }} />
                </Tooltip>
              </label>
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

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" onClick={() => setDrawerOpen(false)} className="admin-btn admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{editingId ? "Save Changes" : "Create Certificate"}</button>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmModal 
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Move to Trash"
        message="Are you sure you want to move this certificate to the trash?"
        confirmText="Move to Trash"
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
  color: "inherit",
  fontSize: "0.9rem"
};
