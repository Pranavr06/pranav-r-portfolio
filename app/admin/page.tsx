"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FileText, Briefcase, MessageSquare, Plus, Activity, Clock, FileEdit, MessageCircle,
  ShieldAlert, ShieldCheck, AlertTriangle, Globe, Mail, ChevronDown, ChevronUp
} from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: { total: 0, thisMonth: 0, active: 0 },
    blogs: { total: 0, thisMonth: 0 },
    testimonials: { total: 0, pending: 0 },
    drafts: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        const { data: testimonialsData } = await supabase.from("testimonials").select("id, is_approved");
        const pendingTestimonials = testimonialsData?.filter(t => t.is_approved === false).length || 0;

        setStats({
          projects: { total: projectsData?.length || 0, thisMonth: projectsThisMonth, active: activeProjects },
          blogs: { total: blogsData?.length || 0, thisMonth: blogsThisMonth },
          testimonials: { total: testimonialsData?.length || 0, pending: pendingTestimonials },
          drafts: 0
        });

        // Fetch Recent Activity from the activity_logs table
        const { data: activityData, error: activityError } = await supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(15);

        if (!activityError && activityData) {
          setRecentActivity(activityData);
        } else {
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
          <div className="admin-table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gridTemplateColumns: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--admin-text-main)" }}>
              <Activity size={16} />
              Recent Activity
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>&larr;</span> Slide rows to view all words <span>&rarr;</span>
            </span>
          </div>

          <div className="admin-activity-slider">
            <div style={{ minWidth: "580px", width: "100%" }}>
              {recentActivity.length > 0 ? recentActivity.map((activity, idx) => {
                const rowKey = activity.id || String(idx);
                const isExpanded = expandedId === rowKey;

                // Extract and format properties
                let displayTitle = activity.title || "Untitled Activity";
                let displayEmail = activity.email || null;
                let displayIp = activity.ip_address || null;
                let displayUserAgent = activity.user_agent || null;
                let displayStatus = activity.status || null;
                let parsedDetails: any = null;

                if (activity.description) {
                  try {
                    parsedDetails = typeof activity.description === 'string' ? JSON.parse(activity.description) : activity.description;
                    if (!displayEmail && parsedDetails?.email) displayEmail = parsedDetails.email;
                    if (!displayEmail && parsedDetails?.meta?.email) displayEmail = parsedDetails.meta.email;
                    if (!displayIp && parsedDetails?.ip) displayIp = parsedDetails.ip;
                    if (!displayUserAgent && parsedDetails?.user_agent) displayUserAgent = parsedDetails.user_agent;
                    if (!displayStatus && parsedDetails?.status) displayStatus = parsedDetails.status;
                  } catch (e) {
                    // not JSON string
                  }
                }

                // If legacy title is an unreadable 64-char hash
                if (displayTitle && /^[a-f0-9]{64}$/i.test(displayTitle.trim())) {
                  if (displayEmail) {
                    displayTitle = `Login Attempt: ${displayEmail}`;
                  } else if (displayIp) {
                    displayTitle = `Login Attempt from ${displayIp}`;
                  } else {
                    displayTitle = `Rate Limit IP Hash: ${displayTitle.slice(0, 8)}...${displayTitle.slice(-8)}`;
                  }
                }

                // Icon and Color mapping
                let Icon: any = FileText;
                let bgColor = "rgba(107, 114, 128, 0.1)";
                let color = "var(--admin-text-muted)";

                const typeLower = (activity.type || "").toLowerCase();
                const actionLower = (activity.action || "").toLowerCase();

                if (typeLower.includes('admin_login') || typeLower.startsWith('rate_limit')) {
                  if (actionLower === 'success') {
                    Icon = ShieldCheck;
                    bgColor = "rgba(16, 185, 129, 0.1)";
                    color = "#10b981";
                  } else if (actionLower.includes('lockout') || displayStatus === 'blocked') {
                    Icon = ShieldAlert;
                    bgColor = "rgba(239, 68, 68, 0.1)";
                    color = "#ef4444";
                  } else if (actionLower.includes('fail') || actionLower.includes('unauthorized')) {
                    Icon = ShieldAlert;
                    bgColor = "rgba(239, 68, 68, 0.1)";
                    color = "#ef4444";
                  } else {
                    Icon = AlertTriangle;
                    bgColor = "rgba(245, 158, 11, 0.1)";
                    color = "#f59e0b";
                  }
                } else if (typeLower === 'project') {
                  Icon = Briefcase;
                  bgColor = "rgba(59, 130, 246, 0.1)";
                  color = "#3b82f6";
                } else if (typeLower === 'blog') {
                  Icon = FileText;
                  bgColor = "rgba(16, 185, 129, 0.1)";
                  color = "#10b981";
                } else if (typeLower === 'message' || typeLower === 'contact') {
                  Icon = MessageSquare;
                  bgColor = "rgba(245, 158, 11, 0.1)";
                  color = "#f59e0b";
                } else if (typeLower.includes('testimonial')) {
                  Icon = MessageCircle;
                  if (typeLower.includes('login') || actionLower === 'approved') {
                    bgColor = "rgba(16, 185, 129, 0.1)";
                    color = "#10b981";
                  } else {
                    bgColor = "rgba(139, 92, 246, 0.1)";
                    color = "#8b5cf6";
                  }
                } else if (typeLower === 'resume') {
                  Icon = FileText;
                  bgColor = "rgba(236, 72, 153, 0.1)";
                  color = "#ec4899";
                }

                // Date formatting with exact time
                const logDate = new Date(activity.created_at);
                const formattedDate = logDate.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const formattedTime = logDate.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={rowKey} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <div 
                      className="admin-activity-row"
                      onClick={() => setExpandedId(isExpanded ? null : rowKey)}
                      style={{ 
                        padding: "1rem 1.5rem", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        transition: "background-color 0.2s ease",
                        backgroundColor: isExpanded ? "var(--admin-card-hover)" : "transparent"
                      }}
                      onMouseEnter={(e) => {
                        if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--admin-card-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          width: "38px", 
                          height: "38px", 
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
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontWeight: 600, 
                            fontSize: "0.95rem", 
                            color: "var(--admin-text-main)", 
                            marginBottom: "0.25rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            whiteSpace: "nowrap"
                          }}>
                            <span>{displayTitle}</span>
                            {displayStatus && (
                              <span className="admin-pill-badge" style={{
                                backgroundColor: displayStatus === 'success' ? 'rgba(16, 185, 129, 0.15)' :
                                                displayStatus === 'blocked' || displayStatus === 'failed' ? 'rgba(239, 68, 68, 0.15)' :
                                                'rgba(245, 158, 11, 0.15)',
                                color: displayStatus === 'success' ? '#10b981' :
                                       displayStatus === 'blocked' || displayStatus === 'failed' ? '#ef4444' :
                                       '#f59e0b',
                                borderColor: 'transparent'
                              }}>
                                {displayStatus}
                              </span>
                            )}
                          </div>
                          
                          <div style={{ 
                            color: "var(--admin-text-muted)", 
                            fontSize: "0.82rem", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "0.5rem", 
                            whiteSpace: "nowrap" 
                          }}>
                            <span style={{ textTransform: "capitalize", fontWeight: 500 }}>
                              {(activity.type === 'testimonial_login' ? 'Testimonial Sign-In' : `${activity.type} ${activity.action}`).replace(/_/g, ' ')}
                            </span>
                            <span>&bull;</span>
                            <span>{formattedDate} at {formattedTime}</span>

                            {displayEmail && (
                              <>
                                <span>&bull;</span>
                                <span className="admin-pill-badge">
                                  <Mail size={11} /> {displayEmail}
                                </span>
                              </>
                            )}

                            {displayIp && (
                              <>
                                <span>&bull;</span>
                                <span className="admin-pill-badge">
                                  <Globe size={11} /> {displayIp}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ color: "var(--admin-text-muted)", flexShrink: 0, paddingLeft: "0.5rem" }}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Expandable Details Drawer */}
                    {isExpanded && (
                      <div className="admin-activity-details-drawer">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "0.5rem" }}>
                          <div>
                            <strong style={{ color: "var(--admin-text-main)" }}>Email:</strong> {displayEmail || "N/A"}
                          </div>
                          <div>
                            <strong style={{ color: "var(--admin-text-main)" }}>IP Address:</strong> {displayIp || "N/A"}
                          </div>
                          <div>
                            <strong style={{ color: "var(--admin-text-main)" }}>Status:</strong> {displayStatus || activity.action}
                          </div>
                          <div>
                            <strong style={{ color: "var(--admin-text-main)" }}>Timestamp:</strong> {logDate.toLocaleString()}
                          </div>
                        </div>

                        {displayUserAgent && (
                          <div style={{ marginTop: "0.4rem", wordBreak: "break-all" }}>
                            <strong style={{ color: "var(--admin-text-main)" }}>User Agent:</strong> {displayUserAgent}
                          </div>
                        )}

                        {activity.description && (
                          <div style={{ marginTop: "0.4rem" }}>
                            <strong style={{ color: "var(--admin-text-main)" }}>Raw Metadata / Details:</strong>
                            <pre style={{ 
                              marginTop: "0.25rem", 
                              padding: "0.5rem", 
                              backgroundColor: "var(--admin-bg-primary)", 
                              borderRadius: "4px", 
                              border: "1px solid var(--admin-border)",
                              fontSize: "0.75rem",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-all"
                            }}>
                              {typeof activity.description === 'string' && activity.description.startsWith('{') 
                                ? JSON.stringify(JSON.parse(activity.description), null, 2)
                                : activity.description}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div style={{ padding: "3rem 2rem", textAlign: "center", color: "var(--admin-text-muted)" }}>
                  No recent activity logs found.
                </div>
              )}
            </div>
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
            <Link href="/admin/experiences" className="admin-btn admin-btn-secondary" style={{ justifyContent: "flex-start" }}>
              Manage Professional Experiences &rarr;
            </Link>
            <Link href="/admin/analytics" className="admin-btn admin-btn-secondary" style={{ justifyContent: "flex-start" }}>
              View Portfolio Analytics &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
