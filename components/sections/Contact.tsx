"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const { error } = await supabase.from("contacts").insert([{
      name, email, message
    }]);

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <section id="contact" className="fade-in-section">
      <p className="section__text__p1">Get in Touch</p>
      <h2 className="title">Contact Me</h2>
      <div className="contact-form-container">
        
        {status === "success" ? (
          <div className="details-container color-container" style={{ padding: "2rem", textAlign: "center", border: "1px solid #4ade80" }}>
            <h3 style={{ color: "#4ade80", marginBottom: "1rem" }}>Message Sent!</h3>
            <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
            <button onClick={() => setStatus("idle")} className="btn btn-color-2" style={{ marginTop: "1.5rem" }}>Send Another</button>
          </div>
        ) : (
          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" style={{ background: "transparent", color: "inherit", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" style={{ background: "transparent", color: "inherit", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }} />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} required autoComplete="off" style={{ background: "transparent", color: "inherit", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}></textarea>
            </div>
            
            {status === "error" && <p style={{ color: "red", marginBottom: "1rem" }}>Error: {errorMessage}</p>}
            
            <div className="form-group">
              <button type="submit" className="btn btn-color-1" id="submit-btn" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        )}

      </div>
      <div className="contact-info-upper-container">
        <div className="contact-info-container">
          <a
            href="mailto:pranavkundapura18@gmail.com?subject=Professional%20Inquiry"
            className="contact-link"
            aria-label="Send email to Pranav R"
          >
            <img src="/assets/email.webp" alt="Email contact icon" className="icon contact-icon" loading="lazy" />
            <span className="contact-text">Email</span>
          </a>
        </div>
        <div className="contact-info-container">
          <a
            href="https://www.linkedin.com/in/pranavr06/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            aria-label="Visit Pranav R's LinkedIn profile"
          >
            <img src="/assets/linkedin.webp" alt="LinkedIn contact icon" className="icon contact-icon" loading="lazy" />
            <span className="contact-text">LinkedIn</span>
          </a>
        </div>
      </div>
      <Link href="#desktop-nav" className="scroll-up-link" aria-label="Scroll to top of page">
        <img
          src="/assets/arrow-invert.webp"
          alt="Scroll to top of page"
          className="icon arrow scroll-up"
          title="Scroll to top"
        />
      </Link>
    </section>
  );
}
