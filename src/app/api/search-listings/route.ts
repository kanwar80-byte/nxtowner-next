import { NextRequest, NextResponse } from "next/server";
import { searchListingsV17 } from "@/lib/v17/listings.repo";

export const dynamic = "force-dynamic";

type AssetType = "operational" | "digital";

function parseOptionalString(v: string | null): string | undefined {
  const s = (v ?? "").trim();
  return s.length ? s : undefined;
}

function parseOptionalInt(v: string | null, fallback: number): number {
  const n = Number.parseInt((v ?? "").trim(), 10);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    const asset_type = parseOptionalString(sp.get("assetType")) as AssetType | undefined;
    const category_id = parseOptionalString(sp.get("categoryId"));
    const subcategory_id = parseOptionalString(sp.get("subcategoryId"));
    const query = parseOptionalString(sp.get("query"));

    // Optional pagination / control
    const limit = Math.min(Math.max(parseOptionalInt(sp.get("limit"), 20), 1), 50);

    // Optional ranges (only if your repo supports them; safe to pass undefined)
    const min_price = sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined;
    const max_price = sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined;
    const min_revenue = sp.get("minRevenue") ? Number(sp.get("minRevenue")) : undefined;
    const max_revenue = sp.get("maxRevenue") ? Number(sp.get("maxRevenue")) : undefined;

    // Optional location
    const country = parseOptionalString(sp.get("country"));
    const province = parseOptionalString(sp.get("province"));
    const city = parseOptionalString(sp.get("city"));
    const is_remote = sp.get("remote") === "true" ? true : sp.get("remote") === "false" ? false : undefined;

    const listings = await searchListingsV17({
      asset_type,
      category_id,
      subcategory_id,
      query,
      limit,
      // pass-through if your repo supports these
      min_price,
      max_price,
      min_revenue,
      max_revenue,
      country,
      province,
      city,
      is_remote,
    } as any);

    return NextResponse.json(listings);
  } catch (err) {
    console.error("API /search-listings error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

