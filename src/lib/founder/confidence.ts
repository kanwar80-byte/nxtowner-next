import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getFounderMetrics } from "./founderMetrics";
import { getFunnelData } from "./funnelRepo";

export type ConfidenceLevel = "high" | "medium" | "low";

export type ConfidenceSummary = {
  level: ConfidenceLevel;
  score: number; // 0–100
  coverageDays: number; // days with any events
  sessions30d: number; // distinct session_id in last 30d
  events30d: number; // total events in last 30d
  estimatedMetrics: number; // count of metrics that are null/estimated
  lowVolumeWarnings: number; // count of funnel steps flagged low volume
  notes: string[]; // 3–5 short bullet notes
};

// Column name mapping: try event_name first, fallback to name if schema differs
const EVENT_NAME_COL = "event_name"; // TODO: If queries fail, change to "name"

/**
 * Compute data confidence score from events coverage, volume, and metric quality.
 * Returns low confidence if events table is missing or has insufficient data.
 */
export async function computeConfidence(): Promise<ConfidenceSummary> {
  const supabase = await createClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let coverageDays = 0;
  let sessions30d = 0;
  let events30d = 0;
  let estimatedMetrics = 0;
  let lowVolumeWarnings = 0;
  const notes: string[] = [];

  try {
    // A) Coverage days: count distinct days with events
    try {
      const { data: dailyEvents, error: coverageError } = await supabase
        .from('events')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!coverageError && dailyEvents && dailyEvents.length > 0) {
        // Group by date (UTC date - for simplicity; can be enhanced with timezone later)
        const uniqueDays = new Set<string>();
        dailyEvents.forEach((event: any) => {
          if (event.created_at) {
            try {
              const date = new Date(event.created_at).toISOString().split('T')[0];
              uniqueDays.add(date);
            } catch {
              // Skip invalid dates
            }
          }
        });
        coverageDays = uniqueDays.size;
      }
    } catch {
      // events table may not exist - return safe defaults
    }

    // B) Sessions30d: count distinct session_id
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('events')
        .select('session_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!sessionsError && sessions && sessions.length > 0) {
        const uniqueSessions = new Set(sessions.map((s: any) => s.session_id).filter(Boolean));
        sessions30d = uniqueSessions.size;
      }
    } catch {
      // events table may not exist - return safe defaults
    }

    // C) Events30d: total count
    try {
      const { count, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!eventsError && count !== null) {
        events30d = count;
      }
    } catch {
      // events table may not exist - return safe defaults
    }

    // D) Estimated metrics: count null/estimated values from founder metrics
    try {
      const metrics = await getFounderMetrics('all');
      let nullCount = 0;
      
      // Check key metrics for null values
      if (metrics.visitors.value30d === null || metrics.visitors.isEstimated) nullCount++;
      if (metrics.registrations.value30d === null) nullCount++;
      if (metrics.paidUsers.value30d === null) nullCount++;
      if (metrics.mrr.value30d === null || metrics.mrr.isEstimated) nullCount++;
      if (metrics.ndaSigned.value30d === null) nullCount++;
      if (metrics.enquiries.value30d === null) nullCount++;
      if (metrics.dealRoomsActive.value30d === null) nullCount++;
      
      estimatedMetrics = nullCount;
    } catch {
      // Metrics may fail - that's okay
    }

    // E) Low volume warnings: count funnel steps with isLowVolume
    try {
      const funnel = await getFunnelData('30d', 'all');
      if (funnel.steps && funnel.steps.length > 0) {
        lowVolumeWarnings = funnel.steps.filter((step: any) => step.isLowVolume === true).length;
      }
    } catch {
      // Funnel may fail - that's okay
    }

    // If no events data at all, return low confidence
    if (events30d === 0 && coverageDays === 0 && sessions30d === 0) {
      return {
        level: "low",
        score: 0,
        coverageDays: 0,
        sessions30d: 0,
        events30d: 0,
        estimatedMetrics,
        lowVolumeWarnings,
        notes: ["Event tracking not configured yet"],
      };
    }

    // Compute score
    let score = 100;

    // Coverage days penalties
    if (coverageDays < 14) {
      score -= 20;
    }
    if (coverageDays < 7) {
      score -= 20; // Additional
    }

    // Sessions penalties
    if (sessions30d < 300) {
      score -= 20;
    }
    if (sessions30d < 100) {
      score -= 20; // Additional
    }

    // Estimated metrics penalties
    if (estimatedMetrics >= 3) {
      score -= 15;
    }
    if (estimatedMetrics >= 6) {
      score -= 15; // Additional
    }

    // Low volume warnings penalties
    if (lowVolumeWarnings >= 2) {
      score -= 10;
    }
    if (lowVolumeWarnings >= 4) {
      score -= 10; // Additional
    }

    // Clamp to 0–100
    score = Math.max(0, Math.min(100, score));

    // Determine level
    let level: ConfidenceLevel;
    if (score >= 75) {
      level = "high";
    } else if (score >= 45) {
      level = "medium";
    } else {
      level = "low";
    }

    // Build notes
    notes.push(`Coverage: ${coverageDays}/30 days`);
    notes.push(`Sessions (30d): ${sessions30d.toLocaleString()}`);
    if (estimatedMetrics > 0) {
      notes.push(`Estimated metrics: ${estimatedMetrics}`);
    }
    if (lowVolumeWarnings > 0) {
      notes.push(`Low-volume funnel warnings: ${lowVolumeWarnings}`);
    }
    if (events30d > 0) {
      notes.push(`Total events (30d): ${events30d.toLocaleString()}`);
    }

    return {
      level,
      score,
      coverageDays,
      sessions30d,
      events30d,
      estimatedMetrics,
      lowVolumeWarnings,
      notes: notes.slice(0, 5), // Max 5 notes
    };
  } catch (error) {
    // Failsafe: if anything fails, return low confidence
    if (process.env.NODE_ENV === "development") {
      console.warn("[computeConfidence] Error:", error);
    }

    return {
      level: "low",
      score: 0,
      coverageDays: 0,
      sessions30d: 0,
      events30d: 0,
      estimatedMetrics: 0,
      lowVolumeWarnings: 0,
      notes: ["Event tracking not available"],
    };
  }
}

