import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SecurityWrapper } from "./components/security";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arya Raditia",
  description: "Arya Raditia | Personal Website",
  other: {
    "X-Content-Type-Options": "nosniff",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SecurityWrapper
          enableNoCopy={true}
          enableAntiAdInjection={true}
          enableAntiJudol={true}
          enableAntiDDoS={true}
          enableSafePaste={true}
          enableURLProtection={true}
          enableConsoleSecurity={true}
          enableDevToolsDetection={false}
        >
          {children}
        </SecurityWrapper>
      </body>
    </html>
  );
}
