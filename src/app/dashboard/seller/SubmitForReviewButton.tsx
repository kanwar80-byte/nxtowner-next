"use client";

import { useState } from 'react';
import { submitListingForReview } from '@/app/actions/listings';
import { useRouter } from 'next/navigation';

interface SubmitForReviewButtonProps {
  listingId: string;
}

export function SubmitForReviewButton({ listingId }: SubmitForReviewButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitListingForReview(listingId);
    
    if (result.success) {
      router.refresh(); // Refresh server component data
    } else {
      alert(result.error || 'Failed to submit for review');
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="text-brand-orange hover:text-orange-600 font-medium disabled:opacity-50"
    >
      {isSubmitting ? 'Submitting...' : 'Submit for Review'}
    </button>
  );
}
