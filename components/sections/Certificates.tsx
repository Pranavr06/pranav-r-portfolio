import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Certificates() {
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching certificates:", error);
  }

  return (
    <section id="certificate" className="fade-in-section">
      <p className="section__text__p1">My Achievements</p>
      <h2 className="title">Certificates</h2>
      <div className="experience-details-container">
        <div className="about-containers">
          {certificates && certificates.length > 0 ? (
            certificates.map((cert: any) => (
              <article key={cert.id} className="details-container color-container">
                <div className="article-container">
                  {/* Default logic, you can add an image_url to certificates if needed */}
                  <img src="/assets/ieee-logo.webp" alt="Certificate logo" className="certificate-logo" loading="lazy" />
                </div>
                <h3 className="experience-sub-title project-title">{cert.title}</h3>
                <p className="certificate-date">Completed: {cert.date}</p>
                <p>{cert.description}</p>
                <div className="skill-tags">
                  <span className="tag">{cert.category}</span>
                </div>
                <p className="achievement-highlight">Organized by {cert.issuer}</p>
                <div className="project-card-footer">
                  <a href={cert.pdf_url} className="btn btn-color-2 project-btn" target="_blank" rel="noopener noreferrer">
                    Certificate
                  </a>
                </div>
              </article>
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>No certificates available yet.</p>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <a href="/certificates" className="btn btn-color-2 view-more" aria-label="View more certificates">
            View more
          </a>
        </div>
      </div>
    </section>
  );
}
