import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Contact from "@/components/sections/Contact";
import ProjectList from "@/components/ProjectList";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !project) {
    notFound();
  }

  // If this is a collection (like "college-projects"), fetch its sub-projects instead of showing markdown
  if (project.status === "Collection") {
    const { data: subProjects } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "College")
      .order("created_at", { ascending: false });

    return (
      <main>
        <ProjectList 
          initialProjects={subProjects || []} 
          hideCollegeProjects={false} 
          hideTabs={true} 
          title={project.title} 
          subtitle={project.description} 
        />
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Link href="/projects" className="btn btn-color-2">
            &larr; Back to all projects
          </Link>
        </div>
        <Contact />
      </main>
    );
  }

  return (
    <main>
      <section id="project-details" className="mobile-spacing" style={{ paddingTop: "10vh", paddingBottom: "10vh", minHeight: "100vh" }}>
        
        {/* We can use the same banner class from blogs or create a new one */}
        <header className="blog-banner" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="banner-img" 
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "1rem", marginBottom: "2rem" }}
          />
          <h1 className="title banner-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{project.title}</h1>
        </header>

        <div className="post-metadata" style={{ display: "flex", justifyContent: "center", gap: "1rem", color: "#555", marginBottom: "3rem", flexWrap: "wrap", alignItems: "center" }}>
          <span className="post-category" style={{ fontWeight: "bold" }}>{project.status}</span>
          <span>&bull;</span>
          <div className="tech-stack" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {project.tech_stack?.map((tech: string, i: number) => (
              <span key={i} style={{ fontSize: "0.8rem", background: "rgba(135,135,135,0.1)", padding: "0.2rem 0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc", color: "inherit" }}>{tech}</span>
            ))}
          </div>
          {project.demo_url && (
            <>
              <span>&bull;</span>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", textDecoration: "underline" }}>
                {project.status === "College" ? "View Report" : "Live Demo"}
              </a>
            </>
          )}
        </div>

        <div className="post-content">
          {project.content ? (
            <ReactMarkdown>
              {project.content}
            </ReactMarkdown>
          ) : (
            <p style={{ textAlign: "center" }}>This project has no detailed description.</p>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "4rem", marginBottom: "4rem" }}>
          <Link href="/projects" className="btn btn-color-2">
            &larr; Back to all projects
          </Link>
        </div>
      </section>
      <Contact />
    </main>
  );
}
