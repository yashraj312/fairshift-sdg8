import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "FairShift | UN SDG 8 Decent Work & Overtime Platform",
  description:
    "FairShift empowers construction workers and campus support staff across India with transparent 1.5x overtime wage verification in Indian Rupees (₹), confidential whistleblower grievance filing, and portable skill passports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full flex flex-col bg-slate-100 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 antialiased selection:bg-amber-400 selection:text-slate-900 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
