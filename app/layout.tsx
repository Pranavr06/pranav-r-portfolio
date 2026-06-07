import { Suspense } from "react";
import Script from "next/script";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRestoration from "@/components/ScrollRestoration";
import { ToastProvider } from "@/components/ToastProvider";
import ToastContainer from "@/components/Toast";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Pranav R Portfolio",
  description: "Explore Pranav R's portfolio: tech innovation projects, skills, and certifications from NMAMIT NITTE. Connect for collaboration!",
  keywords: "Pranav R, tech innovator, software engineer, portfolio, NMAMIT NITTE, full-stack development, Python, cybersecurity, UI/UX, HTML, CSS, JavaScript",
  authors: [{ name: "Pranav R" }],
  openGraph: {
    title: "Pranav R | Tech Innovator & Information Science Student Portfolio",
    description: "Explore Pranav R's portfolio - Projects, Experience, Certificates, and more.",
    url: "https://pranavr.netlify.app/",
    siteName: "Pranav R Portfolio",
    images: [
      {
        url: "https://pranavr.netlify.app/assets/pranavr-og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav R | Tech Innovator & Information Science Student Portfolio",
    description: "Explore Pranav R's portfolio - student, developer, and tech enthusiast.",
    images: ["https://pranavr.netlify.app/assets/pranavr-og-image.png"],
    site: "@PranavR2006",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head />
      <body className={poppins.className} suppressHydrationWarning>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            try {
              if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.body.classList.add('dark-theme');
              }
            } catch (e) {}
          `,
          }}
        />
        <Script
          id="microsoft-clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x3f2qdqm3r");
            `,
          }}
        />
        <ToastProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
          <ScrollRestoration />
          <Navbar />
          {children}
          <Footer />
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
