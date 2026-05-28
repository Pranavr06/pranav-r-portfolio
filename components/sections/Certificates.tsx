import { supabase } from "@/lib/supabase";
import Link from "next/link";
import FadeInSection from "@/components/FadeInSection";
import CertificateCard from "@/components/cards/CertificateCard";
import ScrollArrow from "@/components/ScrollArrow";

export default async function Certificates() {
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*")
    .not("display_order", "is", null)
    .order("display_order", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching certificates:", error?.message || error?.details || JSON.stringify(error) || "Unknown error");
  }

  return (
    <FadeInSection id="certificate">
      <p className="section__text__p1">My Achievements</p>
      <h2 className="title">Certificates</h2>
      <div className="experience-details-container">
        <div className="about-containers" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem", maxWidth: "1200px", margin: "0 auto", marginBottom: "3rem" }}>
          {certificates && certificates.length > 0 ? (
            certificates.map((cert: any) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>No certificates available yet.</p>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/certificates" className="btn btn-color-2 view-more" aria-label="View more certificates">
            View more
          </Link>
        </div>
      </div>
      <ScrollArrow targetId="projects" altText="Scroll down to projects section" />
    </FadeInSection>
  );
}
