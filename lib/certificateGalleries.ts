import { slugify } from "@/lib/slug";

export interface CertificateImage {
  url: string;
  caption?: string;
  alt?: string;
}

// Fallback or default gallery images for certificates if not yet configured in DB
export const STATIC_CERTIFICATE_GALLERIES: Record<string, CertificateImage[]> = {
  "nexathon-2026-national-hackathon": [
    {
      url: "/assets/nexathon-pic-with-leader-and-teammate.webp",
      caption: "Midnight Refreshment Break with Preethika & Prajwala",
    },
    {
      url: "/assets/nexathon-team.webp",
      caption: "Team Neural Forge Squad at Nexathon 2026",
    },
  ],
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
  "the-startup-chase-2-0-winners": [
    {
      url: "/assets/the-startup-chase-2026-award-distribution.webp",
      caption: "Team Civic Sentinal at The Startup Chase 2.0 Award Distribution Ceremony – 1st Place Winners",
    },
    {
      url: "/assets/posing-for-selfie-at-the-startup-chase-2026.webp",
      caption: "Team Civic Sentinal Celebration Selfie – Winning Our Very First Event at The Startup Chase 2.0",
    },
  ],
  "the-startup-chase-2-0": [
    {
      url: "/assets/the-startup-chase-2026-award-distribution.webp",
      caption: "Team Civic Sentinal at The Startup Chase 2.0 Award Distribution Ceremony – 1st Place Winners",
    },
    {
      url: "/assets/posing-for-selfie-at-the-startup-chase-2026.webp",
      caption: "Team Civic Sentinal Celebration Selfie – Winning Our Very First Event at The Startup Chase 2.0",
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
