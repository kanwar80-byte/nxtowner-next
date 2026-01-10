import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DealLoading() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pt-24">
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Main content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="animate-pulse space-y-6">
              {/* Header skeleton */}
              <div className="h-24 bg-slate-800/50 rounded-xl border border-slate-800" />
              
              {/* Status tracker skeleton */}
              <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-800" />
              
              {/* Tabs skeleton */}
              <div className="h-12 bg-slate-800/50 rounded-lg border border-slate-800" />
              
              {/* Content skeleton */}
              <Card className="border-slate-800 bg-[#0B1221]">
                <CardHeader>
                  <div className="h-6 w-48 bg-slate-700/50 rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-20 bg-slate-700/50 rounded-lg" />
                    <div className="h-20 bg-slate-700/50 rounded-lg" />
                    <div className="h-20 bg-slate-700/50 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right rail skeleton */}
          <aside className="w-80 shrink-0 sticky top-28 h-fit hidden lg:block">
            <Card className="border-slate-800 bg-[#0B1221] animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-slate-700/50 rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-24 bg-slate-700/50 rounded-lg" />
                  <div className="h-24 bg-slate-700/50 rounded-lg" />
                  <div className="h-16 bg-slate-700/50 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
