import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import { MapPin, Server, Building2, User } from "lucide-react"; // Icons

interface ListingCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  dealType: "operational" | "digital"; // The switch
  metric1: string; // e.g. EBITDA or MRR
  metric2: string; // e.g. Location or Tech Stack
  sourceName?: string; // Broker Name or Founder Name
}

export function ListingCard({
  id,
  title,
  price,
  image,
  dealType,
  metric1,
  metric2,
  sourceName = "NxtOwner Verified",
}: ListingCardProps) {
  
  const isBroker = dealType === "operational";

  return (
    <Link href={`/listing/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-600 hover:shadow-2xl">
        
        {/* IMAGE SECTION */}
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* THE TRUST BADGE */}
          <div className="absolute top-3 left-3">
            {isBroker ? (
              <Badge className="bg-amber-600 text-white hover:bg-amber-700 border-none px-3 py-1 uppercase tracking-wider text-[10px] font-bold shadow-md">
                <Building2 className="w-3 h-3 mr-1 inline" /> Broker Listed
              </Badge>
            ) : (
              <Badge className="bg-teal-600 text-white hover:bg-teal-700 border-none px-3 py-1 uppercase tracking-wider text-[10px] font-bold shadow-md">
                <User className="w-3 h-3 mr-1 inline" /> Founder Direct
              </Badge>
            )}
          </div>

          {/* PRICE TAG (Bottom Right of Image) */}
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
            <span className="text-white font-bold text-sm">{price}</span>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 group-hover:text-amber-500 transition-colors">
            {title}
          </h3>
          
          {/* SOURCE (Broker vs Founder) */}
          <p className="text-xs text-slate-400 mb-4 flex items-center">
            Listed by: <span className="text-slate-200 ml-1">{sourceName}</span>
          </p>

          {/* METRICS GRID */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            
            {/* Metric 1: Location vs Tech Stack */}
            <div className="bg-slate-800/50 p-2 rounded flex items-center gap-2">
              {isBroker ? (
                <MapPin className="w-4 h-4 text-amber-500" />
              ) : (
                <Server className="w-4 h-4 text-teal-500" />
              )}
              <span className="text-slate-300 truncate">{metric2}</span>
            </div>

            {/* Metric 2: EBITDA vs MRR */}
            <div className="bg-slate-800/50 p-2 rounded flex flex-col justify-center">
               <span className="text-[10px] text-slate-500 uppercase font-bold">
                 {isBroker ? "EBITDA" : "MRR"}
               </span>
               <span className="text-slate-200 font-mono font-medium">
                 {metric1}
               </span>
            </div>

          </div>
        </div>
      </div>
    </Link>
  );
}

// Default export for backward compatibility
export default ListingCard;
