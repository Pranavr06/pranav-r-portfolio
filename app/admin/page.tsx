"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ fontSize: "2.5rem" }}>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-color-2">Logout</button>
      </div>
      
      <p style={{ marginBottom: "2rem" }}>Welcome to your admin panel, {user?.email}. From here you can manage your portfolio content.</p>

      <div className="about-containers" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        
        <div className="details-container color-container">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Projects</h2>
          <p style={{ marginBottom: "1rem" }}>Manage your portfolio projects, their statuses, and tech stacks.</p>
          <div className="btn-container">
            <Link href="/admin/projects" className="btn btn-color-1">Manage Projects</Link>
          </div>
        </div>

        <div className="details-container color-container">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Certificates</h2>
          <p style={{ marginBottom: "1rem" }}>Upload and manage your certificates and achievements.</p>
          <div className="btn-container">
            <Link href="/admin/certificates" className="btn btn-color-1">Manage Certificates</Link>
          </div>
        </div>

        <div className="details-container color-container">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Blogs</h2>
          <p style={{ marginBottom: "1rem" }}>Write and edit your insights and technical blog posts.</p>
          <div className="btn-container">
            <Link href="/admin/blogs" className="btn btn-color-1">Manage Blogs</Link>
          </div>
        </div>

        <div className="details-container color-container">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Contact Messages</h2>
          <p style={{ marginBottom: "1rem" }}>View messages sent through your contact form.</p>
          <div className="btn-container">
            <Link href="/admin/contacts" className="btn btn-color-1">View Messages</Link>
          </div>
        </div>

        <div className="details-container color-container">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Testimonials</h2>
          <p style={{ marginBottom: "1rem" }}>Review, approve, and manage public testimonials.</p>
          <div className="btn-container">
            <Link href="/admin/testimonials" className="btn btn-color-1">Manage Testimonials</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
