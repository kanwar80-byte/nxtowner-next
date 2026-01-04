import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NxtOwner.ca — Buy & Sell Businesses",
  description: "A trusted marketplace for physical and digital businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-brand-bg`}
      >
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <NuqsAdapter>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </NuqsAdapter>
      </body>
    </html>
  );
}
