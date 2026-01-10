"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DealError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Deal workspace error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pt-24">
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8">
        <Card className="border-red-500/20 bg-[#0B1221] max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400">
              We encountered an error while loading the deal workspace. Please try again.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <summary className="text-sm text-slate-400 cursor-pointer mb-2">
                  Error details (dev only)
                </summary>
                <pre className="text-xs text-slate-500 mt-2 overflow-auto">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
            <div className="flex gap-3 pt-4">
              <Button onClick={reset} variant="default">
                Try again
              </Button>
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                variant="outline"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
