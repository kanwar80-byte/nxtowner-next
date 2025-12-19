import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { TAXONOMY, AssetType } from '@/lib/taxonomy';

export async function GET() {
  const supabase = await createClient();
  let createdCount = 0;
  const errors = [];

  // Loop through Operational and Digital
  for (const type of Object.keys(TAXONOMY) as AssetType[]) {
    const categories = TAXONOMY[type];

    // Loop through Main Categories (e.g., "SaaS", "Fuel & Auto")
    for (const mainCat of Object.keys(categories)) {
      // @ts-ignore
      const subCats = categories[mainCat];

      // Loop through Subcategories (e.g., "B2B SaaS", "Car Washes")
      for (const subCat of subCats) {
        
        // 1. Check if a listing already exists for this subcategory
        const { data: existing } = await supabase
          .from('listings')
          .select('id')
          .eq('sub_category', subCat)
          .limit(1);

        if (existing && existing.length > 0) {
          // Skip if already exists to avoid duplicates
          continue; 
        }

        // 2. Create the "Perfect Data" Sample
        const isDigital = type === 'Digital';
        
        const sampleListing = {
          title: `Demo: Premier ${subCat} Opportunity`,
          description: `This is a verified sample listing for a ${subCat} business. It features strong unit economics, a loyal customer base, and consistent year-over-year growth. Perfect for an investor looking for ${isDigital ? 'scalable digital assets' : 'stable operational cash flow'}.`,
          
          // Taxonomy Consistency (CRITICAL)
          asset_type: type,
          main_category: mainCat,
          sub_category: subCat,
          category: mainCat, // Fallback
          
          // Financials (Randomized for realism)
          asking_price: isDigital ? 500000 + Math.floor(Math.random() * 2000000) : 1500000 + Math.floor(Math.random() * 3000000),
          annual_revenue: 1000000 + Math.floor(Math.random() * 500000),
          annual_cashflow: 200000 + Math.floor(Math.random() * 150000),
          
          // Meta
          location: isDigital ? 'Remote / Global' : 'Toronto, ON',
          status: 'active',
          is_verified: true,
          has_deal_room: true,
          nxt_score: 85 + Math.floor(Math.random() * 10), // High score for demo
          owner_id: null // Anonymous for demo
        };

        const { error } = await supabase.from('listings').insert(sampleListing);
        
        if (error) {
          console.error(`Failed to create ${subCat}:`, error);
          errors.push(subCat);
        } else {
          createdCount++;
        }
      }
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: `Database seeded! Created ${createdCount} new listings.`,
    errors 
  });
}
