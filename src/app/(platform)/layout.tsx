import { Suspense } from 'react';

export const dynamic = "force-dynamic";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading…</div>}>
      {children}
    </Suspense>
  );
}




