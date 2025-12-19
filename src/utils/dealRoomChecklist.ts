export type ChecklistItem = {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  category: "financials" | "operations" | "legal" | "performance" | "assets" | "risk";
  status: "todo" | "in_progress" | "done";
  source?: "baseline" | "nxtai_missing";
};

const baselineOperational: ChecklistItem[] = [
  // Financials
  {
    id: "op-fin-ttm-pl",
    title: "TTM P&L statement",
    required: true,
    category: "financials",
    status: "todo",
    source: "baseline",
  },
  {
    id: "op-fin-monthly-sales",
    title: "Monthly sales report (last 12 months)",
    required: true,
    category: "financials",
    status: "todo",
    source: "baseline",
  },
  {
    id: "op-fin-expense-breakdown",
    title: "Expense breakdown (rent/payroll/utilities/other)",
    required: true,
    category: "financials",
    status: "todo",
    source: "baseline",
  },
  // Operations
  {
    id: "op-ops-staff",
    title: "Staff schedule + wage summary",
    required: false,
    category: "operations",
    status: "todo",
    source: "baseline",
  },
  {
    id: "op-ops-suppliers",
    title: "Supplier list + key terms",
    required: false,
    category: "operations",
    status: "todo",
    source: "baseline",
  },
  // Assets
  {
    id: "op-assets-equipment",
    title: "Equipment list + condition notes",
    required: false,
    category: "assets",
    status: "todo",
    source: "baseline",
  },
  {
    id: "op-assets-inventory",
    title: "Inventory summary",
    required: true,
    category: "assets",
    status: "todo",
    source: "baseline",
  },
  // Legal
  {
    id: "op-legal-lease",
    title: "Lease agreement + renewal terms",
    required: true,
    category: "legal",
    status: "todo",
    source: "baseline",
  },
  {
    id: "op-legal-licenses",
    title: "Licenses/permits list",
    required: true,
    category: "legal",
    status: "todo",
    source: "baseline",
  },
  // Risk
  {
    id: "op-risk-env",
    title: "Environmental docs / compliance",
    required: false,
    category: "risk",
    status: "todo",
    source: "baseline",
  },
];

const baselineDigital: ChecklistItem[] = [
  // Financials
  {
    id: "dig-fin-ttm-pl",
    title: "TTM P&L",
    required: true,
    category: "financials",
    status: "todo",
    source: "baseline",
  },
  {
    id: "dig-fin-revenue-proof",
    title: "Revenue proof (Stripe/Shopify/Amazon/etc.)",
    required: true,
    category: "financials",
    status: "todo",
    source: "baseline",
  },
  // Performance
  {
    id: "dig-perf-analytics",
    title: "Traffic analytics (GA / Search Console)",
    required: true,
    category: "performance",
    status: "todo",
    source: "baseline",
  },
  {
    id: "dig-perf-cohort",
    title: "Customer cohort / retention snapshot",
    required: false,
    category: "performance",
    status: "todo",
    source: "baseline",
  },
  // Operations
  {
    id: "dig-ops-sops",
    title: "SOPs / process docs",
    required: false,
    category: "operations",
    status: "todo",
    source: "baseline",
  },
  {
    id: "dig-ops-team",
    title: "Team/contractor list",
    required: false,
    category: "operations",
    status: "todo",
    source: "baseline",
  },
  // Legal
  {
    id: "dig-legal-domain",
    title: "Domain + IP ownership confirmation",
    required: true,
    category: "legal",
    status: "todo",
    source: "baseline",
  },
  {
    id: "dig-legal-platform",
    title: "Key platform accounts ownership",
    required: true,
    category: "legal",
    status: "todo",
    source: "baseline",
  },
  // Risk
  {
    id: "dig-risk-platform",
    title: "Platform dependency statement",
    required: false,
    category: "risk",
    status: "todo",
    source: "baseline",
  },
];

// Mapping for missing signals
const missingMappings: { [key: string]: Partial<ChecklistItem> } = {
  revenue: {
    title: "TTM Revenue Summary",
    category: "financials",
    required: true,
    description: "Provide a summary of trailing-12-month revenue.",
  },
  "operating expenses": {
    title: "Normalized SDE schedule (add-backs support)",
    category: "financials",
    required: true,
    description: "Breakdown of add-backs and adjustments to SDE.",
  },
  "add-back": {
    title: "Normalized SDE schedule (add-backs support)",
    category: "financials",
    required: true,
    description: "Breakdown of add-backs and adjustments to SDE.",
  },
  noi: {
    title: "NOI + property tax/insurance summary",
    category: "financials",
    required: true,
    description: "Net operating income and property expenses.",
  },
  "real estate": {
    title: "NOI + property tax/insurance summary",
    category: "financials",
    required: true,
    description: "Net operating income and property expenses.",
  },
  "customer concentration": {
    title: "Top customers % breakdown",
    category: "performance",
    required: true,
    description: "Show revenue share of top customers.",
  },
  "platform dependency": {
    title: "Platform risk + mitigation plan",
    category: "risk",
    required: true,
    description: "Describe platform risk and mitigation.",
  },
  lease: {
    title: "Lease renewal status letter",
    category: "legal",
    required: true,
    description: "Provide letter or document on lease renewal.",
  },
};

function dedupeByTitle(items: ChecklistItem[]): ChecklistItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildDealRoomChecklist(params: {
  track: "operational" | "digital";
  missing?: string[];
}): ChecklistItem[] {
  const base =
    params.track === "operational"
      ? [...baselineOperational]
      : [...baselineDigital];

  let mapped: ChecklistItem[] = [];
  if (params.missing && Array.isArray(params.missing)) {
    for (const miss of params.missing) {
      for (const key in missingMappings) {
        if (miss.toLowerCase().includes(key)) {
          const map = missingMappings[key];
          mapped.push({
            id: `nxtai-missing-${key}`,
            title: map.title!,
            description: map.description,
            required: !!map.required,
            category: map.category!,
            status: "todo",
            source: "nxtai_missing",
          });
        }
      }
    }
  }

  // Merge and dedupe
  const all = dedupeByTitle([...base, ...mapped]);
  // Order by category priority
  const catOrder = [
    "financials",
    "performance",
    "operations",
    "assets",
    "legal",
    "risk",
  ];
  all.sort(
    (a, b) =>
      catOrder.indexOf(a.category) - catOrder.indexOf(b.category) ||
      a.title.localeCompare(b.title)
  );
  return all;
}
