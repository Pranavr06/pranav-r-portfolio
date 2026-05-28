import { supabase } from "@/lib/supabase";
import TestimonialCard from "@/components/cards/TestimonialCard";
import TestimonialForm from "@/components/TestimonialForm";

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
    <main style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem", paddingTop: "4rem" }}>
        <p className="section__text__p1">What others say</p>
        <h1 className="title">Testimonials</h1>
        <p style={{ color: "gray", marginTop: "1rem", fontStyle: "italic" }}>
          All testimonials are manually reviewed before publication.
        </p>
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

      <div style={{ marginTop: "4rem" }}>
        <TestimonialForm />
      </div>
    </main>
  );
}
