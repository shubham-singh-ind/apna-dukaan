import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
