"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeNdaAndCreateDealRoom } from "./actions";

interface NDAPageProps {
  params: {
    listingId: string;
  };
}

export default function NDAPage({ params }: NDAPageProps) {
  const [listingId] = useState<string>(params.listingId);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSign = async () => {
    if (!agreed) {
      alert("Please agree to the NDA terms before proceeding.");
      return;
    }

    setIsLoading(true);

    // Fetch buyer/user id from Supabase auth
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      alert("You must be logged in to sign the NDA.");
      setIsLoading(false);
      return;
    }

    try {
      const { roomId } = await completeNdaAndCreateDealRoom({
        listingId,
        buyerId: userData.user.id,
        signedPdfUrl,
        initialMessage: "NDA signed. Looking forward to the discussion.",
      });

      router.push(`/deal-room/${roomId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create deal room. Please try again.");
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-brand-text">
                NxtSign NDA Agreement
              </h1>
              <p className="text-brand-muted">
                Listing ID: <span className="font-mono text-brand-text">{listingId || "Loading..."}</span>
              </p>
            </div>

            <div className="border border-brand-border rounded-lg p-6 bg-gray-50 space-y-4 max-h-96 overflow-y-auto">
              <h2 className="font-semibold text-brand-text">
                Non-Disclosure Agreement
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                This Non-Disclosure Agreement (the &quot;Agreement&quot;) is entered into by and between the disclosing party 
                (the &quot;Seller&quot;) and the receiving party (the &quot;Buyer&quot;) for the purpose of preventing the unauthorized 
                disclosure of Confidential Information as defined below.
              </p>
              <h3 className="font-semibold text-brand-text text-sm">1. Definition of Confidential Information</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                &quot;Confidential Information&quot; means any written, electronic, or oral information disclosed by the Seller 
                to the Buyer, including but not limited to business operations, financial statements, customer lists, 
                proprietary processes, and trade secrets related to the business listing.
              </p>
              <h3 className="font-semibold text-brand-text text-sm">2. Obligations of Receiving Party</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                The Buyer agrees to: (a) hold and maintain the Confidential Information in strict confidence; 
                (b) not disclose the Confidential Information to any third parties without prior written consent; 
                (c) use the Confidential Information solely for the purpose of evaluating the potential purchase of the business.
              </p>
              <h3 className="font-semibold text-brand-text text-sm">3. Term</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                This Agreement shall remain in effect for a period of two (2) years from the date of signing, 
                or until the Confidential Information no longer qualifies as confidential, whichever occurs first.
              </p>
              <p className="text-xs text-brand-muted italic mt-4">
                [This is a simplified preview. Full legal NDA terms will be provided upon signing.]
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 border border-brand-border rounded-lg bg-gray-50">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 text-brand-navy focus:ring-brand-navy border-brand-border rounded"
              />
              <label htmlFor="agree" className="text-sm text-brand-text cursor-pointer">
                I have read and agree to the terms of this Non-Disclosure Agreement. I understand that signing this 
                NDA is required to access confidential business information and enter the deal room.
              </label>
            </div>

            <button
              onClick={handleSign}
              disabled={!agreed || isLoading}
              className="w-full px-6 py-3 bg-brand-orange text-white rounded-md font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? "Processing..." : "Sign & Go to Deal Room"}
            </button>

            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-text" htmlFor="signedPdfUrl">
                Signed NDA PDF URL (server-generated)
              </label>
              <input
                id="signedPdfUrl"
                type="url"
                placeholder="https://.../signed-nda.pdf"
                value={signedPdfUrl}
                onChange={(e) => setSignedPdfUrl(e.target.value)}
                className="w-full rounded-md border border-brand-border px-3 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <p className="text-xs text-brand-muted">
                Provide the generated signed NDA file URL from your upload step. This value is sent to the server action to create the deal room.
              </p>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Backend integration pending — DO NOT MODIFY EXISTING UI STRUCTURE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
