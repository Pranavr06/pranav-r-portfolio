"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, ExternalLink, Info, Camera, Upload, FolderOpen } from "lucide-react";
import AdminDrawer from "@/components/AdminDrawer";
import Tooltip from "@/components/admin/Tooltip";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";
import AssetPickerModal from "@/components/admin/AssetPickerModal";
import { slugify } from "@/lib/slug";
import { STATIC_CERTIFICATE_GALLERIES } from "@/lib/certificateGalleries";

const CERT_CATEGORIES = [
  { value: "course", label: "Courses" },
  { value: "hackathon", label: "Hackathons" },
  { value: "internship", label: "Internships" },
  { value: "webinar-workshop", label: "Webinars & Workshops" },
  { value: "govt-quiz", label: "Government Quizzes" },
];

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const router = useRouter();
  const { addToast } = useToast();

  // Assets Picker State
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<"logo" | "pdf" | "gallery">("logo");
  const [assetList, setAssetList] = useState<{ logos: any[]; documents: any[]; images: any[] }>({
    logos: [],
    documents: [],
    images: [],
  });

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState("");
  const [issuer, setIssuer] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [experienceUrl, setExperienceUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; caption?: string }>>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");
  const [category, setCategory] = useState("course");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Published");
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    fetchCertificates();
    fetchAssets();
  }, [router]);

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/admin/assets");
      if (res.ok) {
        const data = await res.json();
        setAssetList({
          logos: data.logos || [],
          documents: data.documents || [],
          images: data.images || [],
        });
      }
    } catch (e) {
      // ignore
    }
  };

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
    setTitle(""); setSlug(""); setImageUrl(""); setDate(""); setIssuer(""); setPdfUrl(""); 
    setExperienceUrl(""); setProjectUrl(""); setGalleryTitle("");
    setGalleryImages([]); setNewImageUrl(""); setNewImageCaption("");
    setCategory("course"); setDescription(""); setStatus("Published");
    setSortOrder("0"); setDisplayOrder("");
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (cert: any) => {
    setEditingId(cert.id);
    setTitle(cert.title || "");
    setSlug(cert.slug || slugify(cert.title || ""));
    setImageUrl(cert.image_url || "");
    setDate(cert.date || "");
    setIssuer(cert.issuer || "");
    setPdfUrl(cert.pdf_url || "");
    setExperienceUrl(cert.experience_url || "");
    setProjectUrl(cert.project_url || "");
    setGalleryTitle(cert.gallery_title || "");
    setCategory(cert.category || "");
    setDescription(cert.description || "");
    setStatus(cert.status || "Published");
    setSortOrder((cert.sort_order || 0).toString());
    setDisplayOrder(cert.display_order !== null ? cert.display_order.toString() : "");

    // Load gallery images
    let initialGallery: Array<{ url: string; caption?: string }> = [];
    if (cert.gallery_images) {
      if (Array.isArray(cert.gallery_images)) {
        initialGallery = cert.gallery_images
          .map((item: any) =>
            typeof item === "string" ? { url: item, caption: "" } : { url: item?.url || "", caption: item?.caption || "" }
          )
          .filter((item: any) => Boolean(item.url));
      } else if (typeof cert.gallery_images === "string") {
        try {
          const parsed = JSON.parse(cert.gallery_images);
          if (Array.isArray(parsed)) {
            initialGallery = parsed
              .map((item: any) =>
                typeof item === "string" ? { url: item, caption: "" } : { url: item?.url || "", caption: item?.caption || "" }
              )
              .filter((item: any) => Boolean(item.url));
          }
        } catch {
          // ignore
        }
      }
    } else if (cert.slug && STATIC_CERTIFICATE_GALLERIES[cert.slug]) {
      initialGallery = STATIC_CERTIFICATE_GALLERIES[cert.slug].map((i) => ({
        url: i.url,
        caption: i.caption || "",
      }));
    }
    setGalleryImages(initialGallery);
    setNewImageUrl("");
    setNewImageCaption("");
    setDrawerOpen(true);
  };

  const handleAddGalleryImage = () => {
    if (!newImageUrl.trim()) return;
    setGalleryImages((prev) => [
      ...prev,
      { url: newImageUrl.trim(), caption: newImageCaption.trim() },
    ]);
    setNewImageUrl("");
    setNewImageCaption("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGalleryCaptionChange = (index: number, caption: string) => {
    setGalleryImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `gallery_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
    const filePath = `certificates/gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file);

    if (uploadError) {
      addToast("Upload failed: Make sure 'portfolio-media' bucket exists and is public.", "error");
      console.error(uploadError);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);
      
      setGalleryImages((prev) => [...prev, { url: publicUrl, caption: "" }]);
      addToast("Photo added to gallery!", "success");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `logo_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;
    const filePath = `certificates/logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file);

    if (uploadError) {
      addToast("Logo upload failed: Make sure 'portfolio-media' bucket exists and is public.", "error");
      console.error(uploadError);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      addToast("Certificate logo uploaded!", "success");
    }
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
    
    const computedSlug = slug.trim() || slugify(title);
    const certData: any = {
      title, 
      slug: computedSlug,
      image_url: imageUrl.trim() || null,
      date, 
      issuer, 
      pdf_url: pdfUrl, 
      gallery_title: galleryTitle.trim() || null,
      gallery_images: galleryImages,
      experience_url: experienceUrl.trim() || null,
      project_url: projectUrl.trim() || null,
      category, 
      description, 
      status, 
      sort_order: parseInt(sortOrder) || 0, 
      display_order: displayOrder ? parseInt(displayOrder) : null
    };

    let error;

    if (editingId) {
      let res = await supabase.from("certificates").update(certData).eq("id", editingId);
      error = res.error;
      // If gallery_title column does not exist yet in DB schema, fallback gracefully
      if (error && error.message?.includes("'gallery_title'")) {
        delete certData.gallery_title;
        res = await supabase.from("certificates").update(certData).eq("id", editingId);
        error = res.error;
      }
      // If gallery_images column does not exist yet in DB schema, fallback gracefully
      if (error && error.message?.includes("'gallery_images'")) {
        delete certData.gallery_images;
        res = await supabase.from("certificates").update(certData).eq("id", editingId);
        error = res.error;
      }
      // If slug column does not exist yet in DB schema, fallback gracefully
      if (error && error.message?.includes("'slug'")) {
        delete certData.slug;
        const retryRes = await supabase.from("certificates").update(certData).eq("id", editingId);
        error = retryRes.error;
      }
    } else {
      let res = await supabase.from("certificates").insert([{ ...certData, is_archived: false }]);
      error = res.error;
      if (error && error.message?.includes("'gallery_title'")) {
        delete certData.gallery_title;
        res = await supabase.from("certificates").insert([{ ...certData, is_archived: false }]);
        error = res.error;
      }
      if (error && error.message?.includes("'gallery_images'")) {
        delete certData.gallery_images;
        res = await supabase.from("certificates").insert([{ ...certData, is_archived: false }]);
        error = res.error;
      }
      if (error && error.message?.includes("'slug'")) {
        delete certData.slug;
        const retryRes = await supabase.from("certificates").insert([{ ...certData, is_archived: false }]);
        error = retryRes.error;
      }
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

  const displayedCertificates = certificates.filter(
    (c) => filterCategory === "All" || c.category === filterCategory
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Certificates</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Manage your achievements and certifications.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ ...inputStyle, width: "auto", minWidth: "180px", cursor: "pointer" }}
            aria-label="Filter certificates by category"
          >
            <option value="All">All Categories ({certificates.length})</option>
            {CERT_CATEGORIES.map((cat) => {
              const count = certificates.filter(c => c.category === cat.value).length;
              return (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({count})
                </option>
              );
            })}
          </select>
          <button onClick={openDrawerForNew} className="admin-btn admin-btn-primary">
            <Plus size={16} style={{ marginRight: "0.5rem" }} />
            Add Certificate
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
          <div>Certificate</div>
          <div>Issuer</div>
          <div>Display</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        
        {displayedCertificates.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
            {certificates.length === 0 ? "No active certificates found." : "No certificates found in this category."}
          </div>
        ) : (
          displayedCertificates.map((c) => (
            <div key={c.id} className="admin-table-row" style={{ gridTemplateColumns: "3fr 1fr 1fr 1.5fr" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {c.image_url ? (
                  <img 
                    src={c.image_url} 
                    alt="Logo" 
                    style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "6px", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--admin-border)", padding: "2px", flexShrink: 0 }} 
                  />
                ) : (
                  <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px dashed var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.65rem", color: "var(--admin-text-muted)" }}>
                    —
                  </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>
                    {c.title}
                    {c.status === "Draft" && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", padding: "0.1rem 0.4rem", borderRadius: "10px", backgroundColor: "rgba(107, 114, 128, 0.1)", color: "var(--admin-text-main)", fontWeight: 400 }}>Draft</span>}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    /{c.slug || slugify(c.title)} • {CERT_CATEGORIES.find(cat => cat.value === c.category)?.label || c.category} • {c.date}
                  </div>
                </div>
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
                <Tooltip content="View Certificate Page">
                  <a href={`/certificates/${c.slug || slugify(c.title)}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary" style={{ padding: "0.4rem" }}>
                    <ExternalLink size={16} />
                  </a>
                </Tooltip>
                {c.pdf_url && (
                  <Tooltip content="View Credential File">
                    <a href={c.pdf_url} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary" style={{ padding: "0.4rem", fontSize: "0.75rem" }}>
                      PDF
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
            <input 
              placeholder="E.g. AWS Certified Solutions Architect" 
              value={title} 
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingId) setSlug(slugify(e.target.value));
              }} 
              required 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>URL Slug (ID)</label>
            <input 
              placeholder="e.g. gyan-vigyan-quiz-certification" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              required 
              style={inputStyle} 
            />
            <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
              Link: /certificates/{slug || slugify(title) || 'certificate-title'}
            </span>
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
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required 
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="" disabled>Select a category</option>
              {CERT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
              {category && !CERT_CATEGORIES.some(c => c.value === category) && (
                <option value={category}>{category}</option>
              )}
            </select>
          </div>

          {/* Certificate Logo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              Certificate Logo / Organization Icon
              <Tooltip content="Organization thumbnail logo displayed on certificates page and detail card (image_url in database).">
                <Info size={14} style={{ color: "var(--admin-text-muted)", cursor: "help" }} />
              </Tooltip>
            </label>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              {imageUrl ? (
                <div style={{ width: "42px", height: "42px", borderRadius: "8px", border: "1px solid var(--admin-border)", padding: "3px", backgroundColor: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={imageUrl} alt="Logo preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>
              ) : (
                <div style={{ width: "42px", height: "42px", borderRadius: "8px", border: "1px dashed var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.65rem", color: "var(--admin-text-muted)", textAlign: "center" }}>
                  No Logo
                </div>
              )}
              <input 
                list="asset-cert-logos"
                placeholder="e.g. /assets/SIH-logo.webp (or pick/upload)" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                style={{ ...inputStyle, flex: 1 }} 
              />
              <button
                type="button"
                onClick={() => { setAssetPickerTarget("logo"); setAssetPickerOpen(true); }}
                className="admin-btn admin-btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}
                title="Browse and pick from /public/assets"
              >
                <FolderOpen size={14} />
                Assets
              </button>
              <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}>
                <Upload size={14} />
                Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Description</label>
            <textarea placeholder="Brief details about the certificate..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{...inputStyle, minHeight: "80px", resize: "vertical"}} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>File/PDF URL</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                list="asset-cert-docs"
                placeholder="File URL (e.g. /assets/AIC-certificate.pdf or upload)" 
                value={pdfUrl} 
                onChange={(e) => setPdfUrl(e.target.value)} 
                required 
                style={{...inputStyle, flex: 1}} 
              />
              <button
                type="button"
                onClick={() => { setAssetPickerTarget("pdf"); setAssetPickerOpen(true); }}
                className="admin-btn admin-btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}
                title="Browse and pick PDF/document from /public/assets"
              >
                <FolderOpen size={14} />
                Assets
              </button>
              <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Upload size={14} />
                Upload
                <input type="file" accept="application/pdf,image/*" onChange={handleFileUpload} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Linked Experience URL (Optional)</label>
              <input 
                placeholder="e.g. /experiences/professional-journey/..." 
                value={experienceUrl} 
                onChange={(e) => setExperienceUrl(e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--admin-text-main)" }}>Linked Project URL (Optional)</label>
              <input 
                placeholder="e.g. /projects/college-projects/..." 
                value={projectUrl} 
                onChange={(e) => setProjectUrl(e.target.value)} 
                style={inputStyle} 
              />
            </div>
          </div>

          {/* Gallery Images Management */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1px solid var(--admin-border)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Camera size={16} /> Event Photos / Image Gallery ({galleryImages.length})
              </label>
              <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer", fontSize: "0.8rem", padding: "0.3rem 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Upload size={14} />
                Upload Photo
                <input type="file" accept="image/*" onChange={handleGalleryFileUpload} style={{ display: "none" }} />
              </label>
            </div>

            {/* Custom Gallery Heading */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--admin-text-main)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                Gallery Section Heading (Optional)
                <Tooltip content="Custom title to replace 'Event Photos & Highlights' on the certificate page">
                  <Info size={14} style={{ color: "var(--admin-text-muted)", cursor: "help" }} />
                </Tooltip>
              </label>
              <input 
                placeholder="Default: Event Photos & Highlights (e.g. Ideathon Moments & Presentation)"
                value={galleryTitle}
                onChange={(e) => setGalleryTitle(e.target.value)}
                style={{ ...inputStyle, fontSize: "0.85rem" }}
              />
            </div>

            {/* Existing images list */}
            {galleryImages.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {galleryImages.map((img, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--admin-border)", background: "rgba(255, 255, 255, 0.02)" }}>
                    <img src={img.url} alt="Thumbnail" style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
                    <input 
                      placeholder="Photo caption (e.g. Team presenting at hackathon)" 
                      value={img.caption || ""} 
                      onChange={(e) => handleGalleryCaptionChange(idx, e.target.value)} 
                      style={{ ...inputStyle, flex: 1, fontSize: "0.82rem", padding: "0.35rem 0.6rem" }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveGalleryImage(idx)} 
                      className="admin-btn admin-btn-danger" 
                      style={{ padding: "0.35rem" }}
                      title="Remove photo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add image URL manually */}
            {/* Add image URL manually */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input 
                list="asset-cert-images"
                placeholder="Or paste image URL (e.g. /assets/night-group-selfie.webp)" 
                value={newImageUrl} 
                onChange={(e) => setNewImageUrl(e.target.value)} 
                style={{ ...inputStyle, flex: 2, fontSize: "0.82rem" }} 
              />
              <button
                type="button"
                onClick={() => { setAssetPickerTarget("gallery"); setAssetPickerOpen(true); }}
                className="admin-btn admin-btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", padding: "0.45rem 0.65rem", whiteSpace: "nowrap" }}
                title="Browse photos from /public/assets"
              >
                <FolderOpen size={13} />
                Assets
              </button>
              <input 
                placeholder="Caption (optional)" 
                value={newImageCaption} 
                onChange={(e) => setNewImageCaption(e.target.value)} 
                style={{ ...inputStyle, flex: 2, fontSize: "0.82rem" }} 
              />
              <button 
                type="button" 
                onClick={handleAddGalleryImage} 
                className="admin-btn admin-btn-secondary" 
                style={{ fontSize: "0.82rem", whiteSpace: "nowrap", padding: "0.45rem 0.9rem" }}
              >
                Add Photo
              </button>
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
                <option value="Unpublished">Unpublished</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" onClick={() => setDrawerOpen(false)} className="admin-btn admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">{editingId ? "Save Changes" : "Create Certificate"}</button>
          </div>
        </form>
      </AdminDrawer>

      {/* Datalists for instant browser autocompletion */}
      <datalist id="asset-cert-logos">
        {assetList.logos.map((a: any) => (
          <option key={a.path} value={a.path}>{a.name}</option>
        ))}
      </datalist>
      <datalist id="asset-cert-docs">
        {assetList.documents.map((a: any) => (
          <option key={a.path} value={a.path}>{a.name}</option>
        ))}
      </datalist>
      <datalist id="asset-cert-images">
        {assetList.images.map((a: any) => (
          <option key={a.path} value={a.path}>{a.name}</option>
        ))}
      </datalist>

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        defaultCategory={
          assetPickerTarget === "logo" ? "logos" : assetPickerTarget === "pdf" ? "documents" : "images"
        }
        title={
          assetPickerTarget === "logo"
            ? "Select Certificate Logo / Organization Icon"
            : assetPickerTarget === "pdf"
            ? "Select Certificate PDF / Document"
            : "Select Gallery Photo"
        }
        onSelect={(selectedPath) => {
          if (assetPickerTarget === "logo") {
            setImageUrl(selectedPath);
          } else if (assetPickerTarget === "pdf") {
            setPdfUrl(selectedPath);
          } else if (assetPickerTarget === "gallery") {
            setNewImageUrl(selectedPath);
          }
        }}
      />

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
