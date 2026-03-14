import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";

import { Toaster } from "@/components/ui/sonner";
import Topbar from "@/components/layout/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HeavyIn",
  description: "Connect through sweat. Share the grind.",
  openGraph: {
    title: "HeavyIn",
    description: "Connect through sweat. Share the grind.",
    images: [
      {
        url: "https://heavy-in.vercel.app/cbum.avif",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <AuthProvider>
          <Topbar />
          {children}
          <Toaster />
          <Navbar />
        </AuthProvider>
      </body>
    </html>
  );
}
