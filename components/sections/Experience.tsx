import ScrollArrow from "@/components/ScrollArrow";
import CollectionCard from "@/components/cards/CollectionCard";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Experience() { 
  const { data: hubs, error } = await supabase
    .from("experience_hubs")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching experience hubs:", error.message);
  }

  return (
    <section id='experience' className="fade-in-section">
      <p className='section__text__p1'>My Professional Journey</p>
      <h2 className='title'>Experiences</h2>
      
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
      
      <div className="btn-container center-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Link href="/experiences" className="btn btn-color-2">
          View more
        </Link>
      </div>

      <ScrollArrow targetId="certificate" altText="Scroll down to certificates section" />
    </section>
  ); 
}
