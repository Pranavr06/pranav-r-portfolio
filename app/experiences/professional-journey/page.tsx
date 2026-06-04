import { supabase } from "@/lib/supabase";
import ScrollArrow from "@/components/ScrollArrow";
import Contact from "@/components/sections/Contact";
import { Metadata } from "next";
import ProfessionalJourneyList from "@/components/ProfessionalJourneyList";

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
      <section id="experience" className="mobile-spacing fade-in-section" style={{ paddingTop: "2rem", marginTop: 0 }}>
        <p className="section__text__p1">My Milestones</p>
        <h1 className="title">Professional Journey</h1>
        
        <ProfessionalJourneyList initialExperiences={experiences || []} />

        
        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </section>

      <Contact />
    </main>
  );
}
