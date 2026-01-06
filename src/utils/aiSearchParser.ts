/**
 * AI Intent Recognition Parser
 * Parses natural language search queries into structured filters
 */

export interface ParsedSearchFilters {
  query?: string;
  categoryCode?: string; // Category code (e.g., "fuel_auto", "saas_software")
  subcategoryCode?: string; // Subcategory code (e.g., "gas_stations", "b2b_saas")
  location?: string;
  minEbitda?: number;
  minMrr?: number;
  minRevenue?: number;
  maxPrice?: number;
  minPrice?: number;
  churnRate?: number;
  suggestedMode?: 'operational' | 'digital'; // Detected mode mismatch
}

/**
 * Parse natural language query into structured filters
 */
export function parseAISearchQuery(
  query: string,
  mode: 'operational' | 'digital'
): ParsedSearchFilters {
  const filters: ParsedSearchFilters = {};
  const lowerQuery = query.toLowerCase();

  // Extract category keywords
  const operationalCategories = [
    'gas station', 'gas stations', 'fuel station',
    'car wash', 'car washes',
    'franchise', 'franchises',
    'convenience store', 'convenience stores',
    'retail', 'restaurant', 'logistics', 'industrial'
  ];

  const digitalCategories = [
    'saas', 'software', 'app', 'application',
    'e-commerce', 'ecommerce', 'online store',
    'ai tool', 'ai tools', 'artificial intelligence',
    'content site', 'content sites', 'blog', 'website'
  ];

  // Category name to code mapping
  const categoryCodeMap: Record<string, string> = {
    // Operational
    'gas station': 'fuel_auto',
    'gas stations': 'fuel_auto',
    'fuel station': 'fuel_auto',
    'car wash': 'fuel_auto',
    'car washes': 'fuel_auto',
    'franchise': 'retail_franchise',
    'franchises': 'retail_franchise',
    'convenience store': 'retail_franchise',
    'convenience stores': 'retail_franchise',
    'retail': 'retail',
    'restaurant': 'food_beverage',
    'logistics': 'transport_logistics',
    'industrial': 'industrial',
    // Digital
    'saas': 'saas_software',
    'software': 'saas_software',
    'app': 'saas_software',
    'application': 'saas_software',
    'e-commerce': 'ecommerce',
    'ecommerce': 'ecommerce',
    'online store': 'ecommerce',
    'ai tool': 'saas_software',
    'ai tools': 'saas_software',
    'artificial intelligence': 'saas_software',
    'content site': 'content_media',
    'content sites': 'content_media',
    'blog': 'content_media',
    'website': 'content_media',
  };

  if (mode === 'operational') {
    for (const cat of operationalCategories) {
      if (lowerQuery.includes(cat)) {
        // Map to category codes
        const code = categoryCodeMap[cat.toLowerCase()];
        if (code) {
          filters.categoryCode = code;
          // For gas stations, also set subcategory code
          if (cat.includes('gas')) {
            filters.subcategoryCode = 'gas_stations';
          } else if (cat.includes('car wash')) {
            filters.subcategoryCode = 'car_washes';
          }
        }
        break;
      }
    }
  } else {
    for (const cat of digitalCategories) {
      if (lowerQuery.includes(cat)) {
        // Map to category codes
        const code = categoryCodeMap[cat.toLowerCase()];
        if (code) {
          filters.categoryCode = code;
          // For SaaS, set subcategory code
          if (cat.includes('saas') || cat.includes('software')) {
            filters.subcategoryCode = 'b2b_saas';
          }
        }
        break;
      }
    }
  }

  // Extract location (Canadian provinces and major cities)
  const locations = [
    'ontario', 'toronto', 'gta', 'greater toronto',
    'quebec', 'montreal',
    'british columbia', 'bc', 'vancouver',
    'alberta', 'calgary', 'edmonton',
    'manitoba', 'winnipeg',
    'saskatchewan', 'regina',
    'nova scotia', 'halifax',
    'new brunswick', 'newfoundland'
  ];

  for (const loc of locations) {
    if (lowerQuery.includes(loc)) {
      filters.location = loc.charAt(0).toUpperCase() + loc.slice(1);
      // Normalize common abbreviations
      if (loc === 'gta' || loc === 'greater toronto') filters.location = 'Ontario';
      if (loc === 'bc') filters.location = 'British Columbia';
      break;
    }
  }

  // Extract financial metrics
  // EBITDA patterns: "over $500k EBITDA", "$500k+ ebitda", "ebitda > 500000"
  const ebitdaMatch = lowerQuery.match(/(?:over|above|more than|>|greater than)\s*\$?(\d+(?:\.\d+)?)\s*(k|thousand|m|million)?\s*(?:ebitda|cash flow|profit)/i);
  if (ebitdaMatch) {
    let value = parseFloat(ebitdaMatch[1]);
    const unit = ebitdaMatch[3]?.toLowerCase();
    if (unit === 'k' || unit === 'thousand') value *= 1000;
    if (unit === 'm' || unit === 'million') value *= 1000000;
    filters.minEbitda = value;
  }

  // MRR patterns: "$20k MRR", "mrr > 20000", "minimum $20k monthly"
  const mrrMatch = lowerQuery.match(/(?:mrr|monthly recurring revenue|monthly revenue).*?(?:over|above|>|minimum|min|at least)\s*\$?(\d+(?:\.\d+)?)\s*(k|thousand)?/i) ||
                   lowerQuery.match(/\$?(\d+(?:\.\d+)?)\s*(k|thousand)?\s*(?:mrr|monthly recurring)/i);
  if (mrrMatch) {
    let value = parseFloat(mrrMatch[1] || mrrMatch[2]);
    const unit = (mrrMatch[2] || mrrMatch[3])?.toLowerCase();
    if (unit === 'k' || unit === 'thousand') value *= 1000;
    filters.minMrr = value;
  }

  // Revenue patterns: "$1M revenue", "revenue > 1000000"
  const revenueMatch = lowerQuery.match(/(?:revenue|annual revenue).*?(?:over|above|>|minimum|min|at least)\s*\$?(\d+(?:\.\d+)?)\s*(k|thousand|m|million)?/i) ||
                       lowerQuery.match(/\$?(\d+(?:\.\d+)?)\s*(k|thousand|m|million)?\s*(?:revenue|annual)/i);
  if (revenueMatch) {
    let value = parseFloat(revenueMatch[1] || revenueMatch[2]);
    const unit = (revenueMatch[2] || revenueMatch[3])?.toLowerCase();
    if (unit === 'k' || unit === 'thousand') value *= 1000;
    if (unit === 'm' || unit === 'million') value *= 1000000;
    filters.minRevenue = value;
  }

  // Churn rate patterns: "<10% churn", "churn rate under 10%", "low churn"
  const churnMatch = lowerQuery.match(/(?:churn|churn rate).*?(?:under|below|<|less than|maximum|max)\s*(\d+(?:\.\d+)?)\s*%/i) ||
                    lowerQuery.match(/(\d+(?:\.\d+)?)\s*%\s*(?:churn|churn rate)/i);
  if (churnMatch) {
    filters.churnRate = parseFloat(churnMatch[1]);
  }

  // Price range patterns: "under $2M", "price < 2000000"
  const priceMatch = lowerQuery.match(/(?:price|asking|cost).*?(?:under|below|<|less than|maximum|max)\s*\$?(\d+(?:\.\d+)?)\s*(k|thousand|m|million)?/i);
  if (priceMatch) {
    let value = parseFloat(priceMatch[1]);
    const unit = priceMatch[2]?.toLowerCase();
    if (unit === 'k' || unit === 'thousand') value *= 1000;
    if (unit === 'm' || unit === 'million') value *= 1000000;
    filters.maxPrice = value;
  }

  // Detect mode mismatch: if user searches for digital categories in operational mode or vice versa
  const digitalKeywords = ['saas', 'software', 'app', 'e-commerce', 'ecommerce', 'ai tool', 'content site', 'blog', 'website', 'mrr', 'churn', 'arr'];
  const operationalKeywords = ['gas station', 'car wash', 'franchise', 'convenience store', 'retail', 'restaurant', 'logistics', 'industrial', 'ebitda', 'cash flow'];
  
  const hasDigitalKeywords = digitalKeywords.some(keyword => lowerQuery.includes(keyword));
  const hasOperationalKeywords = operationalKeywords.some(keyword => lowerQuery.includes(keyword));
  
  if (mode === 'operational' && hasDigitalKeywords && !hasOperationalKeywords) {
    filters.suggestedMode = 'digital';
  } else if (mode === 'digital' && hasOperationalKeywords && !hasDigitalKeywords) {
    filters.suggestedMode = 'operational';
  }

  // If no structured filters extracted, keep the original query
  if (Object.keys(filters).length === 0 || lowerQuery.trim().length > 0) {
    filters.query = query;
  }

  return filters;
}

