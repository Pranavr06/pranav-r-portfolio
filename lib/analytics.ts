import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

// Helper to get or create a session ID
export const getSessionId = () => {
  if (typeof window === "undefined") return "server-session";
  
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

// Very basic User-Agent parser for analytics
const parseUserAgent = (ua: string) => {
  let browser = "Unknown";
  let os = "Unknown";
  let device_type = "Desktop";

  // Browser
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("SamsungBrowser")) browser = "Samsung Internet";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
  else if (ua.includes("Trident")) browser = "Internet Explorer";
  else if (ua.includes("Edge") || ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  // OS
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "MacOS";
  else if (ua.includes("X11")) os = "UNIX";
  else if (ua.includes("Linux")) os = "Linux";
  if (ua.includes("Android")) os = "Android";
  if (ua.includes("like Mac")) os = "iOS";

  // Device Type
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device_type = "Tablet";
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    device_type = "Mobile";
  }

  return { browser, os, device_type };
};

export const trackPageView = async (path: string, title?: string) => {
  if (typeof window === "undefined") return;

  // Don't track admin pages to avoid polluting public metrics
  if (path.startsWith("/admin")) return;

  const sessionId = getSessionId();
  const { browser, os, device_type } = parseUserAgent(navigator.userAgent);
  
  // Best effort to get country via Intl API timezone
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let country = tz.split('/')[0] || "Unknown";
  
  try {
    await supabase.from("page_views").insert([
      {
        session_id: sessionId,
        path,
        title: title || document.title,
        referrer: document.referrer || "Direct",
        browser,
        os,
        device_type,
        country
      }
    ]);
  } catch (err) {
    console.error("Failed to log page view", err);
  }
};

export const trackEvent = async (event_type: string, target_id?: string, metadata?: any) => {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  const sessionId = getSessionId();

  try {
    await supabase.from("analytics_events").insert([
      {
        session_id: sessionId,
        event_type,
        target_id,
        metadata
      }
    ]);
  } catch (err) {
    console.error("Failed to log event", err);
  }
};

export const trackSectionView = async (section_id: string, time_spent_ms: number, max_scroll_depth_percent: number) => {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  if (time_spent_ms < 1000) return; // Ignore accidental very fast scrolls

  const sessionId = getSessionId();

  try {
    await supabase.from("section_views").insert([
      {
        session_id: sessionId,
        section_id,
        time_spent_ms,
        max_scroll_depth_percent
      }
    ]);
  } catch (err) {
    console.error("Failed to log section view", err);
  }
};
