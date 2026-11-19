import type { Metadata, Viewport } from "next";
// Fonts are self-hosted (see fonts.css): no external stylesheet to block the first paint.
import "./fonts.css";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f6fc" },
    { media: "(prefers-color-scheme: dark)", color: "#070b18" },
  ],
};

// Runs before first paint so the page never flashes the wrong theme.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior: Next.js switches smooth scrolling off during route changes so pages open at the top instantly.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
