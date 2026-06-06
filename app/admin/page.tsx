"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Briefcase, MessageSquare, Plus, Activity, Clock, FileEdit, MessageCircle } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: { total: 0, thisMonth: 0, active: 0 },
    blogs: { total: 0, thisMonth: 0 },
    testimonials: { total: 0, pending: 0 },
    drafts: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

        // Fetch Projects
        const { data: projectsData } = await supabase.from("projects").select("id, status, created_at");
        const projectsThisMonth = projectsData?.filter(p => p.created_at >= startOfMonth).length || 0;
        const activeProjects = projectsData?.filter(p => p.status === 'In Progress').length || 0;
        
        // Fetch Blogs
        const { data: blogsData } = await supabase.from("blogs").select("id, created_at");
        const blogsThisMonth = blogsData?.filter(b => b.created_at >= startOfMonth).length || 0;
        
        // Fetch Testimonials
        // Assuming testimonials have an 'approved' or 'is_approved' column, if not we will just fake it for UI
        const { data: testimonialsData } = await supabase.from("testimonials").select("id, is_approved");
        const pendingTestimonials = testimonialsData?.filter(t => t.is_approved === false).length || 0;

        setStats({
          projects: { total: projectsData?.length || 0, thisMonth: projectsThisMonth, active: activeProjects },
          blogs: { total: blogsData?.length || 0, thisMonth: blogsThisMonth },
          testimonials: { total: testimonialsData?.length || 0, pending: pendingTestimonials },
          drafts: 0 // Will implement real drafts logic next
        });

        // Fetch Recent Activity from the activity_logs table
        const { data: activityData, error: activityError } = await supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8);

        if (!activityError && activityData) {
          setRecentActivity(activityData);
        } else {
          // Fallback if table doesn't exist yet
          setRecentActivity([]);
        }
        
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ height: "40px", width: "200px", background: "var(--admin-border)", borderRadius: "6px", animation: "pulse 2s infinite" }}></div>
        <div className="admin-metrics-grid" style={{ marginTop: "1rem" }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="admin-stat-card" style={{ height: "120px", background: "var(--admin-border)", animation: "pulse 2s infinite" }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Overview</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Welcome back. Here's what's happening today.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin/blogs" className="admin-btn admin-btn-secondary">
            <FileEdit size={16} style={{ marginRight: "0.5rem" }} />
            New Post
          </Link>
          <Link href="/admin/projects" className="admin-btn admin-btn-primary">
            <Plus size={16} style={{ marginRight: "0.5rem" }} />
            Add Project
          </Link>
        </div>
      </div>

      <div className="admin-metrics-grid">
        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="admin-stat-label">Total Projects</span>
            <Briefcase size={20} color="var(--admin-text-muted)" />
          </div>
          <span className="admin-stat-value">{stats.projects.total}</span>
          <div className="admin-stat-meta positive">+{stats.projects.thisMonth} this month</div>
          {stats.projects.active > 0 && <div className="admin-stat-meta neutral" style={{ marginTop: 0 }}>{stats.projects.active} active projects</div>}
        </div>
        
        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="admin-stat-label">Published Blogs</span>
            <FileText size={20} color="var(--admin-text-muted)" />
          </div>
          <span className="admin-stat-value">{stats.blogs.total}</span>
          <div className="admin-stat-meta positive">+{stats.blogs.thisMonth} this month</div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="admin-stat-label">Testimonials</span>
            <MessageSquare size={20} color="var(--admin-text-muted)" />
          </div>
          <span className="admin-stat-value">{stats.testimonials.total}</span>
          <div className={`admin-stat-meta ${stats.testimonials.pending > 0 ? 'warning' : 'neutral'}`}>
            {stats.testimonials.pending} pending review
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="admin-stat-label">Drafts</span>
            <FileEdit size={20} color="var(--admin-text-muted)" />
          </div>
          <span className="admin-stat-value">{stats.drafts}</span>
          <div className="admin-stat-meta neutral">Across all content</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        
        {/* Recent Activity */}
        <div className="admin-table-container">
          <div className="admin-table-header" style={{ display: "flex", justifyContent: "space-between", gridTemplateColumns: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--admin-text-main)" }}>
              <Activity size={16} />
              Recent Activity
            </div>
          </div>
          <div style={{ padding: "0" }}>
            {recentActivity.length > 0 ? recentActivity.map((activity, idx) => {
              // Determine icon and color based on type/action
              let Icon = FileText;
              let bgColor = "rgba(107, 114, 128, 0.1)";
              let color = "var(--admin-text-muted)";

              if (activity.type === 'project') {
                Icon = Briefcase;
                bgColor = "rgba(59, 130, 246, 0.1)"; // Blue
                color = "#3b82f6";
              } else if (activity.type === 'blog') {
                Icon = FileText;
                bgColor = "rgba(16, 185, 129, 0.1)"; // Green
                color = "#10b981";
              } else if (activity.type === 'message' || activity.type === 'contact') {
                Icon = MessageSquare;
                bgColor = "rgba(245, 158, 11, 0.1)"; // Orange
                color = "#f59e0b";
              } else if (activity.type === 'testimonial') {
                Icon = MessageCircle;
                if (activity.action === 'approved') {
                  bgColor = "rgba(16, 185, 129, 0.1)";
                  color = "#10b981";
                } else {
                  bgColor = "rgba(139, 92, 246, 0.1)"; // Purple
                  color = "#8b5cf6";
                }
              } else if (activity.type === 'resume') {
                Icon = FileText;
                bgColor = "rgba(236, 72, 153, 0.1)"; // Pink
                color = "#ec4899";
              }

              return (
                <div key={idx} className="admin-activity-row" style={{ 
                  padding: "1.25rem 1.5rem", 
                  borderBottom: "1px solid var(--admin-border)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  transition: "background-color 0.2s ease, border-color 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ 
                    width: "36px", 
                    height: "36px", 
                    borderRadius: "50%", 
                    backgroundColor: bgColor, 
                    color: color,
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "0.95rem", color: "var(--admin-text-main)", marginBottom: "0.2rem" }}>
                      {activity.title}
                    </div>
                    <div style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{activity.type} {activity.action}</span>
                      <span style={{ fontSize: "1rem", lineHeight: 0 }}>&bull;</span>
                      <span>{new Date(activity.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ padding: "3rem 2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
                No recent activity logs found.
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="admin-table-container" style={{ height: "fit-content" }}>
          <div className="admin-table-header" style={{ display: "flex", justifyContent: "space-between", gridTemplateColumns: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--admin-text-main)" }}>
              <Clock size={16} />
              Quick Links
            </div>
          </div>
          <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link href="/admin/testimonials" className="admin-btn admin-btn-secondary" style={{ justifyContent: "flex-start" }}>
              Review Pending Testimonials &rarr;
            </Link>
            <Link href="/admin/contacts" className="admin-btn admin-btn-secondary" style={{ justifyContent: "flex-start" }}>
              Check Unread Messages &rarr;
            </Link>
            <Link href="/admin/trash" className="admin-btn admin-btn-secondary" style={{ justifyContent: "flex-start", color: "var(--admin-text-muted)" }}>
              Manage Trash &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
