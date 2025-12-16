/**
 * Helper to get all sub-categories for a given main category name (e.g., 'Fuel & Auto').
 * This is used by the server action to search for listings tagged with any sub-category.
 */
/**
 * Helper to get all sub-categories (leaf nodes) for a given main category name (e.g., 'Fuel & Auto').
 * This is used by the server action to search for listings tagged with any sub-category.
 */
export function getSubCategoriesForMainCategory(mainCategoryName: string): string[] | undefined {
  // --- 🚨 DEBUG START 🚨 ---
  console.log(`[CATEGORY DEBUG] Attempting lookup for Main Category: ${mainCategoryName}`);
  // --- 🚨 DEBUG END 🚨 ---

  // Check 'physical' group
  if (TAXONOMY.physical.categories.hasOwnProperty(mainCategoryName)) {
    const subCategories = (TAXONOMY.physical.categories as any)[mainCategoryName];
    console.log(`[CATEGORY DEBUG] Found Physical Sub-Categories: ${subCategories.join(', ')}`); // 🚨 NEW LOG
    return subCategories;
  }
  // Check 'digital' group
  if (TAXONOMY.digital.categories.hasOwnProperty(mainCategoryName)) {
    const subCategories = (TAXONOMY.digital.categories as any)[mainCategoryName];
    console.log(`[CATEGORY DEBUG] Found Digital Sub-Categories: ${subCategories.join(', ')}`); // 🚨 NEW LOG
    return subCategories;
  }
  console.log(`[CATEGORY DEBUG] Lookup failed for: ${mainCategoryName}. Returning undefined.`); // 🚨 NEW LOG
  return undefined; 
}
// 1. Define the Master Taxonomy (For the UI Sidebar)
// 1. Define the Master Taxonomy (For the UI Sidebar)
export const TAXONOMY = {
  // GROUP A: PHYSICAL & ASSET-BACKED (Renamed from OPERATIONAL to 'physical')
  physical: {
    label: "Physical & Asset-Backed",
    categories: {
      "Fuel & Auto": [
        "Gas Stations", "Gas Station + Convenience", "Truck Stops", "EV Charging", "Service Stations"
      ],
      "Car Wash": [
        "Tunnel Car Wash", "Self-Serve", "Automatic", "Car Wash + Gas"
      ],
      "Food & Beverage": [
        "QSR / Fast Food", "Franchise Restaurant", "Independent Restaurant", "Cafe", "Bar / Pub", "Ghost Kitchen"
      ],
      "Retail": [
        "Convenience Store", "Liquor Store", "Pharmacy", "Cannabis / Vape", "Specialty Retail"
      ],
      "Industrial & Logistics": [
        "Manufacturing", "Warehouse", "Distribution / 3PL", "Trucking / Logistics", "Self-Storage"
      ],
      "Service Businesses": [
        "Cleaning / Janitorial", "Landscaping", "HVAC / Plumbing", "Pest Control", "Property Management", "Security"
      ],
      "Health & Wellness": [
        "Dental Clinic", "Medical Practice", "Gym / Fitness", "Senior Care"
      ],
      "Education": [
        "Daycare", "Private School", "Tutoring Center", "Trade School"
      ]
    }
  },

  // GROUP B: DIGITAL & SCALABLE (Renamed from DIGITAL to 'digital')
  digital: {
    label: "Digital & Scalable",
    categories: {
      "SaaS & Software": [
        "B2B SaaS", "Micro-SaaS", "AI Tools", "Dev Tools"
      ],
      "E-commerce": [
        "Shopify / DTC", "Amazon FBA", "Dropshipping", "Subscription Box"
      ],
      "Content & Media": [
        "Content Site / Blog", "Newsletter", "YouTube Channel", "Affiliate Site"
      ],
      "Agency & Service": [
        "Marketing Agency", "SEO Agency", "Design Studio", "Dev Shop"
      ],
      "Apps": [
        "Mobile App", "Marketplace Platform", "Community"
      ]
    }
  }
};

// 2. Helper Helpers (For the Database / Server Actions)
// We flatten the nested lists so the DB can say "Give me ANY Operational business"
export const FLAT_CATEGORIES = {
  physical: Object.values(TAXONOMY.physical.categories).flat(),
  digital: Object.values(TAXONOMY.digital.categories).flat()
};

// 3. For the Dropdowns (Top-level categories only)
export const ALL_MAIN_CATEGORIES = [
  ...Object.keys(TAXONOMY.physical.categories),
  ...Object.keys(TAXONOMY.digital.categories)
];