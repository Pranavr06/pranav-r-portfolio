import { supabase } from "@/lib/supabase";
import ProjectList from "@/components/ProjectList";
import Contact from "@/components/sections/Contact";

export const metadata = {
  title: "Projects | Pranav R's Portfolio",
  description: "Browse my recent full-stack, AI, and cybersecurity projects.",
};

export const revalidate = 0;

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <main>
      <ProjectList initialProjects={projects || []} />
      <Contact />
    </main>
  );
}
