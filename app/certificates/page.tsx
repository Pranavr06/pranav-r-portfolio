import { supabase } from "@/lib/supabase";
import Contact from "@/components/sections/Contact";
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching certificates:", error);
  }

  return (
    <main>
      <CertificateList initialCertificates={certificates || []} />
      <Contact />
    </main>
  );
}
