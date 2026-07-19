import type { Metadata } from "next";
import Script from "next/script";
import { getBaseUrl } from "@/lib/base-url";
import "./globals.css";

const GA_ID = "G-M7CPVPY9Y6";

// Async so metadataBase reflects the real request host (drives absolute OG image
// URLs), instead of a build-time-inlined NEXT_PUBLIC_APP_URL that can be stale.
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(await getBaseUrl()),
    title: {
      default: "Apna Dukaan — Discover Local Neighborhood Shops",
      template: "%s | Apna Dukaan",
    },
    description:
      "Find nearby neighborhood shops, view timings, contact details and today's updates.",
    verification: {
      google: "EDF6bQJubKeI3jJpaph6-Vh9J7Gdtkxl5Hwe0UCR4YE",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Google Analytics (gtag.js). afterInteractive = loads without blocking
            first paint on slow connections. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
