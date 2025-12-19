// Baseline multiple ranges for operational and digital
export const valuationModels = {
  operational: {
    "Gas Station": [2.0, 3.5],
    "Car Wash": [3.0, 5.0],
    "QSR/Franchise": [2.5, 4.0],
    "Convenience Retail": [2.0, 3.5],
    "Logistics": [2.5, 4.0],
    "Other": [2.0, 3.5],
  },
  digital: {
    SaaS: [3.0, 6.0],
    Ecom: [2.0, 4.0],
    Agency: [2.0, 3.5],
    Content: [2.0, 4.0],
    Other: [2.0, 3.0],
  },
};

function parseNum(val: any): number {
  const n = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : Number(val);
  return isNaN(n) ? 0 : n;
}

// --- Operational Valuation ---
export function getOperationalValuation(data: any) {
  const baseRange =
    valuationModels.operational[data.category] || [2.0, 3.5];
  let [low, high] = baseRange;

  // SDE = (Revenue * GM%) - Opex + Addbacks
  const revenue = parseNum(data.revenue);
  const grossMargin = parseNum(data.grossMargin) / 100;
  const opex = parseNum(data.opex);
  const addbacks = parseNum(data.addbacks);

  let sde = revenue * grossMargin - opex + addbacks;

  // Inventory
  if (data.inventoryIncluded === "yes") {
    sde += parseNum(data.inventoryAmount);
  }

  // Real estate
  let realEstateValue = 0;
  if (data.realEstateIncluded === "yes") {
    const noi = parseNum(data.realEstateNOI);
    const cap = parseNum(data.realEstateCap);
    if (noi && cap) {
      realEstateValue = noi / (cap / 100);
      sde += realEstateValue;
    }
  }

  // Risk adjustments
  let riskAdj = 0;
  if (Array.isArray(data.riskFlags)) {
    riskAdj -= data.riskFlags.length * 0.2;
  }
  // Addbacks included = slight positive
  if (addbacks > 0) riskAdj += 0.1;

  // Clamp
  let adjLow = Math.max(1.0, low + riskAdj);
  let adjHigh = Math.max(adjLow, high + riskAdj);

  // Output
  return {
    low: Math.round(sde * adjLow),
    base: Math.round(sde * ((adjLow + adjHigh) / 2)),
    high: Math.round(sde * adjHigh),
    multipleLow: adjLow,
    multipleHigh: adjHigh,
    confidence: sde > 0 ? (riskAdj > -0.5 ? "High" : "Medium") : "Low",
    drivers: getOperationalDrivers(data, sde),
    risks: Array.isArray(data.riskFlags) && data.riskFlags.length > 0 ? data.riskFlags.slice(0, 3) : ["No major risks flagged"],
  };
}

export function getOperationalDrivers(data: any, sde: number): string[] {
  const out: string[] = [];
  if (parseNum(data.grossMargin) > 40) out.push("Strong gross margin");
  if (parseNum(data.addbacks) > 0) out.push("Owner add-backs included");
  if (data.inventoryIncluded === "yes") out.push("Inventory included");
  if (data.realEstateIncluded === "yes") out.push("Real estate included");
  if (sde > 250000) out.push("High SDE");
  if (!out.length) out.push("Solid fundamentals");
  return out.slice(0, 3);
}

// --- Digital Valuation ---
export function getDigitalValuation(data: any) {
  const baseRange =
    valuationModels.digital[data.model] || [2.0, 3.0];
  let [low, high] = baseRange;

  const profit = parseNum(data.profit);

  // Risk adjustments
  let riskAdj = 0;
  if (Array.isArray(data.riskFlags)) {
    riskAdj -= data.riskFlags.length * 0.2;
  }
  // Recurring revenue
  if (parseNum(data.recurring) > 60) riskAdj += 0.1;
  // Low concentration
  if (parseNum(data.concentration) < 30 && data.concentration !== "") riskAdj += 0.1;
  // Organic traffic
  if (data.traffic === "Organic") riskAdj += 0.1;
  // Platform risk
  if (data.platformRisk === "Low") riskAdj += 0.1;
  if (data.platformRisk === "High") riskAdj -= 0.2;
  // Revenue trend
  if (data.revenueTrend === "Growing") riskAdj += 0.1;
  if (data.revenueTrend === "Declining") riskAdj -= 0.2;

  // Clamp
  let adjLow = Math.max(1.0, low + riskAdj);
  let adjHigh = Math.max(adjLow, high + riskAdj);

  // Output
  return {
    low: Math.round(profit * adjLow),
    base: Math.round(profit * ((adjLow + adjHigh) / 2)),
    high: Math.round(profit * adjHigh),
    multipleLow: adjLow,
    multipleHigh: adjHigh,
    confidence: profit > 0 ? (riskAdj > -0.5 ? "High" : "Medium") : "Low",
    drivers: getDigitalDrivers(data, profit),
    risks: Array.isArray(data.riskFlags) && data.riskFlags.length > 0 ? data.riskFlags.slice(0, 3) : ["No major risks flagged"],
  };
}

