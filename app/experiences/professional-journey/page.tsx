import { supabase } from "@/lib/supabase";
import ExperienceCard from "@/components/cards/ExperienceCard";
import ScrollArrow from "@/components/ScrollArrow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Journey | Pranav R",
  description: "A curated timeline of my professional experiences, internships, hackathons, and key national-level milestones.",
};

export const revalidate = 60; // revalidate every 60 seconds

export default async function ProfessionalJourneyPage() {
  const { data: experiences, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("category", "professional_journey")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching professional journey experiences:", error?.message || error?.details || JSON.stringify(error) || "Unknown error");
  }

  return (
    <main id="main-content">
      <section id="experience" className="mobile-spacing fade-in-section">
        <p className="section__text__p1">My Milestones</p>
        <h1 className="title">Professional Journey</h1>
        
        <div className="project-details-container mt-3">
          <div className="project-grid">
            {experiences && experiences.length > 0 ? (
              experiences.map((exp: any) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))
            ) : (
              <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>
                Professional journey details coming soon!
              </p>
            )}
          </div>
        </div>
        
        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </section>
    </main>
  );
}
