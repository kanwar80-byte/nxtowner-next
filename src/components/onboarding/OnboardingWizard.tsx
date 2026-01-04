'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveOnboarding } from '@/app/actions/onboarding';
import { CheckCircle, Circle } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';

type Track = 'all' | 'operational' | 'digital';

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Step 1: Role + Track
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [preferredTrack, setPreferredTrack] = useState<Track>('all');

  // Step 2: Profile
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Load initial data from user metadata
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.user_metadata) {
          const meta = user.user_metadata;
          if (meta.intended_roles && Array.isArray(meta.intended_roles)) {
            setSelectedRoles(meta.intended_roles);
          } else if (meta.intended_role) {
            setSelectedRoles([meta.intended_role]);
          }
          if (meta.preferred_track) {
            setPreferredTrack(meta.preferred_track);
          }
        }
      } catch (err) {
        console.warn('Could not load initial data:', err);
      } finally {
        setInitializing(false);
      }
    };

    loadInitialData();
  }, []);

  const handleRoleToggle = (role: string) => {
    if (role === 'both') {
      if (selectedRoles.includes('buyer') && selectedRoles.includes('seller')) {
        setSelectedRoles(selectedRoles.filter(r => r !== 'buyer' && r !== 'seller'));
      } else {
        const newRoles = [...selectedRoles.filter(r => r !== 'buyer' && r !== 'seller'), 'buyer', 'seller'];
        setSelectedRoles(newRoles);
      }
    } else {
      if (selectedRoles.includes(role)) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      } else {
        setSelectedRoles([...selectedRoles, role]);
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (selectedRoles.length === 0) {
        setError('Please select at least one role');
        return;
      }
      setStep(2);
      setError(null);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await saveOnboarding({
        roles: selectedRoles,
        preferred_track: preferredTrack,
        full_name: fullName.trim(),
        company_name: companyName.trim() || undefined,
      });

      if (result.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(result.error || 'Failed to save onboarding data');
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
        <p className="text-slate-600">Just a few quick steps to get started</p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center">
            {step > s ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : step === s ? (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {s}
              </div>
            ) : (
              <Circle className="w-8 h-8 text-slate-300" />
            )}
            {s < 2 && (
              <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-green-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Role + Track */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Confirm your role and preferences</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
              <div className="space-y-2">
                {['buyer', 'seller', 'partner', 'both'].map((role) => {
                  const isSelected = role === 'both' 
                    ? selectedRoles.includes('buyer') && selectedRoles.includes('seller')
                    : selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleToggle(role)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {role === 'both' ? 'Buyer + Seller' : role.charAt(0).toUpperCase() + role.slice(1)}
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Track</label>
              <div className="space-y-2">
                {(['all', 'operational', 'digital'] as Track[]).map((track) => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setPreferredTrack(track)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      preferredTrack === track
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {track === 'all' ? 'Both Operational & Digital' :
                           track === 'operational' ? 'Operational Assets' :
                           'Digital Assets'}
                        </div>
                      </div>
                      {preferredTrack === track && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Profile */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Tell us about yourself</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Acme Corp"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="px-6 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {step < 2 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        )}
      </div>
    </div>
  );
}
