import { Suspense } from "react";
import ValuationClient from "./ValuationClient";

export default function ValuationPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading valuation…</div>}>
      <ValuationClient />
    </Suspense>
  );
}
