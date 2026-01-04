import { Suspense } from 'react';
import { checkFounder } from '@/lib/auth/requireFounder';
import FounderShell from '@/components/founder/FounderShell';
import AccessDenied from '@/components/founder/AccessDenied';

export const dynamic = "force-dynamic";

export default async function FounderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isFounder } = await checkFounder();

  if (!isFounder) {
    return <AccessDenied />;
  }

  return (
    <FounderShell>
      <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading…</div>}>
        {children}
      </Suspense>
    </FounderShell>
  );
}

