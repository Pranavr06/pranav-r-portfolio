import { supabase } from "@/lib/supabase";
import ProjectList from "@/components/ProjectList";
import ContactCTA from "@/components/ContactCTA";

export const metadata = {
  title: "Projects | Pranav R's Portfolio",
  description: "Browse my recent full-stack, AI, and cybersecurity projects.",
};

export const revalidate = 0;

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .or('is_archived.is.null,is_archived.eq.false')
    .neq("status", "Draft")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <main>
      <ProjectList initialProjects={projects || []} title="My Projects" />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        <ContactCTA sourceType="project" purpose="Project Discussion" ctaText="Discuss these projects" />
      </div>
    </main>
  );
}
