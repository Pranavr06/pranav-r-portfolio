import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Contact from "@/components/sections/Contact";
import ProjectList from "@/components/ProjectList";
import ShareMenu from "@/components/ShareMenu";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Render individual college project

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

        <div className="post-metadata" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <span className="post-category">
            {(() => {
              const t = project.title;
              const tech = project.tech_stack || [];
              if (t.includes('AI') || t.includes('Machine') || t.includes('Prediction') || t.includes('Summarizer') || tech.includes('TensorFlow')) return 'AI / ML';
              if (t.includes('Cyber') || t.includes('Phishing') || t.includes('Keylogger')) return 'Cybersecurity';
              if (t.includes('MERN') || t.includes('Full-Stack') || t.includes('E-commerce') || t.includes('Notes') || tech.includes('MERN')) return 'Full-Stack Dev';
              if (tech.includes('TinkerCAD') || t.includes('EVM') || t.includes('Arduino')) return '3D Modeling';
              if (t.includes('Exam') || t.includes('Classroom') || t.includes('Management') || t.includes('Mentor')) return 'Web Development';
              if (t.includes('Portfolio')) return 'Web Development';
              return 'Development';
            })()}
          </span>
          <span>Tech: {(project.tech_stack || []).join(', ')}</span>
          <span className="post-author">By Pranav R</span>
          <ShareMenu title={project.title} slug={project.slug} type="college-projects" />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "4rem" }}>
          {project.status && project.status.includes('Year') ? (
            <>
              {project.repo_url ? (
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "#333", color: "white", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #333" }}>
                  View Source Code
                </a>
              ) : (
                <button disabled className="btn" style={{ background: "#333", color: "white", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #333", cursor: "not-allowed", opacity: 0.6 }}>
                  Source Code Unavailable
                </button>
              )}
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "white", color: "#333", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #ccc" }}>
                  {project.demo_url.includes('research-paper') ? 'Research Paper' : project.demo_url.includes('.pdf') ? 'View Report' : 'Live Demo'}
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
                <button disabled className="btn" style={{ background: "#333", color: "white", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #333", cursor: "not-allowed", opacity: 0.6 }}>
                  Live Demo (Coming Soon)
                </button>
              ) : null}
              {project.repo_url ? (
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "white", color: "#333", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #ccc" }}>
                  Source Code
                </a>
              ) : (
                <button disabled className="btn" style={{ background: "#333", color: "white", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #333", cursor: "not-allowed", opacity: 0.6 }}>
                  Source Code Unavailable
                </button>
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
            displayContent = displayContent.replace(/\[(?:Live Demo|GitHub Repo|Source Code|View on TinkerCAD|View Source Code|View Report|View Research Paper)\]\(.*?\)\s*/gi, '');
            displayContent = displayContent.replace(/\[?(?:Live Demo \(Coming Soon\)|Updates Coming Soon)\]?\(?.*?\)?\s*\n+/gi, '');
            displayContent = displayContent.replace(/^\s*(?:Live Demo \(Coming Soon\)|Updates Coming Soon)\s*\n+/gim, '');
            displayContent = displayContent.replace(/^\s*Source Code Unavailable\s*\n+/gim, '');

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

            // Highlight specific exam discipline sentence
            displayContent = displayContent.replace(/_This module ensures that the system is not just passive but actively enforces exam discipline._/gi, '<strong class="highlighted-note">This module ensures that the system is not just passive but actively enforces exam discipline.</strong>');

            // Highlight specific RBAC note
            displayContent = displayContent.replace(/_Note: Proper role-based access control \(RBAC\) is implemented to differentiate admin and teacher permissions._/gi, '<strong class="highlighted-note" style="display: block; margin-top: 1.5rem;">Note: Proper role-based access control (RBAC) is implemented to differentiate admin and teacher permissions.</strong>');

            // Format standard Note: section (if any exist)
            displayContent = displayContent.replace(/\*\*Note:\*\*\s*(.*)/gi, '---\n\n<strong class="highlighted-note" style="display: block; margin-top: 1.5rem;">Note: $1</strong>');

            // Normalize Setext headings to ATX headings so regex boundary checks work
            displayContent = displayContent.replace(/^([^\n]+)\r?\n-+\s*$/gm, '## $1');
            displayContent = displayContent.replace(/^([^\n]+)\r?\n=+\s*$/gm, '# $1');

            // Transform Mentor/Instructor into Report Box
            displayContent = displayContent.replace(/!\[([^\]]+)\]\(([^)]+)\)(?:\r?\n)+###\s+([^\n]+)(?:\r?\n)+\*\*(?:Role|Designation):\*\*\s*([^\n]+)(?:\r?\n)+\*\*Institution:\*\*\s*([^\n]+)(?:(?:\r?\n)+\*\*Email:\*\*\s*([^\n]+))?/g, (match: any, alt: any, src: any, name: any, role: any, institution: any, email: any) => {
              let emailHTML = '';
              if (email) {
                const emailMatch = email.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (emailMatch) {
                   emailHTML = `\n      <p class="instructor-email" style="margin-top: 1.5rem;"><strong>Email:</strong> <a href="${emailMatch[2]}">${emailMatch[1]}</a></p>`;
                } else {
                   emailHTML = `\n      <p class="instructor-email" style="margin-top: 1.5rem;"><strong>Email:</strong> ${email}</p>`;
                }
              }
              return `\n<div class="report-box">\n  <div class="report-box-flex">\n    <img src="${src}" alt="${alt}" class="report-box-img" loading="lazy" />\n    <div>\n      <h3 class="report-box-title" style="font-size: 1.6rem; margin-bottom: 1.5rem;">${name}</h3>\n      <p class="report-box-role" style="margin-bottom: 1rem;"><strong>Designation:</strong> ${role}</p>\n      <p class="report-box-institution"><strong>Institution:</strong> ${institution}</p>${emailHTML}\n    </div>\n  </div>\n</div>\n`;
            });

            // Transform Team & Contributions into HTML cards
            displayContent = displayContent.replace(/(?:^|\n\n)!\[([^\]]+)\]\(([^)]+)\)(?:\r?\n)+###\s+([^\n]+)(?:\r?\n)+([^\n]+)(?:\r?\n)+([\s\S]*?)(?=\r?\n!\[|\r?\n#+\s|$)/g, (match: any, alt: any, src: any, name: any, role: any, details: any) => {
              const cleanRole = role.replace(/^\*\*Role:\*\*\s*/i, '');
              const isOwner = name.toLowerCase().includes('pranav r');
              const isLead = cleanRole.toLowerCase().includes('lead') || cleanRole.toLowerCase().includes('former assistant professor') || cleanRole.toLowerCase().includes('architect');
              
              let cardClass = '';
              if (isOwner) cardClass = 'highlighted-card';
              else if (isLead) cardClass = 'horizontal-card';
              
              let detailsHTML = '';
              const detailLines = (details as string).split('\n').filter((l: string) => l.trim() !== '');
              if (detailLines.length > 0) {
                if (detailLines[0].trim().startsWith('*') || detailLines[0].trim().startsWith('-')) {
                  detailsHTML = '<div class="team-details"><ul class="team-contributions-list team-contributions-margin" style="list-style-type: disc;">' + detailLines.map(l => `<li>${l.replace(/^[\*\-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('') + '</ul></div>';
                } else {
                  detailsHTML = '<div class="team-details"><p class="team-contribution">' + detailLines.map(l => l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')).join('<br/>') + '</p></div>';
                }
              }
              
              return `%%%TEAM_CARD_START%%%\n<div class="team-card ${cardClass}">\n  <img src="${src}" alt="${alt}" class="team-img" loading="lazy" />\n  <div class="team-info">\n    <h3 class="team-name">${name}</h3>\n    <span class="team-role">${cleanRole}</span>\n${detailsHTML}\n  </div>\n</div>\n%%%TEAM_CARD_END%%%\n`;
            });
            
            // Group contiguous cards into a single grid
            displayContent = displayContent.replace(/(?:%%%TEAM_CARD_START%%%[\s\S]*?%%%TEAM_CARD_END%%%\n*)+/g, (match: any) => {
              const cleanCards = match.replace(/%%%TEAM_CARD_START%%%/g, '').replace(/%%%TEAM_CARD_END%%%/g, '');
              return `\n\n<div class="team-grid">\n${cleanCards}\n</div>\n\n`;
            });

            return (
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => (
                    <img {...props} />
                  ),
                  a: ({ node, ...props }) => {
                    const text = String(props.children);
                    if (text.includes('Download')) {
                      return (
                        <span style={{ display: "block", textAlign: "center", margin: "2rem 0 3rem 0" }}>
                          <a {...props} className="btn" style={{ background: "#333", color: "white", borderRadius: "2rem", padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: "700", border: "1px solid #333", display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            {props.children}
                          </a>
                        </span>
                      );
                    }
                    return <a {...props} style={{ color: "#007bff", textDecoration: "none", fontWeight: 600 }} />;
                  }
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
