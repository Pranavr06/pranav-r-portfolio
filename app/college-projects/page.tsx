import { supabase } from "@/lib/supabase";
import Contact from "@/components/sections/Contact";
import ProjectList from "@/components/ProjectList";

export const metadata = {
  title: "College Projects | Pranav R",
  description: "Browse my academic and college projects.",
};

export default async function CollegeProjectsPage() {
  const { data: collegeProjects } = await supabase
    .from('projects')
    .select('*')
    .in('status', ['1st year', '2nd year', '3rd year', '4th year', 'College', '1st Year', '2nd Year', '3rd Year', '4th Year'])
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <main>
      <ProjectList 
        initialProjects={collegeProjects || []} 
        hideCollegeProjects={false} 
        title="College Projects" 
        subtitle="Browse My Academic" 
      />
      <Contact />
    </main>
  );
}
