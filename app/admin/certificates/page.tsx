"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [issuer, setIssuer] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else fetchCertificates();
    };
    checkUser();
  }, [router]);

  const fetchCertificates = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("certificates").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (!error && data) setCertificates(data);
    setLoading(false);
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("certificates").insert([{
      title, date, issuer, pdf_url: pdfUrl, category, description, sort_order: parseInt(sortOrder) || 0, display_order: displayOrder ? parseInt(displayOrder) : null
    }]);

    if (error) {
      alert("Error adding certificate: " + error.message);
    } else {
      alert("Certificate added successfully!");
      setTitle(""); setDate(""); setIssuer(""); setPdfUrl(""); setCategory(""); setDescription(""); setSortOrder("0"); setDisplayOrder("");
      fetchCertificates();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      await supabase.from("certificates").delete().eq("id", id);
      fetchCertificates();
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ fontSize: "2rem" }}>Manage Certificates</h1>
        <Link href="/admin" className="btn btn-color-2">Back to Dashboard</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div className="details-container color-container" style={{ padding: "2rem", height: "fit-content" }}>
          <h2 style={{ marginBottom: "1rem" }}>Add New Certificate</h2>
          <form onSubmit={handleAddCertificate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
            <input placeholder="Date (e.g. May 2025)" value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle} />
            <input placeholder="Issuer (e.g. IEEE)" value={issuer} onChange={(e) => setIssuer(e.target.value)} required style={inputStyle} />
            <input placeholder="Category (e.g. Paper Presentation)" value={category} onChange={(e) => setCategory(e.target.value)} required style={inputStyle} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{...inputStyle, minHeight: "80px"}} />
            <input placeholder="PDF URL (e.g. /assets/cert.pdf)" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} required style={inputStyle} />
            <input type="number" placeholder="Sort Order (e.g. 1)" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Display Order (Home)" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} style={inputStyle} />
            <button type="submit" className="btn btn-color-1">Add Certificate</button>
          </form>
        </div>

        <div>
          <h2 style={{ marginBottom: "1rem" }}>Existing Certificates</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {certificates.map((c) => (
              <div key={c.id} className="details-container color-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.9rem", color: "gray" }}>Issuer: {c.issuer} | {c.date}</p>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.9rem", color: "gray" }}>Sort:</span>
                      <input 
                        type="number" 
                        defaultValue={c.sort_order || 0}
                        onBlur={async (e) => {
                          const newSort = parseInt(e.target.value) || 0;
                          if (newSort !== (c.sort_order || 0)) {
                            const { error } = await supabase.from("certificates").update({ sort_order: newSort }).eq("id", c.id);
                            if (error) alert("Error: " + error.message);
                            else { alert("Sort order updated"); fetchCertificates(); }
                          }
                        }}
                        style={{ width: "60px", padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(255,255,255,0.1)", color: "inherit", border: "1px solid #ccc" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.9rem", color: "gray" }}>Display:</span>
                      <input 
                        type="number" 
                        placeholder="-"
                        defaultValue={c.display_order ?? ""}
                        onBlur={async (e) => {
                          const val = e.target.value;
                          const newOrder = val === "" ? null : parseInt(val);
                          if (newOrder !== (c.display_order ?? null)) {
                            const { error } = await supabase.from("certificates").update({ display_order: newOrder }).eq("id", c.id);
                            if (error) alert("Error: " + error.message);
                            else { alert(newOrder === null ? "Removed from Homepage" : "Display order updated"); fetchCertificates(); }
                          }
                        }}
                        style={{ width: "60px", padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(255,255,255,0.1)", color: "inherit", border: "1px solid #ccc" }}
                      />
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(c.id)} className="btn btn-color-2" style={{ color: "red", borderColor: "red" }}>Delete</button>
              </div>
            ))}
            {certificates.length === 0 && <p>No certificates found. Add one!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc", background: "transparent", color: "inherit"
};
