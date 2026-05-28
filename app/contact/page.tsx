"use client";

import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Suspense fallback={<div>Loading form...</div>}>
        <ContactForm />
      </Suspense>
    </div>
  );
}
