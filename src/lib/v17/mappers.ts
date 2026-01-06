import type { ListingTeaserV17 } from "./types";

/**
 * Maps ListingTeaserV17 to SmartListingGrid Listing format
 * Used for homepage featured listings
 */
export function mapV17ToGridListings(
  v17Listings: ListingTeaserV17[]
): Array<{
  id: string;
  title: string;
  category: string;
  type: "operational" | "digital";
  price: string;
  metricLabel: string;
  metricValue: string;
  locationOrModel: string;
  imageUrl: string;
  badges: string[];
}> {
  const formatMoney = (amount: number | null | undefined) => {
    if (!amount || amount === 0) return "Contact for Price";
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(amount);
  };

  return v17Listings.map((item) => {
    const isOps = item.asset_type === "operational";
    const ebitda = item.cash_flow ?? 0;
    const revenue = item.revenue_annual ?? 0;

    // Determine metric label and value
    let metricLabel = "Revenue";
    let metricValue = revenue > 0 ? formatMoney(revenue) : "N/A";

    if (isOps) {
      metricLabel = "EBITDA";
      metricValue = ebitda > 0 ? formatMoney(ebitda) : "N/A";
    } else {
      metricLabel = "Revenue";
      metricValue = revenue > 0 ? formatMoney(revenue) : "N/A";
    }

    // Generate badges
    const badges: string[] = [];
    if (item.status === "published") {
      badges.push("Published");
    }
    if (item.status === "teaser") {
      badges.push("Featured");
    }
    if (isOps && item.city) {
      badges.push("Prime Location");
    }
    if (badges.length === 0) {
      badges.push("Active Listing");
    }

    return {
      id: item.id,
      title: item.title || "",
      category: item.category_id || item.subcategory_id || "General", // Use ID temporarily; UI should lookup names
      type: isOps ? ("operational" as const) : ("digital" as const),
      price: item.asking_price ? formatMoney(item.asking_price) : "Contact for Price",
      metricLabel,
      metricValue,
      locationOrModel: isOps
        ? item.city || "Location TBD"
        : "Remote / Digital",
      imageUrl:
        item.hero_image_url || "/images/placeholder.jpg",
      badges: badges.slice(0, 2),
    };
  });
}

