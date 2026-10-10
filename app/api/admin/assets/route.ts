import { NextResponse } from "next/server";
import assetsManifest from "@/lib/assetsManifest.json";

export interface AssetInfo {
  name: string;
  path: string;
  ext: string;
  type: "image" | "pdf" | "video" | "other";
  isLogo: boolean;
  isCertificate: boolean;
}

export async function GET() {
  return NextResponse.json(assetsManifest, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
