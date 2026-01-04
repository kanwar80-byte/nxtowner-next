import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"; 
import { MapPin, Server, Building2, User } from "lucide-react";

interface ListingCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  dealType: "operational" | "digital";
  metric1: string; // EBITDA or MRR
  metric2: string; // Location or Tech Stack
  sourceName?: string;
  aiScore?: number; // <--- NEW PROP
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
  aiScore, // <--- Destructure it
}: ListingCardProps) {
  
  const isBroker = dealType === "operational";

  return (
    <Link href={`/listing/${id}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-slate-600 hover:shadow-2xl flex flex-col">
        
        {/* IMAGE */}
        <div className="relative h-48 w-full shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* LEFT: SOURCE BADGE */}
          <div className="absolute top-3 left-3">
            {isBroker ? (
              <Badge className="bg-amber-600/90 backdrop-blur-sm text-white border-none px-2 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                <Building2 className="w-3 h-3 mr-1 inline" /> Broker Listed
              </Badge>
            ) : (
              <Badge className="bg-teal-600/90 backdrop-blur-sm text-white border-none px-2 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                <User className="w-3 h-3 mr-1 inline" /> Founder Direct
              </Badge>
            )}
          </div>

          {/* RIGHT: V17 AI SCORE BADGE */}
          {aiScore && (
            <div className="absolute top-3 right-3 animate-in fade-in zoom-in duration-500">
               <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full shadow-lg">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${aiScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                 <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                   AI Score: {aiScore}
                 </span>
               </div>
            </div>
          )}

          {/* PRICE TAG */}
          <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 shadow-lg">
            <span className="text-white font-bold text-sm tracking-tight">{price}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-white mb-1 leading-snug group-hover:text-amber-500 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-xs text-slate-400 mb-4 flex items-center">
            Listed by: <span className="text-slate-200 ml-1 font-medium">{sourceName}</span>
          </p>

          <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
            {/* Metric 1 (Location/Tech) */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-2 rounded flex items-center gap-2">
              {isBroker ? <MapPin className="w-4 h-4 text-amber-500" /> : <Server className="w-4 h-4 text-teal-500" />}
              <span className="text-slate-300 text-xs truncate font-medium">{metric2}</span>
            </div>

            {/* Metric 2 (EBITDA/MRR) */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-2 rounded flex flex-col justify-center px-3">
               <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                 {isBroker ? "EBITDA" : "MRR"}
               </span>
               <span className="text-slate-200 font-mono text-xs font-bold">
                 {metric1}
               </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
