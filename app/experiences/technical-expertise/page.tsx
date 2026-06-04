import { supabase } from "@/lib/supabase";
import ExperienceCard from "@/components/cards/ExperienceCard";
import ScrollArrow from "@/components/ScrollArrow";
import Contact from "@/components/sections/Contact";
import PageShareMenu from "@/components/PageShareMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Expertise | Pranav R",
  description: "A comprehensive overview of my technical capabilities, showcasing scalable architecture, full-stack development, and secure systems I've built.",
};

export const revalidate = 60; // revalidate every 60 seconds

export default async function TechnicalExpertisePage() {
  const { data: experiences, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("category", "technical_expertise")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching technical expertise experiences:", error?.message || error?.details || JSON.stringify(error) || "Unknown error");
  }

  return (
    <main id="main-content">
      <section id="expertise-section" className="mobile-spacing fade-in-section" style={{ paddingTop: "2rem", marginTop: 0 }}>
        <p className="section__text__p1">Technologies I use to build scalable and secure applications</p>
        <h1 className="title mb-2">Technical Expertise</h1>
        
        <p className="expertise-focus">Focus: Full-Stack Development &amp; Secure Systems</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <p className="expertise-intro" style={{ margin: 0 }}>I build secure, real-time web systems with strong backend architecture and monitoring capabilities.</p>
          <PageShareMenu />
        </div>
        
        <div className="expertise-grid mt-3">
          {experiences && experiences.length > 0 ? (
            experiences.map((exp: any) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>
              Technical expertise details coming soon!
            </p>
          )}
        </div>
        
        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </section>

      <Contact />
    </main>
  );
}
