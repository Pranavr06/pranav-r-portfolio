import { supabase } from "@/lib/supabase";
import TestimonialCard from "@/components/cards/TestimonialCard";
import TestimonialForm from "@/components/TestimonialForm";
import ShareMenu from "@/components/ShareMenu";
import ContactCTA from "@/components/ContactCTA";
import ScrollArrow from "@/components/ScrollArrow";

export default async function TestimonialsPage() {
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("id, user_id, name, role, message, linkedin_url, github_url, avatar_url, is_verified, is_github_verified, sort_order")
    .eq("is_approved", true)
    .neq("is_archived", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error?.message || error?.details || JSON.stringify(error) || "Unknown error");
  }

  return (
    <main>
      <section className="mobile-spacing" style={{ paddingTop: "2rem", marginTop: 0, minHeight: "80vh", height: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p className="section__text__p1">What others say</p>
          <h1 className="title">Testimonials</h1>
          <p style={{ color: "gray", marginTop: "1rem", fontStyle: "italic" }}>
            All testimonials are manually reviewed before publication.
          </p>
          
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1.5rem" }}>
            <a href="#testimonial-form" className="btn btn-color-2" style={{ padding: "0.8rem 1.5rem", borderRadius: "2rem" }}>
              Leave a testimonial
            </a>
            <ShareMenu title="Testimonials | Pranav R" type="page" />
          </div>
        </div>

        <div className="testimonial-grid-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {testimonials && testimonials.length > 0 ? (
            testimonials.map((testimonial: any) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>No testimonials available yet. Be the first to leave one!</p>
          )}
        </div>
      </section>

      <section id="testimonial-form" className="mobile-spacing" style={{ paddingTop: "4rem", minHeight: "90vh", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <TestimonialForm />
        
        <ScrollArrow targetId="contact" altText="Scroll down to contact section" />
      </section>

      <section id="contact" className="mobile-spacing" style={{ paddingTop: "4rem", minHeight: "80vh", height: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem", width: "100%" }}>
          <ContactCTA sourceType="general" purpose="Testimonials Inquiry" ctaText="Let's build something together" />
        </div>

        <ScrollArrow direction="up" targetId="top" altText="Scroll to top of page" />
      </section>
    </main>
  );
}
