"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedLockout = localStorage.getItem("lockoutUntil");
    if (storedLockout && Date.now() < parseInt(storedLockout)) {
      setLockoutTime(parseInt(storedLockout));
    } else if (storedLockout) {
      localStorage.removeItem("lockoutUntil");
      localStorage.removeItem("loginAttempts");
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTime && Date.now() < lockoutTime) {
      interval = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setLockoutTime(null);
          localStorage.removeItem("lockoutUntil");
          localStorage.removeItem("loginAttempts");
          setError("");
        } else {
          // Force re-render to update the timer message
          setLockoutTime(lockoutTime); 
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingSeconds = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Too many attempts. Please try again in ${remainingSeconds} seconds.`);
      return;
    }

    setLoading(true);

    if (isResetMode) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/update-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Success! Password reset link has been sent to your email.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        const attempts = parseInt(localStorage.getItem("loginAttempts") || "0") + 1;
        if (attempts >= 5) {
          const lockoutEnd = Date.now() + 2 * 60 * 1000; // 2 minutes cooldown
          localStorage.setItem("lockoutUntil", lockoutEnd.toString());
          localStorage.setItem("loginAttempts", "0");
          setLockoutTime(lockoutEnd);
          setError("Too many failed attempts. Device locked for 2 minutes.");
        } else {
          localStorage.setItem("loginAttempts", attempts.toString());
          setError(`Invalid email or password. Attempt ${attempts} of 5.`);
        }
      } else {
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("lockoutUntil");
        window.location.href = "/admin";
      }
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .admin-login-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }
        @media (max-width: 768px) {
          .admin-login-wrapper {
            padding-top: 120px;
            align-items: flex-start;
          }
        }
        .input-custom {
          border: 1px solid #ccc !important;
        }
        body.dark-theme .input-custom, [data-theme="dark"] .input-custom {
          border: 1px solid #555 !important;
        }
        .input-custom:focus {
          border-color: #007bff !important;
          outline: 2px solid rgba(0, 123, 255, 0.25) !important;
        }
      `}</style>
      <div className="admin-login-wrapper">
        <div className="details-container color-container" style={{ width: "100%", maxWidth: "450px", padding: "3rem 2rem", borderRadius: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <div style={{ marginBottom: "2rem" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto", color: "var(--text-color)" }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <h2 className="title" style={{ fontSize: "2rem", marginTop: "1rem" }}>{isResetMode ? "Reset Password" : "Admin Portal"}</h2>
          <p style={{ color: "var(--text-color-light)", marginTop: "0.5rem" }}>
            {isResetMode ? "Enter your email to receive a reset link." : "Sign in to manage your portfolio content."}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left" }}>
          <div>
            <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="input-custom"
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: "var(--bg-color)", color: "inherit", fontSize: "1rem", outline: "none", transition: "all 0.3s" }}
            />
          </div>
          
          {!isResetMode && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label htmlFor="password" style={{ fontWeight: 500 }}>Password</label>
                <button 
                  type="button" 
                  onClick={() => { setIsResetMode(true); setError(""); setMessage(""); }}
                  style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "0.9rem", padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-custom"
                  style={{ width: "100%", padding: "0.75rem 1rem", paddingRight: "3rem", borderRadius: "0.5rem", background: "var(--bg-color)", color: "inherit", fontSize: "1rem", outline: "none", transition: "all 0.3s" }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "gray", padding: "0" }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && <p style={{ color: "#d93025", fontSize: "0.95rem", textAlign: "center", margin: 0, padding: "0.5rem", background: "rgba(217, 48, 37, 0.1)", borderRadius: "0.5rem" }}>{error}</p>}
          {message && <p style={{ color: "#188038", fontSize: "0.95rem", textAlign: "center", margin: 0, padding: "0.5rem", background: "rgba(24, 128, 56, 0.1)", borderRadius: "0.5rem" }}>{message}</p>}

          <button type="submit" className="btn btn-color-1" style={{ width: "100%", padding: "1rem", fontSize: "1rem", marginTop: "0.5rem" }} disabled={loading}>
            {loading ? "Processing..." : (isResetMode ? "Send Reset Link" : "Sign In with Password")}
          </button>

          {isResetMode && (
            <button 
              type="button" 
              onClick={() => { setIsResetMode(false); setError(""); setMessage(""); }}
              style={{ background: "none", border: "none", color: "var(--text-color)", cursor: "pointer", fontSize: "0.95rem", padding: "0.5rem", marginTop: "-0.5rem", textDecoration: "underline" }}
            >
              Back to Login
            </button>
          )}
        </form>
      </div>
      </div>
    </>
  );
}
