import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export interface AssetInfo {
  name: string;
  path: string;
  ext: string;
  type: "image" | "pdf" | "video" | "other";
  isLogo: boolean;
  isCertificate: boolean;
  size?: number;
}

export async function GET() {
  try {
    const assetsDir = path.join(process.cwd(), "public", "assets");
    
    let entries: string[] = [];
    try {
      entries = await fs.readdir(assetsDir);
    } catch {
      return NextResponse.json({ assets: [], logos: [], documents: [], images: [] });
    }

    const imageExts = new Set([".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".avif"]);
    const videoExts = new Set([".mp4", ".webm"]);

    const assets: AssetInfo[] = entries
      .filter((file) => !file.startsWith("."))
      .map((name) => {
        const ext = path.extname(name).toLowerCase();
        const lower = name.toLowerCase();

        let type: AssetInfo["type"] = "other";
        if (imageExts.has(ext)) type = "image";
        else if (ext === ".pdf") type = "pdf";
        else if (videoExts.has(ext)) type = "video";

        const isLogo = lower.includes("logo") || lower.includes("icon") || lower.startsWith("client-");
        const isCertificate = lower.includes("certificate") || lower.includes("cert") || ext === ".pdf";

        return {
          name,
          path: `/assets/${name}`,
          ext,
          type,
          isLogo,
          isCertificate,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    const logos = assets.filter((a) => a.isLogo || (a.type === "image" && a.name.toLowerCase().includes("logo")));
    const documents = assets.filter((a) => a.type === "pdf" || a.isCertificate);
    const images = assets.filter((a) => a.type === "image");

    return NextResponse.json(
      {
        assets,
        logos,
        documents,
        images,
        total: assets.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Error reading public assets:", err);
    return NextResponse.json({ error: "Failed to list assets" }, { status: 500 });
  }
}
