import { slugify } from "@/lib/slug";

export interface CertificateImage {
  url: string;
  caption?: string;
  alt?: string;
}

// Fallback or default gallery images for certificates if not yet configured in DB
export const STATIC_CERTIFICATE_GALLERIES: Record<string, CertificateImage[]> = {
  "smart-india-hackathon-2026-internal-ideathon": [
    {
      url: "/assets/night-group-selfie.webp",
      caption: "Team at Smart India Hackathon 2026 Internal Ideathon",
    },
    {
      url: "/assets/night-group-seated.webp",
      caption: "Ideathon participants and team collaboration",
    },
    {
      url: "/assets/night-portrait-wide.webp",
      caption: "Internal Ideathon presentation and event session",
    },
  ],
};

export function getCertificateGallery(cert: any): CertificateImage[] {
  let dbImages: CertificateImage[] = [];

  // 1. If certificate has gallery_images in DB
  if (cert?.gallery_images) {
    if (Array.isArray(cert.gallery_images)) {
      dbImages = cert.gallery_images
        .map((item: any) => {
          if (typeof item === "string") return { url: item };
          return {
            url: item?.url || "",
            caption: item?.caption || "",
            alt: item?.alt || item?.caption || "",
          };
        })
        .filter((item: CertificateImage) => Boolean(item.url));
    } else if (typeof cert.gallery_images === "string") {
      try {
        const parsed = JSON.parse(cert.gallery_images);
        if (Array.isArray(parsed)) {
          dbImages = parsed
            .map((item: any) => {
              if (typeof item === "string") return { url: item };
              return {
                url: item?.url || "",
                caption: item?.caption || "",
                alt: item?.alt || item?.caption || "",
              };
            })
            .filter((item: CertificateImage) => Boolean(item.url));
        }
      } catch {
        // Fallback
      }
    }
  }

  // If DB has actual images, return them
  if (dbImages.length > 0) {
    return dbImages;
  }

  // 2. Static mapping fallback by canonical slug or slugified title
  const candidates = [
    cert?.slug,
    cert?.title ? slugify(cert.title) : null,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (STATIC_CERTIFICATE_GALLERIES[candidate]) {
      return STATIC_CERTIFICATE_GALLERIES[candidate];
    }
  }

  return [];
}
