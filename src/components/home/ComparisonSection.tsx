import { AlertCircle, Check, ShieldCheck, X } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Stop Guessing. Start Closing.</h2>
           <p className="text-slate-500 max-w-2xl mx-auto text-lg">
             Why serious buyers and sellers choose NxtOwner over traditional listing sites.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
           
           {/* LEFT: THE OLD WAY (Other Marketplaces) */}
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-red-200 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-red-400 transition-colors"></div>
              
              <h3 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-2 group-hover:text-red-500 transition-colors">
                 <AlertCircle size={20} /> Other Marketplaces
              </h3>
              
              <ul className="space-y-5">
                 <li className="flex items-start gap-3 text-slate-500">
                    <X className="text-red-400 shrink-0 mt-0.5" size={20} /> 
                    <span>Unverified, user-generated claims</span>
                 </li>
                 <li className="flex items-start gap-3 text-slate-500">
                    <X className="text-red-400 shrink-0 mt-0.5" size={20} /> 
                    <span>Static PDF attachments (outdated)</span>
                 </li>
                 <li className="flex items-start gap-3 text-slate-500">
                    <X className="text-red-400 shrink-0 mt-0.5" size={20} /> 
                    <span>Slow, manual email chains</span>
                 </li>
                 <li className="flex items-start gap-3 text-slate-500">
                    <X className="text-red-400 shrink-0 mt-0.5" size={20} /> 
                    <span>No buyer/seller verification</span>
                 </li>
              </ul>
           </div>

           {/* RIGHT: THE NXTOWNER STANDARD */}
           <div className="bg-[#0f172a] p-10 rounded-2xl shadow-2xl relative overflow-hidden transform md:scale-105 border border-slate-700 z-10">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">
                 THE NEW STANDARD
              </div>

              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                 The NxtOwner Standard <ShieldCheck className="text-blue-400" size={24} />
              </h3>

              <ul className="space-y-5">
                 <li className="flex items-start gap-3 text-white/90">
                    <div className="bg-blue-500/20 p-1 rounded-full text-blue-400">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="font-medium">AI-Normalized Financials (P&L Verified)</span>
                 </li>
                 <li className="flex items-start gap-3 text-white/90">
                    <div className="bg-blue-500/20 p-1 rounded-full text-blue-400">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="font-medium">KYC-Verified Sellers & Buyers</span>
                 </li>
                 <li className="flex items-start gap-3 text-white/90">
                    <div className="bg-blue-500/20 p-1 rounded-full text-blue-400">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="font-medium">Integrated Data Rooms with Auto-NDA</span>
                 </li>
                 <li className="flex items-start gap-3 text-white/90">
                    <div className="bg-blue-500/20 p-1 rounded-full text-blue-400">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="font-medium">Bank-Grade Data Security</span>
                 </li>
              </ul>
           </div>

        </div>
      </div>
    </section>
  );
}
