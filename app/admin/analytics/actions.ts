"use server";

import { createClient } from "@supabase/supabase-js";
import { format, subDays, startOfDay, differenceInDays } from "date-fns";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Helper to fetch all rows beyond Supabase PostgREST's default 1,000 row ceiling
 * using sequential range pagination.
 */
async function fetchAllRows(tableName: string, startDate?: string, selectFields: string = "*") {
  const pageSize = 1000;
  let allRows: any[] = [];
  let page = 0;

  while (true) {
    let query = supabase
      .from(tableName)
      .select(selectFields)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) break;

    allRows = allRows.concat(data);
    if (data.length < pageSize) break;
    page++;

    // Safety guard to prevent runaway memory if table grows to >100k rows
    if (page >= 100) break;
  }

  return allRows;
}

export async function getAnalyticsData(days: number = 7) {
  const isAllTime = !days || days <= 0;
  const startDate = !isAllTime ? startOfDay(subDays(new Date(), days - 1)).toISOString() : undefined;

  // Fetch all rows without PostgREST 1,000 row truncation
  const [pageViews, events, sectionViews] = await Promise.all([
    fetchAllRows("page_views", startDate, "session_id, path, device_type, created_at"),
    fetchAllRows("analytics_events", startDate, "event_type, created_at"),
    fetchAllRows("section_views", startDate, "section_id, time_spent_ms, created_at")
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

  if (isAllTime) {
    if (pageViews.length > 0) {
      // Sort to find the earliest view date
      const sorted = [...pageViews].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const earliest = startOfDay(new Date(sorted[0].created_at));
      const today = startOfDay(new Date());
      const spanDays = Math.max(differenceInDays(today, earliest) + 1, 1);

      // Pre-fill daily slots from earliest recorded view to today
      for (let i = spanDays - 1; i >= 0; i--) {
        trafficByDay[format(subDays(today, i), "MMM dd")] = 0;
      }

      pageViews.forEach(v => {
        const day = format(new Date(v.created_at), "MMM dd");
        if (trafficByDay[day] !== undefined) {
          trafficByDay[day]++;
        } else {
          trafficByDay[day] = 1;
        }
      });
    }
  } else {
    for (let i = days - 1; i >= 0; i--) {
      trafficByDay[format(subDays(new Date(), i), "MMM dd")] = 0;
    }

    pageViews.forEach(v => {
      const day = format(new Date(v.created_at), "MMM dd");
      if (trafficByDay[day] !== undefined) {
        trafficByDay[day]++;
      }
    });
  }

  const trafficData = Object.entries(trafficByDay).map(([date, views]) => ({ date, views }));

  // Aggregate Top Pages
  const pageCounts: Record<string, number> = {};
  pageViews.forEach(v => {
    pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }));

  // Aggregate Device Breakdown
  const deviceCounts: Record<string, number> = {};
  pageViews.forEach(v => {
    const dev = v.device_type || "Unknown";
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
  });
  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

  // Aggregate Section Views
  const sectionCounts: Record<string, { totalTime: number; count: number }> = {};
  sectionViews.forEach(v => {
    if (!sectionCounts[v.section_id]) {
      sectionCounts[v.section_id] = { totalTime: 0, count: 0 };
    }
    sectionCounts[v.section_id].totalTime += (v.time_spent_ms || 0);
    sectionCounts[v.section_id].count += 1;
  });

  const sectionData = Object.entries(sectionCounts)
    .map(([section, data]) => ({
      section,
      avgTimeSeconds: Math.round(data.totalTime / data.count / 1000)
    }))
    .sort((a, b) => b.avgTimeSeconds - a.avgTimeSeconds);

  // Aggregate Events (External Clicks, resume downloads, form submissions, etc.)
  const eventCounts: Record<string, number> = {};
  events.forEach(e => {
    eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
  });

  return {
    overview: {
      totalViews,
      totalVisitors,
      bounceRate: "N/A"
    },
    trafficData,
    topPages,
    deviceData,
    sectionData,
    eventCounts,
    isAllTime
  };
}
