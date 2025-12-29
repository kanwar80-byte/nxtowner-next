import Footer from "@/components/layout/Footer";
import MainNav from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
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
        <NuqsAdapter>
          <MainNav />
          <main>{children}</main>
          <Footer />
        </NuqsAdapter>
      </body>
    </html>
  );
}
