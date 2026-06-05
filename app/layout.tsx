import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "guacamoleninja-bot",
  description: "A utility Discord bot — weather, polls, reminders, and more.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "guacamoleninja-bot",
    description: "A utility Discord bot — weather, polls, reminders, and more.",
    url: "https://app.guacamoleninja.com",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
