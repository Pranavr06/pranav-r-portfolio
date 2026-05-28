import { supabase } from "@/lib/supabase";
import ContactCTA from "@/components/ContactCTA";
import CertificateList from "@/components/CertificateList";

export const metadata = {
  title: "Certificates | Pranav R",
  description: "Explore Pranav R's certifications and achievements.",
};

export const revalidate = 0;

export default async function CertificatesPage() {
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching certificates:", error);
  }

  return (
    <main>
      <CertificateList initialCertificates={certificates || []} />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        <ContactCTA sourceType="certificate" purpose="Certificate Inquiry" ctaText="Inquire about these certificates" />
      </div>
    </main>
  );
}
