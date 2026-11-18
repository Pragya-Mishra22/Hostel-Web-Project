import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "YMCA Hostels | J C Bose University of Science & Technology",
    template: "%s | YMCA Hostels",
  },
  description:
    "The resident portal for the Kasturba, Mother Teresa, Kalpana Chawla and A. Lalita hostels at J C Bose University of Science & Technology, YMCA, Faridabad.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1D33A0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-dvh">{children}</body>
    </html>
  );
}
