/**
 * Device & Geolocation parser utility for Wall notes and admin telemetry.
 */

export interface ParsedDeviceInfo {
  deviceType: "Mobile" | "Tablet" | "Desktop" | "Bot" | "Unknown";
  deviceModel: string;
  os: string;
  browser: string;
  fullString: string;
}

export function parseDevice(userAgent: string | null | undefined): ParsedDeviceInfo {
  const ua = userAgent || "";
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let deviceType: ParsedDeviceInfo["deviceType"] = "Desktop";
  let deviceModel = "";

  // 1. Detect OS & Model
  if (/iPad/i.test(ua)) {
    os = "iPadOS";
    deviceType = "Tablet";
    deviceModel = "Apple iPad";
  } else if (/iPhone/i.test(ua)) {
    os = "iOS";
    deviceType = "Mobile";
    deviceModel = "Apple iPhone";
  } else if (/Android/i.test(ua)) {
    os = "Android";
    deviceType = /Mobile/i.test(ua) ? "Mobile" : "Tablet";
    
    // Extract Android phone model if present e.g. "SM-G998B", "Pixel 7"
    const modelMatch = ua.match(/Android[^;]+;\s*([^;)]+)\)/);
    if (modelMatch && modelMatch[1]) {
      const rawModel = modelMatch[1].trim();
      if (!rawModel.includes("Build") && !rawModel.includes("Linux")) {
        deviceModel = rawModel;
      }
    }
    if (!deviceModel) {
      if (/Samsung/i.test(ua)) deviceModel = "Samsung Galaxy";
      else if (/Pixel/i.test(ua)) deviceModel = "Google Pixel";
      else if (/Redmi|Xiaomi/i.test(ua)) deviceModel = "Xiaomi / Redmi";
      else if (/OnePlus/i.test(ua)) deviceModel = "OnePlus";
      else deviceModel = "Android Device";
    }
  } else if (/Windows NT 10.0/i.test(ua)) {
    os = "Windows 10/11";
    deviceModel = "Windows PC";
  } else if (/Windows NT/i.test(ua)) {
    os = "Windows";
    deviceModel = "Windows PC";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "macOS";
    deviceModel = "Apple Mac";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
    deviceModel = "Linux PC";
  }

  // 2. Detect Browser
  if (/Edg\//i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/Chrome\//i.test(ua) && !/Chromium|Edg|OPR/i.test(ua)) {
    browser = "Chrome";
  } else if (/Safari/i.test(ua) && !/Chrome|Chromium/i.test(ua)) {
    browser = "Safari";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Firefox";
  } else if (/OPR|Opera/i.test(ua)) {
    browser = "Opera";
  } else if (/SamsungBrowser/i.test(ua)) {
    browser = "Samsung Browser";
  }

  const modelSummary = deviceModel ? `${deviceModel} (${os} • ${browser})` : `${os} (${browser})`;

  return {
    deviceType,
    deviceModel: deviceModel || os,
    os,
    browser,
    fullString: modelSummary
  };
}

export function parseLocation(req: Request): string {
  // 1. Cloudflare headers
  const cfCity = req.headers.get("cf-ipcity");
  const cfRegion = req.headers.get("cf-region");
  const cfCountry = req.headers.get("cf-ipcountry");

  if (cfCity || cfCountry) {
    const parts = [cfCity, cfRegion, cfCountry].filter(Boolean);
    return parts.join(", ");
  }

  // 2. Netlify Geo headers
  const nfGeoRaw = req.headers.get("x-nf-geo");
  if (nfGeoRaw) {
    try {
      let geoObj: any = null;
      if (nfGeoRaw.startsWith("{")) {
        geoObj = JSON.parse(nfGeoRaw);
      } else {
        // Netlify sometimes base64-encodes geo JSON
        const decoded = Buffer.from(nfGeoRaw, "base64").toString("utf-8");
        geoObj = JSON.parse(decoded);
      }

      const city = geoObj.city;
      const region = geoObj.subdivision?.name || geoObj.subdivision?.code;
      const country = geoObj.country?.name || geoObj.country?.code;

      const parts = [city, region, country].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    } catch (e) {
      // Ignore parse failure
    }
  }

  const nfCountry = req.headers.get("x-nf-country-code");
  if (nfCountry) return `Country: ${nfCountry}`;

  // 3. Client hints in custom header (if passed from client browser)
  const clientTz = req.headers.get("x-client-timezone");
  if (clientTz) {
    return clientTz.replace(/_/g, " ");
  }

  // Fallback for localhost
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  if (!ip || ip.includes("127.0.0.1") || ip.includes("::1")) {
    return "Local / Dev";
  }

  return "Unknown Location";
}
