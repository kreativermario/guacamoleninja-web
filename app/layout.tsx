import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { APP_URL } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: "Guacamole Ninja Bot", template: "%s | Guacamole Ninja Bot" },
  description: "Manage your Discord server effortlessly — weather, polls, reminders, and more.",
  openGraph: {
    title: "Guacamole Ninja Bot",
    description: "Manage your Discord server effortlessly — weather, polls, reminders, and more.",
    url: APP_URL,
    siteName: "Guacamole Ninja Bot",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${openSans.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
