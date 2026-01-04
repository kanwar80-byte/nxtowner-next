'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isFounderRoute = pathname?.startsWith('/founder');
  const hideNavAndFooter = isAdminRoute || isFounderRoute;

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <main>{children}</main>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

