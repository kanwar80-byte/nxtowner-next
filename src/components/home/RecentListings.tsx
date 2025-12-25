import { supabaseServer } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Listing = {
  id: string;
  title: string | null;
  city: string | null;
  province: string | null;
  asking_price: number | null;
  cash_flow: number | null;
  hero_image_url: string | null;
  created_at: string | null;
  subcategory: string | null;
  category: string | null;
};

export default async function RecentListings() {
  const supabase = await supabaseServer();

  const { data } = await supabase
    .from("listings")
    .select("id,title,city,province,asking_price,cash_flow,hero_image_url,created_at,subcategory,category")
    .order("created_at", { ascending: false })
    .limit(4);

  const rows = (data || []) as Listing[];

  if (rows.length === 0) {
    return (
      <section className="py-12 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Fresh This Week</h2>
          <p className="text-slate-500 mb-6">No new listings found this week.</p>
          <Link
            href="/browse"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Browse All Listings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 border-b border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Fresh This Week</h2>
          <Link
            href="/browse?sort=newest"
            className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {rows.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.id}`}
              className="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all h-full"
            >
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden w-full">
                {item.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.hero_image_url} alt={item.title || "Listing"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400 text-slate-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">
                  {item.title || "Untitled Listing"}
                </h3>
                {(() => {
                  const loc = [item.city, item.province].filter(Boolean).join(", ");
                  return <p className="text-xs text-slate-500 mb-2">{loc || "Canada"}</p>;
                })()}

                <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Price</p>
                    <p className="text-sm font-bold">
                      {typeof item.asking_price === "number" ? `$${item.asking_price.toLocaleString()}` : "Confidential"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Cash Flow</p>
                    <p className="text-sm font-bold text-green-600">
                      {typeof item.cash_flow === "number" ? `$${item.cash_flow.toLocaleString()}` : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}