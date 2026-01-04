import { Suspense } from "react";
import StrategyClient from "./StrategyClient";

export default function FounderStrategyPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading strategy…</div>}>
      <StrategyClient />
    </Suspense>
  );
}
