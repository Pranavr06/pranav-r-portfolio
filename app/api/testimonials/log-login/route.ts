import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/rateLimiter";
import { logActivity } from "@/lib/activityLogger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, email, name, avatar_url, provider } = body;

    if (!user_id && !email) {
      return NextResponse.json({ error: "Missing required identification fields." }, { status: 400 });
    }

    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || null;
    const cleanEmail = email ? String(email).trim() : null;
    const cleanName = name ? String(name).trim() : null;
    const authProvider = provider ? String(provider).toUpperCase() : "GOOGLE";

    const displayTitle = cleanName
      ? `Testimonial Sign-In: ${cleanName} (${authProvider})`
      : cleanEmail
      ? `Testimonial Sign-In: ${cleanEmail} (${authProvider})`
      : `Testimonial Sign-In (${authProvider})`;

    await logActivity({
      type: "testimonial_login",
      action: "login_success",
      title: displayTitle,
      email: cleanEmail,
      ip_address: clientIp,
      user_agent: userAgent,
      status: "success",
      details: {
        user_id,
        name: cleanName,
        email: cleanEmail,
        provider: authProvider,
        avatar_url: avatar_url || null,
        source: "testimonials_auth"
      }
    });

    return NextResponse.json({ success: true, message: "Testimonial login activity recorded." });
  } catch (err: any) {
    console.error("Error logging testimonial login:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
