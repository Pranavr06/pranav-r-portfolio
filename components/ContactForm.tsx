"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useToast } from "./ToastProvider";
import FormInput from "./ui/FormInput";
import { isValidEmail, isValidUrl } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

const PURPOSE_OPTIONS = [
  "Internship Opportunity",
  "Collaboration",
  "Project Discussion",
  "Networking",
  "Feedback",
  "Other"
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  
  const defaultPurpose = searchParams.get("purpose") || "";
  const sourcePage = searchParams.get("source_page") || (typeof window !== 'undefined' ? window.location.pathname : "");
  const sourceType = searchParams.get("source_type") || "general";
  const sourceSlug = searchParams.get("source_slug") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    purpose: defaultPurpose,
    company: "",
    linkedin_url: "",
    github_url: "",
    bot_field: "" // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const purposeRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const githubRef = useRef<HTMLInputElement>(null);

  // Sync defaultPurpose if it changes
  useEffect(() => {
    if (defaultPurpose && !formData.purpose) {
      setFormData(prev => ({ ...prev, purpose: defaultPurpose }));
    }
  }, [defaultPurpose]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Please enter your name.";
    if (!formData.email.trim()) newErrors.email = "Please enter your email address.";
    else if (!isValidEmail(formData.email)) newErrors.email = "Please enter a valid email address.";
    
    if (!formData.purpose) newErrors.purpose = "Please select a purpose.";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    
    if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) newErrors.linkedin_url = "Please enter a valid URL.";
    if (formData.github_url && !isValidUrl(formData.github_url)) newErrors.github_url = "Please enter a valid URL.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newErrors.email) emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newErrors.purpose) purposeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newErrors.message) messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newErrors.linkedin_url) linkedinRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newErrors.github_url) githubRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);

    if (formData.bot_field) {
      // Honeypot triggered
      addToast("Bot activity detected.", "error");
      setSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      addToast("Please complete the CAPTCHA.", "error");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source_page: sourcePage,
          source_type: sourceType,
          source_slug: sourceSlug,
          token: turnstileToken
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("You have reached the submission limit. Please try again later.");
        }
        throw new Error(data.error || "Failed to send message.");
      }

      addToast("Message sent successfully.", "success");
      trackEvent("form_submit", formData.purpose);
      setFormData({
        name: "", email: "", message: "", purpose: defaultPurpose, company: "", linkedin_url: "", github_url: "", bot_field: ""
      });
      setErrors({});
      turnstileRef.current?.reset();
      setTurnstileToken("");
    } catch (err: any) {
      addToast(err.message, "error");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  let headingText = "Let's Connect";
  let subHeadingText = "Open to internships, collaborations, and meaningful tech discussions.";
  let btnText = "Start a Conversation";
  
  if (sourceType === "project") {
    headingText = "Interested in this project?";
    subHeadingText = "Let's discuss it in more detail.";
    btnText = "Discuss Project";
  } else if (sourceType === "blog") {
    headingText = "Thoughts on this article?";
    subHeadingText = "I'm always open to discussing new perspectives.";
    btnText = "Share Thoughts";
  } else if (sourceType === "certificate") {
    headingText = "Questions about this certification?";
    subHeadingText = "Feel free to reach out.";
    btnText = "Send Inquiry";
  }

  return (
    <div className="two-column-layout animate-slide-up">
      <div className="left-info-panel">
        <div>
          <h2>{headingText}</h2>
          <p className="contact-microcopy" style={{ marginTop: "0.5rem" }}>{subHeadingText}</p>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <div className="contact-availability">
            <span className="dot"></span>
            Available for new opportunities
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "0.5rem" }}>
            <div className="testimonial-rule">
              <svg className="testimonial-rule-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span className="testimonial-rule-text">Please use a valid email address so I can respond properly.</span>
            </div>
            <div className="testimonial-rule">
              <svg className="testimonial-rule-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span className="testimonial-rule-text">Usually replies within 24–48 hours.</span>
            </div>
            <div className="testimonial-rule">
              <svg className="testimonial-rule-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span className="testimonial-rule-text">Messages are reviewed manually to reduce spam.</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          <a
            href="mailto:pranavkundapura18@gmail.com?subject=Portfolio%20Inquiry%20-%20Connecting%20with%20Pranav%20R&body=Hi%20Pranav,%0D%0A%0D%0AI%20recently%20came%20across%20your%20portfolio%20and%20was%20impressed%20by%20your%20work.%20I%20would%20love%20to%20connect%20and%20discuss%20potential%20opportunities.%0D%0A%0D%0ABest%20regards,%0D%0A[Your%20Name]"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-link"
          >
            <img src="/assets/email.webp" alt="Email" className="icon" style={{ width: "20px", height: "20px" }} loading="lazy" />
            <span>Email</span>
          </a>
          <a
            href="https://www.linkedin.com/in/pranavr06/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-link"
          >
            <img src="/assets/linkedin.webp" alt="LinkedIn" className="icon" style={{ width: "20px", height: "20px" }} loading="lazy" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://github.com/Pranavr06"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-link"
          >
            <img src="/assets/github.webp" alt="GitHub" className="icon" style={{ width: "20px", height: "20px" }} loading="lazy" />
            <span>GitHub</span>
          </a>
        </div>
        
        <div style={{ marginTop: "auto", paddingTop: "3rem" }}>
          <p className="contact-microcopy" style={{ fontSize: "0.85rem", opacity: 0.6 }}>
            * Indicates required fields
          </p>
        </div>
      </div>

      <div className="right-form-panel">
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Honeypot hidden field */}
          <div style={{ display: "none" }} aria-hidden="true">
            <label htmlFor="bot_field">Don't fill this out if you're human:</label>
            <input type="text" id="bot_field" value={formData.bot_field} onChange={e => handleInputChange("bot_field", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormInput
              label="Name"
              id="name"
              required
              ref={nameRef}
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={e => handleInputChange("name", e.target.value)}
              error={errors.name}
            />
            <FormInput
              label="Email"
              id="email"
              type="email"
              required
              ref={emailRef}
              placeholder="john@example.com"
              value={formData.email}
              onChange={e => handleInputChange("email", e.target.value)}
              error={errors.email}
            />
          </div>

          <FormInput
            label="Purpose"
            id="purpose"
            as="select"
            required
            ref={purposeRef}
            value={formData.purpose}
            onChange={e => handleInputChange("purpose", e.target.value)}
            error={errors.purpose}
          >
            <option value="" disabled>Select a reason for contacting</option>
            {PURPOSE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </FormInput>

          <FormInput
            label="Message"
            id="message"
            as="textarea"
            required
            rows={4}
            ref={messageRef}
            placeholder="How can I help you? Please share details..."
            value={formData.message}
            onChange={e => handleInputChange("message", e.target.value)}
            error={errors.message}
            style={{ resize: "vertical" }}
          />

          <FormInput
            label="Company / Organization"
            id="company"
            placeholder="e.g., Acme Corp (Optional)"
            value={formData.company}
            onChange={e => handleInputChange("company", e.target.value)}
            error={errors.company}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormInput
              label="LinkedIn URL"
              id="linkedin_url"
              type="url"
              ref={linkedinRef}
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedin_url}
              onChange={e => handleInputChange("linkedin_url", e.target.value)}
              error={errors.linkedin_url}
            />
            <FormInput
              label="GitHub URL"
              id="github_url"
              type="url"
              ref={githubRef}
              placeholder="https://github.com/..."
              value={formData.github_url}
              onChange={e => handleInputChange("github_url", e.target.value)}
              error={errors.github_url}
            />
          </div>

          <div className="turnstile-wrapper">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              onSuccess={setTurnstileToken}
              onError={() => addToast("CAPTCHA error. Please try again.", "error")}
              onExpire={() => setTurnstileToken("")}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-color-1 premium-submit-btn" 
            disabled={submitting || !turnstileToken}
            style={{ opacity: (submitting || !turnstileToken) ? 0.7 : 1, cursor: (submitting || !turnstileToken) ? "not-allowed" : "pointer" }}
          >
            {submitting ? (
              <>
                <svg className="spin-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Sending...
              </>
            ) : btnText}
          </button>
        </form>
      </div>
    </div>
  );
}
