"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import "./admin.css";
import { useToast } from "@/components/ToastProvider";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Award, 
  MessageSquare, 
  MessageCircle, 
  Trash2,
  LogOut,
  Menu,
  X,
  Search,
  Activity,
  Layers,
  Book,
  Moon,
  Sun
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const { addToast } = useToast();

  // Exclude login page from the dashboard layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && !isLoginPage) {
        router.push("/admin/login");
      } else if (session && isLoginPage) {
        router.push("/admin");
      } else {
        setUser(session?.user || null);
        setLoading(false);
      }
    };
    
    checkAuth();

    // Theme initialization
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("dark-theme", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.body.classList.add("dark-theme");
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [pathname, router, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleRegisterPasskey = async () => {
    setIsRegisteringPasskey(true);
    try {
      const { data, error } = await supabase.auth.passkey.startRegistration();
      if (error) {
        addToast("Passkey setup failed: " + error.message, "error");
      } else {
        addToast("Passkey successfully registered! You can now use your biometrics to log in.", "success");
      }
    } catch (err: any) {
      addToast("Error setting up passkey: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-theme", newTheme === "dark");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading Admin...</div>;
  }

  const navItems = [
    { name: "Overview", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Notes", path: "/admin/notes", icon: <Book size={18} /> },
    { name: "Experience Hubs", path: "/admin/experience-hubs", icon: <Layers size={18} /> },
    { name: "Experiences", path: "/admin/experiences", icon: <Activity size={18} /> },
    { name: "Certificates", path: "/admin/certificates", icon: <Award size={18} /> },
    { name: "Projects", path: "/admin/projects", icon: <Briefcase size={18} /> },
    { name: "Testimonials", path: "/admin/testimonials", icon: <MessageCircle size={18} /> },
    { name: "Blogs", path: "/admin/blogs", icon: <FileText size={18} /> },
    { name: "Messages", path: "/admin/contacts", icon: <MessageSquare size={18} /> },
    { name: "Trash", path: "/admin/trash", icon: <Trash2 size={18} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 30 }} 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.03em" }}>Admin Panel</span>
          <button className="mobile-only" onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-main)" }}>
            <X size={20} />
          </button>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
          <div style={{ padding: "1rem", borderTop: "1px solid var(--admin-border)" }}>
            <button 
              onClick={handleRegisterPasskey} 
              className="admin-nav-item" 
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-main)", marginBottom: "0.5rem" }}
              disabled={isRegisteringPasskey}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "1rem" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
              {isRegisteringPasskey ? "Setting Up..." : "Setup Passkey"}
            </button>
            <button onClick={handleLogout} className="admin-nav-item" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button className="mobile-only" onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-main)", display: "flex" }}>
              <Menu size={24} />
            </button>
            <div className="desktop-only" style={{ fontWeight: 600, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
              {pathname === "/admin" ? "Overview" : pathname.split("/")[2]?.charAt(0).toUpperCase() + pathname.split("/")[2]?.slice(1)}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              onClick={toggleTheme} 
              className="admin-btn admin-btn-icon" 
              aria-label="Toggle theme"
              style={{ padding: "0.4rem", borderRadius: "50%" }}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <span style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", fontWeight: 500 }} className="desktop-only">
              {user?.email}
            </span>
            <Link href="/" target="_blank" className="admin-btn admin-btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
              View Site &rarr;
            </Link>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
      
      {/* Hide mobile toggle on desktop */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
        @media (max-width: 768px) { .desktop-only { display: none !important; } }
      `}} />
    </div>
  );
}
