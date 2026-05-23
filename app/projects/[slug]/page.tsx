import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Contact from "@/components/sections/Contact";
import ProjectList from "@/components/ProjectList";
import ProjectShareMenu from "@/components/ProjectShareMenu";

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
      .in("status", ["College", "1st Year", "2nd Year", "3rd Year", "4th Year"])
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    return (
      <main>
        <ProjectList 
          initialProjects={subProjects || []} 
          hideCollegeProjects={false} 
          hideTabs={false} 
          title={project.title} 
          subtitle="Academic Work" 
        />
        <Contact />
      </main>
    );
  }
  // Hardcode fallback URLs for projects where the database repo_url field is missing/null
  if (project.title === "Personal Portfolio" && !project.repo_url) {
    project.repo_url = "https://github.com/PranavR06";
  }
  if (project.title === "Online Examination Management System" && !project.repo_url) {
    project.repo_url = "https://github.com/Pranavr06";
  }

  return (
    <main>
      <section id="project-details" className="mobile-spacing" style={{ paddingTop: "10vh", paddingBottom: "10vh", minHeight: "100vh" }}>
        
        {/* We can use the same banner class from blogs or create a new one */}
        <header className="blog-banner" style={{ position: "relative", textAlign: "center", marginBottom: "3rem" }}>
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="banner-img" 
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "1rem" }}
          />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.08)", borderRadius: "1rem" }}>
            <h1 className="title banner-title" style={{ fontSize: "3.5rem", color: "white", textShadow: "2px 2px 8px rgba(0,0,0,0.8)", margin: 0, padding: "0 2rem" }}>
              {project.title}
            </h1>
          </div>
        </header>

        <div className="post-metadata" style={{ display: "flex", justifyContent: "center", gap: "1.5rem", color: "#666", marginBottom: "4rem", flexWrap: "wrap", alignItems: "center", fontSize: "0.95rem", fontWeight: "500" }}>
          <span className="post-category" style={{ fontWeight: "600", color: "#888" }}>{project.status === "Completed" ? "Web Development" : project.status}</span>
          {project.tech_stack && project.tech_stack.length > 0 && (
            <span style={{ color: "#888" }}>Tech: {project.tech_stack.join(", ")}</span>
          )}
          <span style={{ color: "#888" }}>By Pranav R</span>
          <ProjectShareMenu title={project.title} slug={project.slug} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "4rem" }}>
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "#333", color: "white", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #333" }}>
              Live Demo
            </a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "white", color: "#333", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #ccc" }}>
              Source Code
            </a>
          )}
        </div>

        <div className="post-content">
          <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem", color: "var(--light-title)", fontWeight: "700" }}>Project Overview</h2>
          
          <div className="tech-stack" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {project.tech_stack?.map((tech: string, i: number) => (
              <span key={i} style={{ fontSize: "0.85rem", background: "#e0e0e0", padding: "0.4rem 1rem", borderRadius: "1.5rem", color: "#333", fontWeight: "600" }}>
                {tech}
              </span>
            ))}
          </div>

          {(() => {
            if (!project.content) return <p style={{ textAlign: "center" }}>This project has no detailed description.</p>;
            
            let displayContent = project.content;
            
            // Normalize Windows CRLF newlines to standard LF so regexes match properly!
            displayContent = displayContent.replace(/\r\n/g, '\n');
            
            // Aggressively clean up legacy hardcoded UI from the markdown
            // 1. Remove hardcoded buttons paragraph
            displayContent = displayContent.replace(/^\s*\[.*?\]\(.*?\).*?\n+/i, '');
            displayContent = displayContent.replace(/^\s*\[.*?\]\(.*?\).*?\n+/i, ''); // sometimes twice
            
            // 2. Remove hardcoded Project Overview header
            displayContent = displayContent.replace(/^\s*Project Overview\s*\n[-=]+\s*\n+/i, '');
            displayContent = displayContent.replace(/^\s*#+\s*Project Overview\s*\n+/i, '');
            
            // 3. Remove hardcoded tech stack paragraph (a single line of common tech words)
            const lines = displayContent.split('\n');
            let firstLineIdx = 0;
            while(firstLineIdx < lines.length && lines[firstLineIdx].trim() === '') firstLineIdx++;
            
            if (firstLineIdx < lines.length && lines[firstLineIdx].length < 100 && !lines[firstLineIdx].includes('.') && (lines[firstLineIdx].includes('HTML') || lines[firstLineIdx].includes('React') || lines[firstLineIdx].includes('Java') || lines[firstLineIdx].includes('Python'))) {
              lines.splice(firstLineIdx, 1);
              displayContent = lines.join('\n');
            }

            // 4. Automatically wrap Tech Stack lists in blockquotes if they aren't already
            displayContent = displayContent.replace(/^(?!\s*>)\s*(\*\*(?:Backend Framework|Database|Authentication|Security Libraries|Frontend|Backend structure|Backend API Developer|Frontend & Auth Logic|Backend Developer|Technology Stack):\*\*.*)$/gm, '> $1\n>\n');

            return (
              <ReactMarkdown>
                {displayContent}
              </ReactMarkdown>
            );
          })()}
        </div>

      </section>
      <Contact />
    </main>
  );
}
