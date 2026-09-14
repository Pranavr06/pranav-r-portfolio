import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import ShareMenu from "@/components/ShareMenu";
import { slugify } from "@/lib/slug";
import { Metadata } from "next";
import Script from "next/script";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let cert: any = null;

  try {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("slug", slug)
      .or("is_archived.is.null,is_archived.eq.false")
      .or("status.is.null,status.eq.Published")
      .maybeSingle();
    cert = data;
  } catch (err) {
    // If slug column doesn't exist yet, fallback
  }

  if (!cert) {
    const { data: allCerts } = await supabase
      .from("certificates")
      .select("*")
      .or("is_archived.is.null,is_archived.eq.false")
      .or("status.is.null,status.eq.Published");

    cert = allCerts?.find((c: any) => (c.slug && c.slug === slug) || slugify(c.title) === slug) || null;
  }

  if (!cert) return { title: "Certificate Not Found | Pranav R" };

  const pageUrl = `https://pranavr.netlify.app/certificates/${slug}`;
  const description = cert.description || `View ${cert.title} issued by ${cert.issuer}. Verified certification of Pranav R.`;
  const previewImage = cert.image_url || "/assets/certificates-og-image.png";

  return {
    title: `${cert.title} | Certificates | Pranav R`,
    description,
    openGraph: {
      title: `${cert.title} | Pranav R`,
      description,
      url: pageUrl,
      images: previewImage ? [{ url: previewImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cert.title} | Pranav R`,
      description,
      images: previewImage ? [previewImage] : [],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function CertificateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let cert: any = null;

  try {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("slug", slug)
      .or("is_archived.is.null,is_archived.eq.false")
      .or("status.is.null,status.eq.Published")
      .maybeSingle();
    cert = data;
  } catch (err) {
    // If slug column doesn't exist yet, fallback
  }

  if (!cert) {
    const { data: allCerts } = await supabase
      .from("certificates")
      .select("*")
      .or("is_archived.is.null,is_archived.eq.false")
      .or("status.is.null,status.eq.Published");

    cert = allCerts?.find((c: any) => (c.slug && c.slug === slug) || slugify(c.title) === slug) || null;
  }

  if (!cert) {
    notFound();
  }

  const canonicalSlug = cert.slug || slugify(cert.title);
  const isImage = cert.pdf_url && (cert.pdf_url.endsWith(".webp") || cert.pdf_url.endsWith(".png") || cert.pdf_url.endsWith(".jpg") || cert.pdf_url.endsWith(".jpeg"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "name": cert.title,
    "description": cert.description,
    "credentialCategory": cert.category,
    "recognizedBy": {
      "@type": "Organization",
      "name": cert.issuer
    },
    "url": `https://pranavr.netlify.app/certificates/${canonicalSlug}`
  };

  return (
    <main style={{ minHeight: "100vh", paddingTop: "5rem", paddingBottom: "5rem" }}>
      <Script
        id={`certificate-schema-${canonicalSlug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link 
            href="/certificates" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              color: "var(--text-color, #fff)", 
              textDecoration: "none", 
              fontWeight: 500,
              fontSize: "0.95rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <span>&larr;</span> View all certificates
          </Link>
        </div>

        {/* Certificate Title Outside Box */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="section__text__p1">Certificate</p>
          <h1 className="title" style={{ fontSize: "2.4rem", margin: "0.4rem 0 0 0", lineHeight: 1.25 }}>
            {cert.title}
          </h1>
        </div>

        {/* Certificate Card Container */}
        <article 
          className="details-container color-container cert-detail-card" 
          style={{ 
            position: "relative",
            marginBottom: "2.5rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
          }}
        >
          {/* Top-Right Share Menu */}
          <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 10 }}>
            <ShareMenu 
              title={cert.title} 
              slug={canonicalSlug}
              type="certificates" 
              downloadUrl={cert.pdf_url && cert.pdf_url !== "#" ? cert.pdf_url : undefined} 
            />
          </div>

          {/* Logo & Issuer */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "1.25rem" }}>
            <div style={{ width: "90px", height: "90px", marginBottom: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img 
                src={cert.image_url || "/assets/ieee-logo.webp"} 
                alt={`${cert.title} logo`} 
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            <p style={{ fontSize: "0.95rem", color: "var(--text-color-light, gray)", margin: "0.2rem 0" }}>
              {cert.date.includes("Completed") ? cert.date : `Completed: ${cert.date}`}
            </p>

            {cert.issuer && !cert.issuer.includes("Unknown") && (
              <p className="achievement-highlight-custom" style={{ fontSize: "0.95rem", marginTop: "0.35rem" }}>
                {cert.issuer.includes("Issued by") || cert.issuer.includes("Organized by") || cert.issuer.includes("Completed in") 
                  ? cert.issuer 
                  : `Issued by ${cert.issuer}`}
              </p>
            )}
          </div>

          {/* Tags */}
          {cert.skills && cert.skills.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.25rem" }}>
              {cert.skills.map((skill: string, idx: number) => (
                <span key={idx} className="custom-tag" style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem" }}>
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {cert.description && (
            <p style={{ fontSize: "1.02rem", lineHeight: 1.7, textAlign: "center", maxWidth: "750px", margin: "0 auto 1.5rem auto", color: "var(--text-color-light)" }}>
              {cert.description}
            </p>
          )}

          {/* Linked Experience / Project Buttons (if available) */}
          {(cert.experience_url || cert.project_url) && (
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {cert.experience_url && (
                <Link 
                  href={cert.experience_url} 
                  className="btn btn-color-1" 
                  style={{ padding: "0.5rem 1.6rem", fontSize: "0.95rem", borderRadius: "2rem", textDecoration: "none" }}
                >
                  View Experience &rarr;
                </Link>
              )}
              {cert.project_url && (
                <Link 
                  href={cert.project_url} 
                  className="btn btn-color-1" 
                  style={{ padding: "0.5rem 1.6rem", fontSize: "0.95rem", borderRadius: "2rem", textDecoration: "none" }}
                >
                  View Project &rarr;
                </Link>
              )}
            </div>
          )}

          {/* Document Viewer / Preview */}
          {cert.pdf_url && cert.pdf_url !== "#" && (
            <div style={{ marginTop: "1rem", width: "100%" }}>
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "1.5rem", marginBottom: "1.25rem", textAlign: "center" }}>
                <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-color-light)", fontWeight: 600 }}>
                  Certificate Preview
                </span>
              </div>

              <div className="cert-preview-container">
                {isImage ? (
                  <img 
                    src={cert.pdf_url} 
                    alt={cert.title} 
                    className="cert-image-preview" 
                  />
                ) : (
                  <iframe 
                    src={`${cert.pdf_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                    className="cert-preview-iframe" 
                    title={`${cert.title} Document`}
                  />
                )}
              </div>

              <div className="cert-preview-actions">
                <a 
                  href={cert.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-color-2"
                  style={{ padding: "0.5rem 1.4rem", fontSize: "0.9rem", borderRadius: "2rem", textDecoration: "none" }}
                >
                  View Full Screen ↗
                </a>
                <a 
                  href={cert.pdf_url} 
                  download={`${canonicalSlug}.pdf`}
                  className="btn btn-color-1"
                  style={{ padding: "0.5rem 1.4rem", fontSize: "0.9rem", borderRadius: "2rem", textDecoration: "none" }}
                >
                  Download PDF
                </a>
              </div>
            </div>
          )}
        </article>

        {/* View All Certificates Button */}
        <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3.5rem" }}>
          <Link 
            href="/certificates" 
            className="btn btn-color-2"
            style={{ 
              padding: "0.8rem 2.2rem", 
              fontSize: "1rem", 
              borderRadius: "2rem", 
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem"
            }}
          >
            <span>&larr;</span> View All Certificates
          </Link>
        </div>

        {/* Contact CTA */}
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <ContactCTA 
            sourceType="certificate" 
            purpose={`Certificate: ${cert.title}`} 
            ctaText="Inquire or verify this credential" 
          />
        </div>

      </div>
    </main>
  );
}
