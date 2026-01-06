import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ValuationRequestSchema } from '@/lib/validation/api.schemas';

// Initialize Gemini AI (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ValuationResponse {
  success: boolean;
  valuation_min?: number;
  valuation_max?: number;
  currency?: string;
  summary?: string;
  pricing_comment?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ValuationResponse>> {
  try {
    const rawBody = await request.json();

    // Validate request body with Zod
    const validationResult = ValuationRequestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const body = validationResult.data;

    // Build valuation prompt for Gemini
    const prompt = `You are an expert business valuation analyst specializing in Canadian small and medium-sized businesses.

Analyze the following business and provide a valuation range with reasoning.

BUSINESS DETAILS:
- Asset Type: ${body.asset_type}
- Location: ${body.location}
- Annual Revenue: $${body.annual_revenue.toLocaleString('en-CA')} CAD
- Annual Profit: $${body.annual_profit.toLocaleString('en-CA')} CAD
- Years in Operation: ${body.years_in_operation}
- Key Highlights: ${body.key_highlights}
${body.risk_flags ? `- Risk Flags: ${body.risk_flags}` : ''}
${body.asking_price ? `- Current Asking Price: $${body.asking_price.toLocaleString('en-CA')} CAD` : ''}

Based on typical Canadian business valuations using multiple methodologies:
1. Calculate an estimated valuation range (min and max in CAD).
2. Consider industry multiples, margins, growth trajectory, and risk profile.
3. If an asking price is provided, comment on whether it appears fair, aggressive, or discounted.

IMPORTANT: Return ONLY a valid JSON object with this exact structure and no other text:
{
  "valuation_min": <minimum estimated value in dollars as integer>,
  "valuation_max": <maximum estimated value in dollars as integer>,
  "currency": "CAD",
  "summary": "<2-4 sentences explaining the valuation: key drivers, multiples used, risk considerations>",
  "pricing_comment": "<1-2 sentences on the asking price (if provided): 'fair', 'slightly high', 'discounted', 'very high', or 'very low' with brief context>"
}

Example output:
{
  "valuation_min": 450000,
  "valuation_max": 650000,
  "currency": "CAD",
  "summary": "Based on a revenue multiple of 0.5-0.6x (typical for convenience stores) and a profit margin of 15-18%, this business is valued in the $450k-$650k range. The 5 years of operation and established location reduce acquisition risk.",
  "pricing_comment": "The asking price of $550k falls within the fair range, reflecting solid fundamentals and local market conditions."
}`;

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the Gemini response
    let valuation: {
      valuation_min: number;
      valuation_max: number;
      currency: string;
      summary: string;
      pricing_comment?: string;
    };

    try {
      // Extract JSON from response (Gemini might wrap it in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      valuation = JSON.parse(jsonMatch[0]);

      // Validate the response structure
      if (
        typeof valuation.valuation_min !== 'number' ||
        typeof valuation.valuation_max !== 'number' ||
        typeof valuation.summary !== 'string'
      ) {
        throw new Error('Invalid valuation response structure');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini valuation response:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate valuation. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      valuation_min: valuation.valuation_min,
      valuation_max: valuation.valuation_max,
      currency: valuation.currency || 'CAD',
      summary: valuation.summary,
      pricing_comment: valuation.pricing_comment,
    });
  } catch (error) {
    console.error('Valuation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process valuation request',
      },
      { status: 500 }
    );
  }
}
