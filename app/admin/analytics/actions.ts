"use server";

import { createClient } from "@supabase/supabase-js";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getAnalyticsData(days: number = 7) {
  const startDate = startOfDay(subDays(new Date(), days - 1)).toISOString();
  
  // Fetch raw data
  const [{ data: pageViews }, { data: events }, { data: sectionViews }] = await Promise.all([
    supabase.from("page_views").select("*").gte("created_at", startDate),
    supabase.from("analytics_events").select("*").gte("created_at", startDate),
    supabase.from("section_views").select("*").gte("created_at", startDate)
  ]);

  if (!pageViews || !events || !sectionViews) {
    return null;
  }

  // Aggregate Visitors
  const totalViews = pageViews.length;
  const uniqueSessions = new Set(pageViews.map(v => v.session_id));
  const totalVisitors = uniqueSessions.size;

  // Aggregate Daily Traffic
  const trafficByDay: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    trafficByDay[format(subDays(new Date(), i), "MMM dd")] = 0;
  }
  
  pageViews.forEach(v => {
    const day = format(new Date(v.created_at), "MMM dd");
    if (trafficByDay[day] !== undefined) {
      trafficByDay[day]++;
    }
  });

  const trafficData = Object.entries(trafficByDay).map(([date, views]) => ({ date, views }));

  // Aggregate Top Pages
  const pageCounts: Record<string, number> = {};
  pageViews.forEach(v => {
    pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, views]) => ({ path, views }));

  // Aggregate Device Breakdown
  const deviceCounts: Record<string, number> = {};
  pageViews.forEach(v => {
    const dev = v.device_type || "Unknown";
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
  });
  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

  // Aggregate Section Views
  const sectionCounts: Record<string, { totalTime: number, count: number }> = {};
  sectionViews.forEach(v => {
    if (!sectionCounts[v.section_id]) {
      sectionCounts[v.section_id] = { totalTime: 0, count: 0 };
    }
    sectionCounts[v.section_id].totalTime += v.time_spent_ms;
    sectionCounts[v.section_id].count += 1;
  });
  
  const sectionData = Object.entries(sectionCounts)
    .map(([section, data]) => ({
      section,
      avgTimeSeconds: Math.round(data.totalTime / data.count / 1000)
    }))
    .sort((a, b) => b.avgTimeSeconds - a.avgTimeSeconds);

  // Aggregate Events (External Clicks, etc.)
  const eventCounts: Record<string, number> = {};
  events.forEach(e => {
    eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
  });

  return {
    overview: {
      totalViews,
      totalVisitors,
      bounceRate: "N/A", // Hard to calculate accurately without complex session tracking
    },
    trafficData,
    topPages,
    deviceData,
    sectionData,
    eventCounts
  };
}
