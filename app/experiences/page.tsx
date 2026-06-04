import CollectionCard from "@/components/cards/CollectionCard";
import ScrollArrow from "@/components/ScrollArrow";
import Contact from "@/components/sections/Contact";
import ContactCTA from "@/components/ContactCTA";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Experiences Hub | Pranav R",
  description: "A comprehensive overview of my technical expertise and professional journey.",
};

export const revalidate = 60; // revalidate every 60 seconds

export default async function ExperiencesHubPage() {
  const { data: hubs, error } = await supabase
    .from("experience_hubs")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching experience hubs:", error.message);
  }

  return (
    <main id="main-content">
      <section id="experience" className="mobile-spacing fade-in-section" style={{ paddingTop: "2rem", marginTop: 0 }}>
        <p className="section__text__p1">My Portfolio</p>
        <h1 className="title">Experiences Hub</h1>
        
        <div className="project-details-container mt-3">
          <div className="project-grid">
            {hubs && hubs.map((hub) => (
              <CollectionCard 
                key={hub.id}
                title={hub.title}
                description={hub.description}
                image={hub.image_url}
                tags={hub.tags || []}
                href={hub.href}
              />
            ))}
          </div>
        </div>
        
        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </section>
      
      <Contact />
    </main>
  );
}
