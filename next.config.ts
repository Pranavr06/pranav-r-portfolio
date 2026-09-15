import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/experiences/my-bharat-budget',
        destination: '/experiences/professional-journey/my-bharat-budget-quest-2026',
        permanent: true,
      },
      {
        source: '/college-projects/marketing-prediction-project',
        destination: '/projects/college-projects/marketing-response-prediction',
        permanent: true,
      },
      {
        source: '/projects/college-projects/marketing-prediction-project',
        destination: '/projects/college-projects/marketing-response-prediction',
        permanent: true,
      },
      {
        source: '/experiences/professional-journey/iict-summer-internship-in-ai-ml',
        destination: '/experiences/professional-journey/IICT-Summer-Internship-in-AI-&-ML',
        permanent: true,
      },
      {
        source: '/experiences/professional-journey/iict-summer-internship',
        destination: '/experiences/professional-journey/IICT-Summer-Internship-in-AI-&-ML',
        permanent: true,
      },
      {
        source: '/college-projects',
        destination: '/projects/college-projects',
        permanent: true,
      },
      {
        source: '/college-projects/:slug*',
        destination: '/projects/college-projects/:slug*',
        permanent: true,
      },
      {
        source: '/projects/assets/:path*',
        destination: '/assets/:path*',
        permanent: false,
      },
      {
        source: '/projects/college-projects/assets/:path*',
        destination: '/assets/:path*',
        permanent: false,
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' blob: data: https:; font-src 'self' data: https:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
          }
        ],
      },
    ];
  },
};

export default nextConfig;
