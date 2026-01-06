import { NextRequest, NextResponse } from 'next/server';
import { getFounderMetrics } from '@/lib/v17/founder/metrics';
import type { MetricsWindow } from '@/types/v17/founder';

export const dynamic = 'force-dynamic';

/**
 * V17 Founder Metrics API
 * GET /api/v17/founder/metrics?window=7d|30d
 * Output: FounderMetricsV17
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const windowParam = searchParams.get('window');
    
    const window: MetricsWindow = 
      windowParam === '30d' ? '30d' : '7d'; // Default to 7d

    const metrics = await getFounderMetrics(window);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[v17/founder/metrics] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}


