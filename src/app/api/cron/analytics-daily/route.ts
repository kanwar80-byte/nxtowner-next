import { NextRequest, NextResponse } from "next/server";
import { computeAllDailyAggregates } from "@/lib/analytics/aggregates";

/**
 * Cron endpoint to compute daily analytics aggregates.
 * 
 * Requires x-cron-secret header matching CRON_SECRET env var.
 * 
 * Usage:
 *   curl -X POST http://localhost:3000/api/cron/analytics-daily \
 *     -H "x-cron-secret: YOUR_SECRET"
 * 
 * On Vercel, configure cron to call this endpoint daily at ~03:15 America/Toronto.
 */
export async function POST(request: NextRequest) {
  try {
    // Check cron secret
    const cronSecret = request.headers.get("x-cron-secret");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      console.error("[analytics-daily] CRON_SECRET not configured");
      return NextResponse.json(
        { error: "Cron secret not configured" },
        { status: 500 }
      );
    }

    if (cronSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Compute aggregates for yesterday (Toronto time)
    const result = await computeAllDailyAggregates();

    return NextResponse.json({
      success: true,
      day: result.day,
      message: `Computed daily aggregates for ${result.day}`,
      counts: {
        analytics: result.analytics,
        funnel_steps: result.funnel.length,
        features: result.features.length,
        revenue: result.revenue ? "computed" : "skipped",
      },
    });
  } catch (error) {
    console.error("[analytics-daily] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to compute aggregates",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}




