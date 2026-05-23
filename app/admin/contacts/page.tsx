"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ViewContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else fetchContacts();
    };
    checkUser();
  }, [router]);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    if (!error && data) setContacts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await supabase.from("contacts").delete().eq("id", id);
      fetchContacts();
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ fontSize: "2rem" }}>Contact Messages</h1>
        <Link href="/admin" className="btn btn-color-2">Back to Dashboard</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {contacts.map((c) => (
          <div key={c.id} className="details-container color-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1.5rem", textAlign: "left" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.2rem", margin: 0 }}>{c.name}</h3>
                <span style={{ fontSize: "0.9rem", color: "gray" }}>{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <p style={{ fontWeight: 600, color: "#007bff", marginBottom: "1rem" }}>{c.email}</p>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{c.message}</p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="btn btn-color-2" style={{ color: "red", borderColor: "red", marginLeft: "2rem" }}>Delete</button>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="details-container color-container" style={{ padding: "2rem", textAlign: "center" }}>
            <p>No contact messages yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}
