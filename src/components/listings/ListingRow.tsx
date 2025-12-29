import Link from "next/link";
import Image from "next/image";
import { PublicListing } from "@/types/listing";
import { MapPin, Globe, DollarSign, Clock } from "lucide-react";

export function ListingRow({ listing }: { listing: PublicListing }) {
    // Check for primary_image_url first, fallback to image_url
    const imageUrl = listing.primary_image_url || listing.image_url; 
    
    // Check if the listing has been created recently (e.g., last 14 days)
    const isNew = new Date(listing.created_at) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    
    // Check for a price drop (requires having a previous_price in your data)
    const isPriceDrop = listing.price && listing.previous_price && listing.price < listing.previous_price;

    const formatMoney = (amount: number | null) => {
        if (!amount || amount === 0) return "Contact";
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
        return `$${amount}`;
    };

    return (
        <Link 
            href={`/listing/${listing.id}`}
            className="group flex flex-col md:flex-row items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-lg"
        >
            {/* 1. THUMBNAIL & BADGES */}
            <div className="relative h-48 w-full md:h-32 md:w-48 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                {imageUrl ? (
                    <Image 
                        src={imageUrl} 
                        alt={listing.title || "Untitled Listing"} 
                        fill 
                        className="object-cover transition-all duration-300 group-hover:scale-105" 
                        // IMPORTANT: Add priority for faster loading on the browse page
                        priority={true} 
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                        <DollarSign size={20} className="mr-1"/> NxtOwner Listing
                    </div>
                )}
                
                {/* Badges Overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isNew && (
                        <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-md">
                            NEW
                        </span>
                    )}
                    {listing.seller_financing && (
                        <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-md">
                            FINANCING
                        </span>
                    )}
                    {isPriceDrop && (
                         <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-md">
                            PRICE DROP
                        </span>
                    )}
                    {listing.is_ai_verified && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-md">
                            AI VERIFIED
                        </span>
                    )}
                </div>
            </div>

            {/* 2. DETAILS (Title, Category, Summary, Location) */}
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        {listing.category || "Business"}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                        {listing.asset_type === 'digital' 
                            ? <><Globe size={12} className="mr-1"/> Remote / Online</>
                            : <><MapPin size={12} className="mr-1"/> {listing.location || "Location Unknown"}</>
                        }
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600">
                    {listing.title || "Untitled"}
                </h3>
                
                {/* Summary */}
                <p className="mt-1 text-base text-gray-600 line-clamp-2">
                    {listing.short_description || listing.description || "No detailed summary provided for this listing."}
                </p>
                
                {/* Key Tags/Info from Gas Station Example */}
                {(listing.gas_volume || listing.store_sales) && (
                     <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        {listing.gas_volume && (
                            <p className="font-medium flex items-center">
                                <Clock size={12} className="mr-1 text-gray-400"/>
                                Gas Volume: {listing.gas_volume} Liters
                            </p>
                        )}
                        {listing.store_sales && (
                            <p className="font-medium flex items-center">
                                <DollarSign size={12} className="mr-1 text-gray-400"/>
                                Store Sales: {formatMoney(listing.store_sales)}
                            </p>
                        )}
                     </div>
                )}
            </div>

            {/* 3. FINANCIALS (Side Column) */}
            <div className="w-full md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4 mt-4 md:mt-0 pt-4 md:pt-0">
                
                {/* Primary Metric 1: Asking Price (most prominent) */}
                <div className="mb-3">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Asking Price</p>
                    <p className="text-2xl font-extrabold text-green-700">{formatMoney(listing.price)}</p>
                </div>
                
                {/* Secondary Metrics: Cashflow & Revenue */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase">Cashflow (SDE)</p>
                        <p className="text-sm font-bold text-blue-600">{formatMoney(listing.cashflow_numeric)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase">Revenue (TTM)</p>
                        <p className="text-sm font-bold text-gray-700">{formatMoney(listing.revenue)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
