"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TestimonialForm from "@/components/TestimonialForm";

export default function AdminNewTestimonial() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      // Simple client side check, API enforces security
      if (session.user.email === 'pranavkundapura06@gmail.com') {
        setAuthorized(true);
      } else {
        router.push("/admin");
      }
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ fontSize: "2rem", margin: 0 }}>Manual Testimonial Entry</h1>
        <Link href="/admin/testimonials" className="btn btn-color-2">Back to Manage Testimonials</Link>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <TestimonialForm isAdminMode={true} />
      </div>
    </div>
  );
}
