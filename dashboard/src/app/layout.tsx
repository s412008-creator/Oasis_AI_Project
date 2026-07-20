import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oasis.ai — Dubai Relocation & Company Setup Concierge",
  description:
    "AI-powered relocation, legal, tax, and banking concierge for founders setting up a company and relocating to Dubai, UAE.",
  openGraph: {
    title: "Oasis.ai — Dubai Relocation & Company Setup Concierge",
    description:
      "AI-powered relocation, legal, tax, and banking concierge for founders setting up a company and relocating to Dubai, UAE.",
    siteName: "Oasis.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis.ai — Dubai Relocation & Company Setup Concierge",
    description:
      "AI-powered relocation, legal, tax, and banking concierge for founders setting up a company and relocating to Dubai, UAE.",
  },
};

import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
