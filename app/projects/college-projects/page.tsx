import { supabase } from "@/lib/supabase";
import ContactCTA from "@/components/ContactCTA";
import ProjectList from "@/components/ProjectList";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'College Projects | Pranav R',
  description: 'Browse my academic and college projects.',
};

export default async function CollegeProjectsPage() {
  const { data: collegeProjects } = await supabase
    .from('projects')
    .select('*')
    .or('is_archived.is.null,is_archived.eq.false')
    .not("status", "in", '("Draft","Unpublished")')
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
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        <ContactCTA sourceType="project" sourceSlug="college-projects" purpose="Project Discussion" ctaText="Discuss these projects" />
      </div>
    </main>
  );
}
