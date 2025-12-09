'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import {
  PLAN_NAMES,
  PLAN_DESCRIPTIONS,
  PLAN_PRICING,
  PLAN_FEATURES,
} from '@/lib/stripe';

interface PricingCardProps {
  plan: string;
  isPopular?: boolean;
  onSelectPlan: (plan: string) => void;
  isLoading?: boolean;
}

function PricingCard({
  plan,
  isPopular,
  onSelectPlan,
  isLoading,
}: PricingCardProps) {
  const pricing = PLAN_PRICING[plan];
  const monthlyPrice = pricing / 100;

  return (
    <div
      className={`flex flex-col rounded-lg border ${
        isPopular
          ? 'border-blue-500 bg-blue-50/50 shadow-lg'
          : 'border-gray-200 bg-white'
      } p-8 transition-all hover:shadow-md`}
    >
      {isPopular && (
        <div className="mb-4 inline-flex w-fit rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
          Most Popular
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900">{PLAN_NAMES[plan]}</h3>
      <p className="mt-2 text-sm text-gray-600">
        {PLAN_DESCRIPTIONS[plan]}
      </p>

      <div className="my-6">
        {pricing > 0 ? (
          <>
            <span className="text-4xl font-bold text-gray-900">
              ${monthlyPrice.toFixed(0)}
            </span>
            <span className="ml-2 text-gray-600">/month</span>
          </>
        ) : (
          <span className="text-4xl font-bold text-gray-900">Free</span>
        )}
      </div>

      <button
        onClick={() => onSelectPlan(plan)}
        disabled={isLoading || plan === 'free'}
        className={`mb-8 w-full rounded-lg px-4 py-2 font-medium transition-colors ${
          plan === 'free'
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isPopular
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        } ${isLoading ? 'opacity-50' : ''}`}
      >
        {isLoading ? 'Processing...' : plan === 'free' ? 'Current Plan' : 'Upgrade'}
      </button>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-900">Features:</p>
        <ul className="space-y-3">
          {PLAN_FEATURES[plan].map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type User = {
  id: string;
  email?: string;
};

function PricingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');

  // Show success/cancel messages
  useEffect(() => {
    const success = searchParams.get('success');
    const cancelled = searchParams.get('cancelled');

    if (success) {
      setMessage('✓ Subscription successful! Your plan has been activated.');
      setTimeout(() => setMessage(''), 5000);
    } else if (cancelled) {
      setMessage('Checkout cancelled.');
      setTimeout(() => setMessage(''), 5000);
    }
  }, [searchParams]);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleSelectPlan = async (plan: string) => {
    // Free plan needs no checkout
    if (plan === 'free') {
      return;
    }

    // Require login for paid plans
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
        return;
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setMessage('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-12 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-gray-900">Pricing Plans</h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan for your business. Upgrade or downgrade anytime.
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="border-b border-green-200 bg-green-50 px-6 py-4 sm:px-12">
          <p className="text-green-800">{message}</p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Free Plan */}
            <PricingCard
              plan="free"
              onSelectPlan={handleSelectPlan}
              isLoading={loading}
            />

            {/* Pro Buyer Plan */}
            <PricingCard
              plan="pro_buyer"
              isPopular={true}
              onSelectPlan={handleSelectPlan}
              isLoading={loading}
            />

            {/* Pro Seller Plan */}
            <PricingCard
              plan="verified_seller"
              onSelectPlan={handleSelectPlan}
              isLoading={loading}
            />

            {/* Partner Pro Plan */}
            <PricingCard
              plan="partner_pro"
              onSelectPlan={handleSelectPlan}
              isLoading={loading}
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-gray-200 bg-white px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I change my plan anytime?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Is there a contract?
              </h3>
              <p className="mt-2 text-gray-600">
                No contracts. You can cancel your subscription anytime from your
                dashboard.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Do you offer refunds?
              </h3>
              <p className="mt-2 text-gray-600">
                We offer a 7-day money-back guarantee if you&apos;re not satisfied. Contact
                support for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards through Stripe. Your payment
                information is secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to get started?
          </h2>
          <p className="mt-4 text-gray-600">
            Join hundreds of businesses using NxtOwner to scale their operations.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-lg bg-blue-500 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-600"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-gray-300 bg-white px-8 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-gray-200 bg-white px-6 py-8 sm:px-12">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-600">
          <p>
            Secure payment processing powered by{' '}
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-500 hover:text-blue-600"
            >
              Stripe
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PricingPageContent />
    </Suspense>
  );
}
