'use client';

import { useState } from 'react';
import { createListingLead } from '@/app/actions/leads';

interface ListingInterestModalProps {
  listingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ListingInterestModal({
  listingId,
  isOpen,
  onClose,
}: ListingInterestModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createListingLead(listingId, message || undefined);

    if (result.success) {
      setSuccess(true);
      setMessage('');
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } else {
      setError(result.error || 'Failed to register interest');
    }

    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Express Your Interest</h2>
          <p className="text-sm text-gray-600 mt-1">
            Let the seller know you&apos;re interested in this listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              ✓ Interest registered! The seller will be notified.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the seller a bit about your interest..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Register Interest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
