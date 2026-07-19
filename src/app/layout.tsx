import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
