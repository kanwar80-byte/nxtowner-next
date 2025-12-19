export type AssetType = 'Operational' | 'Digital';

export const ASSET_TYPES: AssetType[] = ['Operational', 'Digital'];

export const TAXONOMY = {
  Operational: {
    "Fuel & Auto": [
      "Gas Stations & C-Stores", "Truck Stops", "Car Washes", "Automotive Service & Repair",
      "EV Charging Stations", "Propane Refill / Exchange", "Fuel Distribution"
    ],
    "Food & Hospitality": [
      "QSRs & Restaurants", "Cafés & Coffee Shops", "Bars & Pubs", "Bakeries",
      "Ghost Kitchens", "Catering Businesses", "Hotels & Motels", "Resorts", "Short-Term Rentals"
    ],
    "Retail & Franchise": [
      "Convenience Stores", "Liquor & Beer Stores", "Specialty Retail", 
      "Franchise Retail Units", "Big Box / Anchor Retail", "Multi-Unit Retail Portfolios"
    ],
    "Industrial & Logistics": [
      "Warehouses & Distribution", "Cold Storage", "Logistics & Transportation", 
      "Trucking Fleets", "Last-Mile Delivery", "Manufacturing", "Precision Fabrication", "Packaging & Processing"
    ],
    "Automotive & Transportation": [
      "Dealerships", "Fleet Services", "Equipment Rental", "Car Rentals", "Specialty Vehicle Services"
    ],
    "Services (Operational)": [
      "Healthcare Clinics", "Fitness & Wellness", "Education & Training", 
      "Childcare / Daycare", "Cleaning & Maintenance", "Security Services", "Landscaping & Property Services"
    ],
    "Real Estate + Business": [
      "Owner-Occupied Commercial", "Mixed-Use Buildings", "Business + Land Packages", "Development-Ready Sites"
    ]
  },
  Digital: {
    "SaaS (Software)": [
      "B2B SaaS", "B2C SaaS", "Vertical SaaS", "AI & Automation Tools", 
      "FinTech Platforms", "MarTech Platforms", "Subscription Software", "Enterprise Software"
    ],
    "E-commerce": [
      "DTC Brands", "Amazon FBA", "Shopify Stores", "Private Label", 
      "Subscription Commerce", "Wholesale / B2B", "Multi-Brand Stores"
    ],
    "Agencies & Services": [
      "Digital Marketing Agencies", "SEO / Paid Media", "Web Development", 
      "Creative / Branding", "IT Services & MSPs", "Consulting Firms", "Lead Generation"
    ],
    "Content & Media": [
      "Content Websites", "Blogs & Authority Sites", "Affiliate Businesses", 
      "YouTube Channels", "Podcasts", "Newsletters", "Online Communities", "Digital Publications"
    ],
    "Marketplaces & Platforms": [
      "Two-Sided Marketplaces", "Vertical Marketplaces", "Job Boards", 
      "Listing Platforms", "Booking Platforms", "Subscription Marketplaces"
    ],
    "Mobile Apps": [
      "iOS / Android Apps", "Chrome Extensions", "Digital Tools", "No-Code Products", "APIs & Developer Tools"
    ],
    "Online Education": [
      "Online Courses", "Cohort-Based Programs", "Membership Communities", 
      "Coaching Platforms", "Digital Training Products"
    ]
  }
};
