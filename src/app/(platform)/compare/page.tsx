




import { supabaseServer } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const ComparisonTable = dynamic(() => import("@/components/platform/ComparisonTable"), { ssr: false });


export default async function ComparePage({ searchParams }: { searchParams: Promise<{ selectedIds?: string[] }> }) {
  const params = await searchParams;
  const selectedIds = params.selectedIds || [];
  if (!selectedIds.length) return redirect('/browse');

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("listings")
    .select("id, title, category, hero_image_url, asking_price, gross_revenue, ebitda, ai_analysis(*), operational_data(*), digital_data(*)")
    .in("id", selectedIds);

  if (error || !data?.length) return redirect('/browse');

  return (
    <div className="max-w-7xl mx-auto py-10 px-2">
      <h1 className="text-2xl font-bold mb-8 text-center">Business Comparison</h1>
      <div className="overflow-x-auto">
        <ComparisonTable listings={data} />
      </div>
    </div>
  );
}
