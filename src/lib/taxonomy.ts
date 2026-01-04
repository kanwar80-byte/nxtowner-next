export type AssetType = 'Operational' | 'Digital';

export const ASSET_TYPES: AssetType[] = ['Operational', 'Digital'];

// Category definition with canonical code and display label
export interface CategoryDef {
  code: string; // snake_case canonical code for URLs/API
  label: string; // Display name for UI
  subcategories: string[]; // Array of subcategory display names
}

// Taxonomy with canonical codes
export const TAXONOMY = {
  Operational: {
    "fuel_auto": {
      code: "fuel_auto",
      label: "Fuel & Auto",
      subcategories: [
        "Gas Stations & C-Stores", "Truck Stops", "Car Washes", "Automotive Service & Repair",
        "EV Charging Stations", "Propane Refill / Exchange", "Fuel Distribution"
      ]
    },
    "food_hospitality": {
      code: "food_hospitality",
      label: "Food & Hospitality",
      subcategories: [
        "QSRs & Restaurants", "Cafés & Coffee Shops", "Bars & Pubs", "Bakeries",
        "Ghost Kitchens", "Catering Businesses", "Hotels & Motels", "Resorts", "Short-Term Rentals"
      ]
    },
    "retail_franchise": {
      code: "retail_franchise",
      label: "Retail & Franchise",
      subcategories: [
        "Convenience Stores", "Liquor & Beer Stores", "Specialty Retail", 
        "Franchise Retail Units", "Big Box / Anchor Retail", "Multi-Unit Retail Portfolios"
      ]
    },
    "industrial_logistics": {
      code: "industrial_logistics",
      label: "Industrial & Logistics",
      subcategories: [
        "Warehouses & Distribution", "Cold Storage", "Logistics & Transportation", 
        "Trucking Fleets", "Last-Mile Delivery", "Manufacturing", "Precision Fabrication", "Packaging & Processing"
      ]
    },
    "automotive_transportation": {
      code: "automotive_transportation",
      label: "Automotive & Transportation",
      subcategories: [
        "Dealerships", "Fleet Services", "Equipment Rental", "Car Rentals", "Specialty Vehicle Services"
      ]
    },
    "services_operational": {
      code: "services_operational",
      label: "Services (Operational)",
      subcategories: [
        "Healthcare Clinics", "Fitness & Wellness", "Education & Training", 
        "Childcare / Daycare", "Cleaning & Maintenance", "Security Services", "Landscaping & Property Services"
      ]
    },
    "real_estate_business": {
      code: "real_estate_business",
      label: "Real Estate + Business",
      subcategories: [
        "Owner-Occupied Commercial", "Mixed-Use Buildings", "Business + Land Packages", "Development-Ready Sites"
      ]
    }
  },
  Digital: {
    "saas_software": {
      code: "saas_software",
      label: "SaaS (Software)",
      subcategories: [
        "B2B SaaS", "B2C SaaS", "Vertical SaaS", "AI & Automation Tools", 
        "FinTech Platforms", "MarTech Platforms", "Subscription Software", "Enterprise Software"
      ]
    },
    "ecommerce": {
      code: "ecommerce",
      label: "E-commerce",
      subcategories: [
        "DTC Brands", "Amazon FBA", "Shopify Stores", "Private Label", 
        "Subscription Commerce", "Wholesale / B2B", "Multi-Brand Stores"
      ]
    },
    "agencies_services": {
      code: "agencies_services",
      label: "Agencies & Services",
      subcategories: [
        "Digital Marketing Agencies", "SEO / Paid Media", "Web Development", 
        "Creative / Branding", "IT Services & MSPs", "Consulting Firms", "Lead Generation"
      ]
    },
    "content_media": {
      code: "content_media",
      label: "Content & Media",
      subcategories: [
        "Content Websites", "Blogs & Authority Sites", "Affiliate Businesses", 
        "YouTube Channels", "Podcasts", "Newsletters", "Online Communities", "Digital Publications"
      ]
    },
    "marketplaces_platforms": {
      code: "marketplaces_platforms",
      label: "Marketplaces & Platforms",
      subcategories: [
        "Two-Sided Marketplaces", "Vertical Marketplaces", "Job Boards", 
        "Listing Platforms", "Booking Platforms", "Subscription Marketplaces"
      ]
    },
    "mobile_apps": {
      code: "mobile_apps",
      label: "Mobile Apps",
      subcategories: [
        "iOS / Android Apps", "Chrome Extensions", "Digital Tools", "No-Code Products", "APIs & Developer Tools"
      ]
    },
    "online_education": {
      code: "online_education",
      label: "Online Education",
      subcategories: [
        "Online Courses", "Cohort-Based Programs", "Membership Communities", 
        "Coaching Platforms", "Digital Training Products"
      ]
    }
  }
};

// Legacy format for backward compatibility (deprecated - use TAXONOMY directly)
export const TAXONOMY_LEGACY = {
  Operational: Object.fromEntries(
    Object.entries(TAXONOMY.Operational).map(([key, cat]) => [cat.label, cat.subcategories])
  ),
  Digital: Object.fromEntries(
    Object.entries(TAXONOMY.Digital).map(([key, cat]) => [cat.label, cat.subcategories])
  )
};
