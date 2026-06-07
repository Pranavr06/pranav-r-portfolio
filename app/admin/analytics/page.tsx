"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "./actions";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";
import { Users, MousePointerClick, FileText, Clock, ExternalLink } from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await getAnalyticsData(days);
        setData(result);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [days]);

  if (loading) {
    return (
      <div className="admin-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg className="spin-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--admin-primary)' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          <p style={{ color: 'var(--admin-text-muted)' }}>Loading Analytics Data...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="admin-container">No analytics data available. Did you set up the Supabase tables?</div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="admin-container animate-fade-in" style={{ maxWidth: '1200px' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="admin-page-title">Analytics & Insights</h1>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.95rem" }}>Understand your portfolio traffic and engagement.</p>
        </div>
        <select 
          value={days} 
          onChange={(e) => setDays(Number(e.target.value))}
          className="admin-input"
          style={{ width: "auto", padding: "0.5rem 1rem", borderRadius: "8px" }}
        >
          <option value={1}>Today</option>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="admin-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: "12px", color: "#3b82f6" }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>Unique Visitors</p>
            <h3 style={{ fontSize: "1.8rem", margin: "0.2rem 0 0 0" }}>{data.overview.totalVisitors}</h3>
          </div>
        </div>
        
        <div className="admin-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "12px", color: "#10b981" }}>
            <FileText size={24} />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>Page Views</p>
            <h3 style={{ fontSize: "1.8rem", margin: "0.2rem 0 0 0" }}>{data.overview.totalViews}</h3>
          </div>
        </div>

        <div className="admin-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(245, 158, 11, 0.1)", borderRadius: "12px", color: "#f59e0b" }}>
            <ExternalLink size={24} />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>Resume Downloads</p>
            <h3 style={{ fontSize: "1.8rem", margin: "0.2rem 0 0 0" }}>{data.eventCounts['click_resume'] || 0}</h3>
          </div>
        </div>

        <div className="admin-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "12px", color: "#ef4444" }}>
            <MousePointerClick size={24} />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>Contact Submissions</p>
            <h3 style={{ fontSize: "1.8rem", margin: "0.2rem 0 0 0" }}>{data.eventCounts['form_submit'] || 0}</h3>
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="admin-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>Traffic Trends</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data.trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--admin-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--admin-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--admin-bg-primary)', border: '1px solid var(--admin-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--admin-text-main)' }}
              />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        {/* Section Engagement */}
        <div className="admin-card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={20} color="#8b5cf6" /> Average Time per Section (Seconds)
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data.sectionData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--admin-text-muted)" fontSize={12} />
                <YAxis dataKey="section" type="category" stroke="var(--admin-text-main)" fontSize={12} width={100} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--admin-bg-primary)', border: '1px solid var(--admin-border)' }} />
                <Bar dataKey="avgTimeSeconds" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="admin-card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>Device Breakdown</h2>
          <div style={{ width: "100%", height: 300, position: "relative" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.deviceData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--admin-bg-primary)', border: '1px solid var(--admin-border)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.overview.totalVisitors}</span><br />
              <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>Total</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        {/* Top Pages */}
        <div className="admin-card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Top Visited Pages</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)", textAlign: "left", color: "var(--admin-text-muted)" }}>
                <th style={{ padding: "0.8rem 0", fontWeight: 500 }}>Path</th>
                <th style={{ padding: "0.8rem 0", fontWeight: 500, textAlign: "right" }}>Views</th>
              </tr>
            </thead>
            <tbody>
              {data.topPages.map((page: any, i: number) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--admin-border-light)" }}>
                  <td style={{ padding: "1rem 0", fontSize: "0.95rem" }}>{page.path}</td>
                  <td style={{ padding: "1rem 0", textAlign: "right", fontWeight: 600 }}>{page.views}</td>
                </tr>
              ))}
              {data.topPages.length === 0 && (
                <tr><td colSpan={2} style={{ padding: "1rem 0", textAlign: "center", color: "var(--admin-text-muted)" }}>No page views yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Clicks & Events */}
        <div className="admin-card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Engagement Events</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)", textAlign: "left", color: "var(--admin-text-muted)" }}>
                <th style={{ padding: "0.8rem 0", fontWeight: 500 }}>Event Type</th>
                <th style={{ padding: "0.8rem 0", fontWeight: 500, textAlign: "right" }}>Occurrences</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.eventCounts).map(([event, count]: any, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--admin-border-light)" }}>
                  <td style={{ padding: "1rem 0", fontSize: "0.95rem", textTransform: "capitalize" }}>{event.replace('click_', '')}</td>
                  <td style={{ padding: "1rem 0", textAlign: "right", fontWeight: 600 }}>{count}</td>
                </tr>
              ))}
              {Object.keys(data.eventCounts).length === 0 && (
                <tr><td colSpan={2} style={{ padding: "1rem 0", textAlign: "center", color: "var(--admin-text-muted)" }}>No events tracked yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
