"use client";

import FadeInSection from "@/components/FadeInSection";
import ContactCTA from "@/components/ContactCTA";
import ScrollArrow from "@/components/ScrollArrow";

export default function Contact({ hideArrow = false }: { hideArrow?: boolean }) {
  return (
    <FadeInSection id="contact" style={{ position: 'relative' }}>
      <ContactCTA sourceType="general" />
      {!hideArrow && <ScrollArrow direction="up" targetId="top" />}
    </FadeInSection>
  );
}
