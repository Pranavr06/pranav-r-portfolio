import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import FadeInSection from "@/components/FadeInSection";

export default async function Projects() {
  // Fetch projects from Supabase
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <FadeInSection id="projects">
      <p className="section__text__p1">Browse My Recent</p>
      <h2 className="title">Projects</h2>
      <div className="experience-details-container">
        <div className="project-grid">
          {projects && projects.length > 0 ? (
            projects.map((project: any) => (
              <article key={project.id} className="details-container color-container">
                <div className="status-wrapper">
                  <div className={`status-tag status-${project.status.toLowerCase().replace(" ", "-")}`}>
                    {project.status}
                  </div>
                </div>
                <figure>
                  <img src={project.image_url} alt={project.title} className="project-img" loading="lazy" />
                  <figcaption>
                    <h2 className="experience-sub-title project-title">{project.title}</h2>
                  </figcaption>
                </figure>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.tech_stack.map((tech: string, idx: number) => (
                    <span key={idx} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-card-footer">
                  <Link href={`/projects/${project.slug}`} className="read-more-link" aria-label={`Read more about ${project.title}`}>
                    Read More &rarr;
                  </Link>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {project.demo_url ? (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn btn-color-2 project-btn">
                        {project.demo_url.includes('research-paper') ? 'Research Paper' : project.demo_url.includes('.pdf') ? 'View Report' : 'Live Demo'}
                      </a>
                    ) : (
                      <button className="btn btn-color-2 project-btn" disabled>
                        Live Demo
                      </button>
                    )}
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn btn-color-2 project-btn" aria-label={`Source Code for ${project.title}`}>
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div id="empty-state-message" style={{ display: "block" }}>
              <h3 className="title">No Projects Found</h3>
              <p>There are currently no projects matching this status. Check back later!</p>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <a href="/projects" className="btn btn-color-2 view-more" aria-label="View more projects">
            View more
          </a>
        </div>
      </div>
    </FadeInSection>
  );
}