export function getDigitalDrivers(data: any, profit: number): string[] {
  const out: string[] = [];
  if (parseNum(data.recurring) > 60) out.push("High recurring revenue");
  if (parseNum(data.concentration) < 30 && data.concentration !== "") out.push("Low customer concentration");
  if (data.traffic === "Organic") out.push("Organic traffic");
  if (data.platformRisk === "Low") out.push("Low platform risk");
  if (data.revenueTrend === "Growing") out.push("Growing revenue");
  if (profit > 100000) out.push("Strong profit");
  if (!out.length) out.push("Solid fundamentals");
  return out.slice(0, 3);
}

export type ReadinessTier = "not_ready" | "nearly_ready" | "deal_ready";

export function getListingReadiness(params: {
  track: "operational" | "digital";
  operational?: any;
  digital?: any;
}): {
  score: number;
  tier: ReadinessTier;
  missing: string[];
  strengths: string[];
} {
  let score = 100;
  const missing: string[] = [];
  const strengths: string[] = [];
  const { track, operational, digital } = params;
  let riskFlags: string[] = [];
  let riskCount = 0;

  if (track === "operational") {
    const o = operational || {};
    // Revenue
    if (!o.revenue) {
      score -= 25;
      missing.push("Add trailing-12-month revenue.");
    } else {
      strengths.push("Revenue provided.");
    }
    // Gross Margin
    if (!o.grossMargin) {
      score -= 10;
      missing.push("Add gross margin %.");
    } else {
      strengths.push("Gross margin provided.");
    }
    // Opex
    if (!o.opex) {
      score -= 10;
      missing.push("Provide operating expenses.");
    } else {
      strengths.push("Operating expenses provided.");
    }
    // Addbacks
    if (o.addbacks === "" || o.addbacks === undefined || o.addbacks === null) {
      score -= 5;
      missing.push("Add owner add-backs.");
    }
    // Location
    if (!o.location) {
      score -= 5;
      missing.push("Add business location.");
    }
    // Real Estate
    if (o.realEstateIncluded === "yes" && !o.realEstateNOI) {
      score -= 15;
      missing.push("Add NOI for real estate valuation.");
    }
    // Inventory
    if (o.inventoryIncluded === "yes" && !o.inventoryAmount) {
      score -= 10;
      missing.push("Add inventory value.");
    }
    // Risk flags
    riskFlags = Array.isArray(o.riskFlags) ? o.riskFlags : [];
    riskCount = riskFlags.length;
    if (riskCount > 0) {
      score -= Math.min(25, riskCount * 5);
      if (riskCount > 2) score -= 10;
      missing.push("Reduce key risks (lease expiry, concentration, regulatory).");
    } else {
      strengths.push("Low risk profile.");
    }
    // Profit/SDE completeness
    if (!o.grossMargin || !o.opex || o.addbacks === "" || o.addbacks === undefined || o.addbacks === null) {
      score -= 25;
      missing.push("Provide gross margin, opex, and add-backs to normalize SDE.");
    } else {
      strengths.push("Complete financial inputs provided.");
    }
  } else {
    const d = digital || {};
    // Revenue
    if (!d.revenue) {
      score -= 25;
      missing.push("Add trailing-12-month revenue.");
    } else {
      strengths.push("Revenue provided.");
    }
    // Profit/SDE
    if (!d.profit) {
      score -= 25;
      missing.push("Add profit/SDE.");
    } else {
      strengths.push("Profit/SDE provided.");
    }
    // Revenue trend
    if (!d.revenueTrend) {
      score -= 5;
      missing.push("Add revenue trend.");
    }
    // Recurring % (SaaS)
    if (d.model === "SaaS" && !d.recurring) {
      score -= 10;
      missing.push("Add recurring revenue %.");
    }
    // Customer concentration
    if (!d.concentration) {
      score -= 10;
      missing.push("Add customer concentration.");
    }
    // Platform risk
    if (d.platformRisk === "High") {
      score -= 10;
      missing.push("Reduce platform risk.");
    }
    // Risk flags
    riskFlags = Array.isArray(d.riskFlags) ? d.riskFlags : [];
    riskCount = riskFlags.length;
    if (riskCount > 0) {
      score -= Math.min(25, riskCount * 5);
      if (riskCount > 2) score -= 10;
      missing.push("Reduce key risks (platform dependency, churn, concentration).");
    } else {
      strengths.push("Low risk profile.");
    }
    // Strengths
    if (d.recurring && Number(d.recurring) > 60) strengths.push("Recurring revenue is strong.");
    if (d.concentration && Number(d.concentration) < 30) strengths.push("Low customer concentration.");
    if (d.traffic === "Organic") strengths.push("Organic traffic.");
    if (d.platformRisk === "Low") strengths.push("Low platform risk.");
    if (d.revenueTrend === "Growing") strengths.push("Growing revenue.");
    if (d.profit && Number(d.profit) > 100000) strengths.push("Strong profit.");
    if (d.revenue && d.profit) strengths.push("Complete financial inputs provided.");
  }

  // Clamp and tier
  score = Math.max(0, Math.min(100, score));
  let tier: ReadinessTier = "not_ready";
  if (score >= 80) tier = "deal_ready";
  else if (score >= 55) tier = "nearly_ready";
  else tier = "not_ready";

  return {
    score,
    tier,
    missing: missing.slice(0, 5),
    strengths: strengths.slice(0, 3),
  };
}
