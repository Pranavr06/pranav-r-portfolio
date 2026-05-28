import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import FadeInSection from "@/components/FadeInSection";
import ProjectCard from "@/components/cards/ProjectCard";
import ScrollArrow from "@/components/ScrollArrow";

export default async function Projects() {
  // Fetch projects from Supabase
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .not("display_order", "is", null)
    .order("display_order", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching projects:", error?.message || error?.details || JSON.stringify(error) || "Unknown error");
  }

  return (
    <FadeInSection id="projects">
      <p className="section__text__p1">Browse My Recent</p>
      <h2 className="title">Projects</h2>
      <div className="project-details-container">
        <div className="project-grid">
          {projects && projects.length > 0 ? (
            projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div id="empty-state-message" style={{ display: "block" }}>
              <h3 className="title">No Projects Found</h3>
              <p>There are currently no projects matching this status. Check back later!</p>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/projects" className="btn btn-color-2 view-more" aria-label="View more projects">
            View more
          </Link>
        </div>
      </div>
      <ScrollArrow targetId="testimonials" altText="Scroll down to testimonials section" />
    </FadeInSection>
  );
}
