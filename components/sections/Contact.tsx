"use client";

import FadeInSection from "@/components/FadeInSection";
import ScrollArrow from "@/components/ScrollArrow";
import ContactCTA from "@/components/ContactCTA";

export default function Contact() {
  return (
    <FadeInSection id="contact">
      <ContactCTA sourceType="general" />
      <ScrollArrow direction="up" targetId="top" altText="Scroll to top of page" />
    </FadeInSection>
  );
}
