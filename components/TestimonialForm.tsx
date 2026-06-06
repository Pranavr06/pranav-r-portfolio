"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { isValidLinkedInUrl, isValidGithubUrl } from "@/lib/validators";
import { useToast } from "./ToastProvider";
import FormInput from "./ui/FormInput";

export default function TestimonialForm({ isAdminMode = false }: { isAdminMode?: boolean }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    linkedin_url: "",
    github_url: "",
    email: "",
    avatar_url: "",
    is_approved: true,
    is_verified: false,
    is_github_verified: false,
    sort_order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const githubRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        if (session.user.user_metadata?.full_name) {
          setFormData(prev => ({ ...prev, name: session.user.user_metadata.full_name }));
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        if (session.user.user_metadata?.full_name && !formData.name) {
          setFormData(prev => ({ ...prev, name: session.user.user_metadata.full_name }));
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkEditState = () => {
    const editDataStr = sessionStorage.getItem("editTestimonial");
    if (!editDataStr) return;
    try {
      const parsed = JSON.parse(editDataStr);
      if (!user) return;
      
      if (user.id !== parsed.user_id && user.email !== 'pranavkundapura06@gmail.com') {
        sessionStorage.removeItem("editTestimonial");
        return;
      }
      
      setEditId(parsed.id);
      setFormData({
        name: parsed.name || "",
        role: parsed.role || "",
        message: parsed.message || "",
        linkedin_url: parsed.linkedin_url || "",
        github_url: parsed.github_url || "",
        email: parsed.email || "",
        avatar_url: parsed.avatar_url || "",
        is_approved: parsed.is_approved ?? true,
        is_verified: parsed.is_verified ?? false,
        is_github_verified: parsed.is_github_verified ?? false,
        sort_order: parsed.sort_order || 0,
      });

      setTimeout(() => {
        document.getElementById("testimonial-form")?.scrollIntoView({ behavior: "smooth" });
        nameRef.current?.focus();
      }, 100);

    } catch (e) {
      sessionStorage.removeItem("editTestimonial");
    }
  };

  useEffect(() => {
    checkEditState();
  }, [user]);

  useEffect(() => {
    window.addEventListener("testimonial-edit", checkEditState);
    return () => window.removeEventListener("testimonial-edit", checkEditState);
  }, [user]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      }
    });
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("editTestimonial");
    setEditId(null);
    await supabase.auth.signOut();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Please enter your full name.";
    if (!formData.role.trim()) newErrors.role = "Please enter your role or title.";
    if (!formData.message.trim()) newErrors.message = "Testimonial message cannot be empty.";
    
    if (!formData.linkedin_url.trim()) {
      newErrors.linkedin_url = "LinkedIn URL is required.";
    } else if (!isValidLinkedInUrl(formData.linkedin_url)) {
      newErrors.linkedin_url = "Please enter a valid LinkedIn profile URL.";
    }

    if (formData.github_url && !isValidGithubUrl(formData.github_url)) {
      newErrors.github_url = "Please enter a valid GitHub profile URL.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (newErrors.role) roleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

    if (!user) {
      addToast("You must be logged in to submit a testimonial.", "error");
      setSubmitting(false);
      return;
    }

    if (!isAdminMode && !turnstileToken) {
      addToast("Please complete the CAPTCHA verification.", "error");
      setSubmitting(false);
      return;
    }

    try {
      const isEdit = !!editId && !isAdminMode;
      const url = isAdminMode ? `/api/admin/testimonials` : (isEdit ? `/api/testimonials/${editId}` : "/api/testimonials");
      const method = isAdminMode ? "POST" : (isEdit ? "PUT" : "POST");
      
      const { data: { session } } = await supabase.auth.getSession();
      const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

      const payload = isAdminMode ? {
        action: editId ? 'update' : 'create',
        id: editId,
        updates: { ...formData }
      } : {
        ...formData,
        email: user.email,
        avatar_url: formData.avatar_url || userAvatar || "",
        provider: user.app_metadata?.provider || "unknown",
        user_id: user.id,
        token: turnstileToken,
      };

      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          ...(session ? { "Authorization": `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      if (isAdminMode) {
        addToast(editId ? "Testimonial updated successfully." : "Testimonial added manually.", "success");
        if (editId) {
          sessionStorage.removeItem("editTestimonial");
          setEditId(null);
        }
        setFormData({
          name: "", role: "", message: "", linkedin_url: "", github_url: "",
          email: "", avatar_url: "", is_approved: true, is_verified: false, is_github_verified: false, sort_order: 0
        });
      } else {
        addToast(
          isEdit ? "Your testimonial has been updated and sent for re-review." : (data.message || "Testimonial submitted successfully and is pending review."), 
          "success"
        );
        
        sessionStorage.removeItem("editTestimonial");
        setEditId(null);
        setFormData({
          name: user.user_metadata?.full_name || "", role: "", message: "", linkedin_url: "", github_url: "",
          email: "", avatar_url: "", is_approved: true, is_verified: false, is_github_verified: false, sort_order: 0
        });
        turnstileRef.current?.reset();
        setTurnstileToken("");
      }
      setErrors({});
      
    } catch (err: any) {
      addToast(err.message || "Failed to submit testimonial.", "error");
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

  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div id="testimonial-form" className="two-column-layout animate-slide-up">
      <div className="left-info-panel">
        <div>
          <h2>{isAdminMode ? (editId ? "Edit Testimonial (Admin)" : "Add Testimonial (Admin)") : (editId ? "Editing Testimonial" : "Leave a Testimonial")}</h2>
          {!isAdminMode && <p className="contact-microcopy" style={{ marginTop: "0.5rem" }}>Please review the moderation policies before submitting.</p>}
        </div>

        {!isAdminMode && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <div className="testimonial-rule">
              <svg className="testimonial-rule-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span className="testimonial-rule-text">All testimonials are manually reviewed by admin before publication.</span>
            </div>
            <div className="testimonial-rule">
              <svg className="testimonial-rule-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 11.08 22 12 16.07 21.14 12 19 7.93 21.14 2 12 2 11.08"></polyline><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span className="testimonial-rule-text">Verified profiles help maintain authenticity and reduce spam.</span>
            </div>
            <div className="testimonial-rule">
              <svg className="testimonial-rule-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span className="testimonial-rule-text">Public testimonials display your name, role, avatar, and verified links.</span>
            </div>
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          {!isAdminMode && user && (
            <p className="contact-microcopy" style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "1rem" }}>
              * Indicates required fields
            </p>
          )}
          {user && (
             <div className="identity-card">
               <div className="identity-card-header">
                 <img 
                   src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')}&background=random`} 
                   alt="Avatar" 
                   className="identity-card-avatar" 
                 />
                 <div className="identity-card-info">
                   <span className="identity-card-email">{user.email}</span>
                   <span className="identity-card-status">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     Verified Account
                   </span>
                 </div>
               </div>
               <button type="button" onClick={handleLogout} className="btn-signout-subtle">
                 Sign out
               </button>
             </div>
          )}
        </div>
      </div>

      <div className="right-form-panel">
        {!user && !isAdminMode ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "300px", padding: "3rem 1.5rem", border: "1px dashed rgba(0,0,0,0.1)", borderRadius: "1rem", textAlign: "center" }}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem", fontWeight: "bold" }}>Join to Leave a Testimonial</h3>
            <div className="auth-cta-card" style={{ padding: 0, width: "100%", maxWidth: "400px", margin: "0 auto", border: "none", boxShadow: "none", background: "transparent" }}>
               <p style={{ fontSize: "0.95rem", lineHeight: 1.5, opacity: 0.8, marginBottom: "1.5rem" }}>
                 Google sign-in helps maintain authentic and trusted testimonials.
               </p>
               <button onClick={handleLogin} className="btn btn-color-2" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8rem 1.25rem", width: "fit-content", fontSize: "1rem", whiteSpace: "nowrap", margin: "0 auto" }}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" style={{ flexShrink: 0, minWidth: "24px", minHeight: "24px" }}>
                   <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                   <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                   <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                   <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                 </svg>
                 Sign in with Google
               </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <FormInput
              label="Full Name"
              id="name"
              required
              ref={nameRef}
              value={formData.name}
              onChange={e => handleInputChange("name", e.target.value)}
              error={errors.name}
            />

            <FormInput
              label="Role / Title"
              id="role"
              required
              ref={roleRef}
              placeholder="e.g., Senior Developer at XYZ"
              value={formData.role}
              onChange={e => handleInputChange("role", e.target.value)}
              error={errors.role}
            />

            <FormInput
              label="Testimonial Message"
              id="message"
              as="textarea"
              required
              rows={4}
              ref={messageRef}
              placeholder="Share your experience working with me..."
              value={formData.message}
              onChange={e => handleInputChange("message", e.target.value)}
              error={errors.message}
              style={{ resize: "vertical" }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <FormInput
                label="LinkedIn URL"
                id="linkedin"
                type="url"
                required
                ref={linkedinRef}
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin_url}
                onChange={e => handleInputChange("linkedin_url", e.target.value)}
                error={errors.linkedin_url}
              />
              <FormInput
                label="GitHub URL"
                id="github"
                type="url"
                ref={githubRef}
                placeholder="https://github.com/..."
                value={formData.github_url}
                onChange={e => handleInputChange("github_url", e.target.value)}
                error={errors.github_url}
              />
            </div>

            {isAdminMode && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                  <FormInput
                    label="Email (Optional)"
                    id="email"
                    type="email"
                    ref={emailRef}
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={e => handleInputChange("email", e.target.value)}
                    error={errors.email}
                  />
                  <FormInput
                    label="Avatar URL (Optional)"
                    id="avatar_url"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={formData.avatar_url}
                    onChange={e => handleInputChange("avatar_url", e.target.value)}
                    error={errors.avatar_url}
                  />
                </div>

                <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", flexWrap: "wrap", padding: "1rem", background: "rgba(0,0,0,0.02)", borderRadius: "0.5rem", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <input type="checkbox" checked={formData.is_approved} onChange={e => setFormData({ ...formData, is_approved: e.target.checked })} />
                    Approved Status
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <input type="checkbox" checked={formData.is_verified} onChange={e => setFormData({ ...formData, is_verified: e.target.checked })} />
                    Verified LinkedIn
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <input type="checkbox" checked={formData.is_github_verified} onChange={e => setFormData({ ...formData, is_github_verified: e.target.checked })} />
                    Verified GitHub
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                    Sort Order:
                    <input type="number" className="premium-input" value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} style={{ width: "80px", padding: "0.4rem" }} />
                  </label>
                </div>
              </>
            )}

            {!isAdminMode && (
              <div className="turnstile-wrapper">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                  onSuccess={setTurnstileToken}
                  onError={() => addToast("CAPTCHA error. Please try again.", "error")}
                  onExpire={() => setTurnstileToken("")}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-color-1 premium-submit-btn" 
                disabled={submitting || (!isAdminMode && !turnstileToken)}
                style={{ flexGrow: 1, opacity: (submitting || (!isAdminMode && !turnstileToken)) ? 0.7 : 1, cursor: (submitting || (!isAdminMode && !turnstileToken)) ? "not-allowed" : "pointer" }}
              >
                {submitting ? (
                  <>
                    <svg className="spin-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Saving...
                  </>
                ) : (isAdminMode ? (editId ? "Save Changes" : "Add Testimonial") : (editId ? "Save Changes" : "Submit Testimonial"))}
              </button>
              
              {editId && (
                <button 
                  type="button" 
                  onClick={() => {
                    sessionStorage.removeItem("editTestimonial");
                    setEditId(null);
                    setFormData({ name: user?.user_metadata?.full_name || "", role: "", message: "", linkedin_url: "", github_url: "", email: "", avatar_url: "", is_approved: true, is_verified: false, is_github_verified: false, sort_order: 0 });
                    setErrors({});
                  }}
                  disabled={submitting}
                  className="btn btn-color-2"
                  style={{ width: "120px", display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
