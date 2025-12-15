import React from 'react';
import StripeButton from '@/components/ui/StripeButton';
import { ShieldCheck } from 'lucide-react';

export default function TestPaymentPage() {
  // Grab the Price ID you put in .env.local
  const priceId = process.env.NEXT_PUBLIC_PRICE_ID_VERIFIED;

  if (!priceId) {
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        ERROR: NEXT_PUBLIC_PRICE_ID_VERIFIED is missing from .env.local
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#0a192f] p-8 text-center">
          <div className="inline-flex bg-green-500/20 p-3 rounded-full mb-4">
            <ShieldCheck className="text-green-400 w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verified Listing</h1>
          <p className="text-gray-400 mt-2">Test Transaction</p>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-4xl font-bold text-[#0a192f]">$100<span className="text-lg text-gray-400 font-normal">.00</span></span>
          </div>
          
          <ul className="space-y-3 mb-8 text-sm text-gray-600">
             <li className="flex gap-2">✅ Verified Badge on Homepage</li>
             <li className="flex gap-2">✅ Top of Search Results</li>
             <li className="flex gap-2">✅ Instant Trust Signal</li>
          </ul>

          {/* THE BUY BUTTON */}
          <StripeButton priceId={priceId} label="Pay & Upgrade" listingId={999} />
          
          <p className="text-xs text-center text-gray-400 mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
