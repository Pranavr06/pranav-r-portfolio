"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManageProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState("Completed");
  const [demoUrl, setDemoUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else fetchProjects();
    };
    checkUser();
  }, [router]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = techStack.split(",").map(t => t.trim());
    
    const { error } = await supabase.from("projects").insert([{
      title, description, content, image_url: imageUrl, tech_stack: techArray, status, demo_url: demoUrl, repo_url: repoUrl, slug, sort_order: parseInt(sortOrder) || 0, display_order: displayOrder ? parseInt(displayOrder) : null
    }]);

    if (error) {
      alert("Error adding project: " + error.message);
    } else {
      alert("Project added successfully!");
      setTitle(""); setDescription(""); setContent(""); setImageUrl(""); setTechStack(""); setDemoUrl(""); setRepoUrl(""); setSlug(""); setSortOrder("0"); setDisplayOrder("");
      fetchProjects();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await supabase.from("projects").delete().eq("id", id);
      fetchProjects();
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ fontSize: "2rem" }}>Manage Projects</h1>
        <Link href="/admin" className="btn btn-color-2">Back to Dashboard</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div className="details-container color-container" style={{ padding: "2rem", height: "fit-content" }}>
          <h2 style={{ marginBottom: "1rem" }}>Add New Project</h2>
          <form onSubmit={handleAddProject} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
            <input placeholder="Slug (e.g. my-project)" value={slug} onChange={(e) => setSlug(e.target.value)} required style={inputStyle} />
            <textarea placeholder="Description (short summary)" value={description} onChange={(e) => setDescription(e.target.value)} required style={{...inputStyle, minHeight: "60px"}} />
            <textarea placeholder="Content (Markdown)" value={content} onChange={(e) => setContent(e.target.value)} style={{...inputStyle, minHeight: "150px"}} />
            <input placeholder="Image URL (e.g. /assets/proj.webp)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required style={inputStyle} />
            <input placeholder="Tech Stack (comma separated)" value={techStack} onChange={(e) => setTechStack(e.target.value)} required style={inputStyle} />
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planned">Planned</option>
              <option value="Collection">Collection</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <input placeholder="Demo URL (optional)" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} style={inputStyle} />
            <input placeholder="Repo URL (optional)" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Sort Order (e.g. 1)" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Display Order (Home)" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} style={inputStyle} />
            <button type="submit" className="btn btn-color-1">Add Project</button>
          </form>
        </div>

        <div>
          <h2 style={{ marginBottom: "1rem" }}>Existing Projects</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {projects.map((p) => (
              <div key={p.id} className="details-container color-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3>{p.title}</h3>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                    <p style={{ fontSize: "0.9rem", color: "gray", margin: 0 }}>Status: </p>
                    <select 
                      defaultValue={p.status} 
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", p.id);
                        if (error) alert("Error: " + error.message);
                        else {
                          alert("Status updated to " + newStatus);
                          fetchProjects();
                        }
                      }}
                      style={{ padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(255,255,255,0.1)", color: "inherit", border: "1px solid #ccc" }}
                    >
                      <option value="Completed" style={{color: "black"}}>Completed</option>
                      <option value="In Progress" style={{color: "black"}}>In Progress</option>
                      <option value="Planned" style={{color: "black"}}>Planned</option>
                      <option value="Collection" style={{color: "black"}}>Collection</option>
                      <option value="College" style={{color: "black"}}>College</option>
                      <option value="1st Year" style={{color: "black"}}>1st Year</option>
                      <option value="2nd Year" style={{color: "black"}}>2nd Year</option>
                      <option value="3rd Year" style={{color: "black"}}>3rd Year</option>
                      <option value="4th Year" style={{color: "black"}}>4th Year</option>
                    </select>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: "0.5rem" }}>
                      <span style={{ fontSize: "0.9rem", color: "gray" }}>Sort:</span>
                      <input 
                        type="number" 
                        defaultValue={p.sort_order || 0}
                        onBlur={async (e) => {
                          const newSort = parseInt(e.target.value) || 0;
                          if (newSort !== (p.sort_order || 0)) {
                            const { error } = await supabase.from("projects").update({ sort_order: newSort }).eq("id", p.id);
                            if (error) alert("Error: " + error.message);
                            else {
                              alert("Sort order updated to " + newSort);
                              fetchProjects();
                            }
                          }
                        }}
                        style={{ width: "60px", padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(255,255,255,0.1)", color: "inherit", border: "1px solid #ccc" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: "0.5rem" }}>
                      <span style={{ fontSize: "0.9rem", color: "gray" }}>Display:</span>
                      <input 
                        type="number" 
                        placeholder="-"
                        defaultValue={p.display_order ?? ""}
                        onBlur={async (e) => {
                          const val = e.target.value;
                          const newOrder = val === "" ? null : parseInt(val);
                          if (newOrder !== (p.display_order ?? null)) {
                            const { error } = await supabase.from("projects").update({ display_order: newOrder }).eq("id", p.id);
                            if (error) alert("Error: " + error.message);
                            else {
                              alert(newOrder === null ? "Removed from Homepage" : "Display order updated to " + newOrder);
                              fetchProjects();
                            }
                          }
                        }}
                        style={{ width: "60px", padding: "0.2rem", borderRadius: "0.2rem", background: "rgba(255,255,255,0.1)", color: "inherit", border: "1px solid #ccc" }}
                      />
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(p.id)} className="btn btn-color-2" style={{ color: "red", borderColor: "red" }}>Delete</button>
              </div>
            ))}
            {projects.length === 0 && <p>No projects found. Add one!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc", background: "transparent", color: "inherit"
};
