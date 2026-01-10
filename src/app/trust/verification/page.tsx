import type { Metadata } from 'next';
import TrustHero from './components/TrustHero';
import VerificationLayers from './components/VerificationLayers';
import BadgeMeaning from './components/BadgeMeaning';
import WhatWeDontDo from './components/WhatWeDontDo';
import BuyerSellerBenefits from './components/BuyerSellerBenefits';

export const metadata: Metadata = {
  title: 'Trust & Verification Framework | NxtOwner',
  description:
    'Learn how NxtOwner verifies listings through data validation, AI review, and human oversight. Understand our badge system and verification process.',
};

export default function TrustVerificationPage() {
  return (
    <main className="bg-white min-h-screen">
      <TrustHero />
      <VerificationLayers />
      <BadgeMeaning />
      <WhatWeDontDo />
      <BuyerSellerBenefits />
    </main>
  );
}
