import { supabase } from "@/lib/supabase";
import FadeInSection from "@/components/FadeInSection";
import TestimonialCard from "@/components/cards/TestimonialCard";
import ScrollArrow from "@/components/ScrollArrow";
import Link from "next/link";

export default async function Testimonials() {
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("id, user_id, name, role, message, linkedin_url, github_url, avatar_url, is_verified, is_github_verified, display_order")
    .eq("is_approved", true)
    .neq("is_archived", true)
    .not("display_order", "is", null)
    .order("display_order", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching testimonials:", error?.message || error?.details || JSON.stringify(error) || "Unknown error");
  }

  return (
    <FadeInSection id="testimonials">
      <p className="section__text__p1">What others say</p>
      <h2 className="title">Testimonials</h2>
      
      <p style={{ textAlign: "center", marginBottom: "2rem", color: "gray", fontSize: "0.9rem", fontStyle: "italic" }}>
        All testimonials are manually reviewed before publication.
      </p>

      <div className="about-containers" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", maxWidth: "1200px", margin: "0 auto", marginBottom: "2rem" }}>
        {testimonials && testimonials.length > 0 ? (
          testimonials.map((testimonial: any) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>No testimonials available yet. Be the first to leave one!</p>
        )}
      </div>

      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <Link href="/testimonials" className="btn btn-color-2 view-more" aria-label="View more testimonials">
          View more / Leave a testimonial
        </Link>
      </div>

      <ScrollArrow targetId="blog" altText="Scroll down to blog section" />
    </FadeInSection>
  );
}
