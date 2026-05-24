import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
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
  
  // Hardcode fallback URLs for projects where the database repo_url field is missing/null
  if (project.title === "Personal Portfolio" && !project.repo_url) {
    project.repo_url = "https://github.com/PranavR06";
  }
  if (project.title === "Online Examination Management System" && !project.repo_url) {
    project.repo_url = "https://github.com/Pranavr06";
  }
  
  // Dynamically extract GitHub / TinkerCAD / Demo / Report URLs from Markdown if missing in DB
  if (project.content) {
    const demoMatch = project.content.match(/\[.*?(?:Live Demo|Demo|Report).*?\]\((.*?)\)/i);
    if (demoMatch && !project.demo_url) project.demo_url = demoMatch[1];
    
    const repoMatch = project.content.match(/\[.*?(?:GitHub|Source|TinkerCAD).*?\]\((.*?)\)/i);
    if (repoMatch && !project.repo_url) project.repo_url = repoMatch[1];
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

        <div className="author-info" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
          {project.status && (
            <span className={`status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {project.status}
            </span>
          )}
          <span className="author-info-text">By Pranav R</span>
          <ProjectShareMenu title={project.title} slug={project.slug} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "4rem" }}>
          {project.status && project.status.includes('Year') ? (
            <>
              {project.repo_url && (
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "#333", color: "white", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #333" }}>
                  View Source Code
                </a>
              )}
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "white", color: "#333", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #ccc" }}>
                  View Report
                </a>
              )}
            </>
          ) : (
            <>
              {project.demo_url ? (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "#333", color: "white", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #333" }}>
                  Live Demo
                </a>
              ) : (project.status === 'In Progress' || project.status === 'Planned') ? (
                <button disabled className="btn" style={{ background: "#666", color: "#ccc", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #666", cursor: "not-allowed", opacity: 0.7 }}>
                  Live Demo (Coming Soon)
                </button>
              ) : null}
              {project.repo_url && (
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "white", color: "#333", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #ccc" }}>
                  Source Code
                </a>
              )}
            </>
          )}
        </div>

        <div className="post-content">
          <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem", fontWeight: "700" }} className="project-overview-title">Project Overview</h2>
          
          <div className="tech-stack" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {project.tech_stack?.map((tech: string, i: number) => (
              <span key={i} className="tech-tag" style={{ fontSize: "0.85rem", background: "var(--light-bg)", padding: "0.4rem 1rem", borderRadius: "1.5rem", color: "var(--light-title)", fontWeight: "600", border: "1px solid #ccc" }}>
                {tech}
              </span>
            ))}
          </div>

          {(() => {
            let displayContent = project.content || '';
            
            // Normalize Windows CRLF newlines to standard LF
            displayContent = displayContent.replace(/\r\n/g, '\n');
            
            // Aggressively clean up legacy hardcoded UI from the markdown
            displayContent = displayContent.replace(/\[(?:Live Demo|GitHub Repo|Source Code|View on TinkerCAD|View Source Code|View Report)\]\(.*?\)\s*/gi, '');
            displayContent = displayContent.replace(/\[?(?:Live Demo \(Coming Soon\)|Updates Coming Soon)\]?\(?.*?\)?\s*\n+/gi, '');
            displayContent = displayContent.replace(/^\s*(?:Live Demo \(Coming Soon\)|Updates Coming Soon)\s*\n+/gim, '');
            
            // Remove hardcoded Project Overview header
            displayContent = displayContent.replace(/\s*Project (?:Overview|Concept)\s*\n[-=]+\s*\n+/gi, '\n\n');
            displayContent = displayContent.replace(/\s*#+\s*Project (?:Overview|Concept)\s*\n+/gi, '\n\n');
            
            // Remove hardcoded tech stack paragraph (a single line of common tech words)
            const lines = displayContent.split('\n');
            let firstLineIdx = 0;
            while(firstLineIdx < lines.length && lines[firstLineIdx].trim() === '') firstLineIdx++;
            
            if (firstLineIdx < lines.length && lines[firstLineIdx].length < 100 && !lines[firstLineIdx].includes('.') && (lines[firstLineIdx].includes('HTML') || lines[firstLineIdx].includes('React') || lines[firstLineIdx].includes('Java') || lines[firstLineIdx].includes('Python') || lines[firstLineIdx].includes('Node') || lines[firstLineIdx].includes('TensorFlow'))) {
              lines.splice(firstLineIdx, 1);
              displayContent = lines.join('\n');
            }

            // Automatically wrap Tech Stack lists in blockquotes if they aren't already
            const techStackRegex = /\*\*(?:Backend Framework|Database|Authentication|Security Libraries|Frontend|Backend structure|Backend API Developer|Frontend & Auth Logic|Backend Developer|Technology Stack):\*\*/;
            let finalLines = [];
            let inTechStack = false;
            
            for (let i = 0; i < lines.length; i++) {
              let line = lines[i];
              if (techStackRegex.test(line)) {
                inTechStack = true;
                if (!line.startsWith('>')) {
                  finalLines.push('> ' + line);
                } else {
                  finalLines.push(line);
                }
              } else if (inTechStack) {
                if (line.trim() === '') {
                  inTechStack = false;
                  finalLines.push(line);
                } else {
                  if (!line.startsWith('>')) {
                    finalLines.push('> ' + line);
                  } else {
                    finalLines.push(line);
                  }
                }
              } else {
                finalLines.push(line);
              }
            }
            displayContent = finalLines.join('\n');

            // Format Note: section with an elegant hr and italicized text
            displayContent = displayContent.replace(/\*\*Note:\*\*\s*(.*)/gi, '---\n\n###### Note: $1');

            // Transform Team & Contributions into HTML cards
            displayContent = displayContent.replace(/!\[([^\]]+)\]\(([^)]+)\)(?:\r?\n)+###\s+([^\n]+)(?:\r?\n)+([^\n]+)(?:\r?\n)+([\s\S]*?)(?=\r?\n!\[|\r?\n#+\s|$)/g, (match, alt, src, name, role, details) => {
              const cleanRole = role.replace(/^\*\*Role:\*\*\s*/i, '');
              const isLead = cleanRole.toLowerCase().includes('lead') || cleanRole.toLowerCase().includes('former assistant professor');
              
              let detailsHTML = '';
              const detailLines = details.split('\n').filter(l => l.trim() !== '');
              if (detailLines.length > 0) {
                if (detailLines[0].trim().startsWith('*') || detailLines[0].trim().startsWith('-')) {
                  detailsHTML = '<ul class="team-contributions-list team-contributions-margin">' + detailLines.map(l => `<li>${l.replace(/^[\*\-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('') + '</ul>';
                } else {
                  detailsHTML = '<p class="team-contribution">' + detailLines.map(l => l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')).join('<br/>') + '</p>';
                }
              }
              
              return `%%%TEAM_CARD_START%%%\n<div class="team-card ${isLead ? 'highlighted-card' : ''}">\n  <img src="${src}" alt="${alt}" class="team-img" loading="lazy" />\n  <div class="team-info">\n    <h3 class="team-name">${name}</h3>\n    <span class="team-role">${cleanRole}</span>\n${detailsHTML}\n  </div>\n</div>\n%%%TEAM_CARD_END%%%\n`;
            });
            
            // Group contiguous cards into a single grid
            displayContent = displayContent.replace(/(?:%%%TEAM_CARD_START%%%[\s\S]*?%%%TEAM_CARD_END%%%\n*)+/g, (match) => {
              const cleanCards = match.replace(/%%%TEAM_CARD_START%%%/g, '').replace(/%%%TEAM_CARD_END%%%/g, '');
              return `\n\n<div class="team-grid">\n${cleanCards}\n</div>\n\n`;
            });

            return (
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => (
                    <img {...props} />
                  )
                }}
              >
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
