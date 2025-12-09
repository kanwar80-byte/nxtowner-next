/**
 * PlanStatus component - displays user's current subscription plan
 */

import Link from 'next/link';
import { PLAN_NAMES, PLAN_PRICING } from '@/lib/stripe';

interface PlanStatusProps {
  plan: string;
  planRenewsAt?: string | null;
}

export function PlanStatus({ plan, planRenewsAt }: PlanStatusProps) {
  const monthlyPrice = PLAN_PRICING[plan] / 100;
  const renewDate = planRenewsAt ? new Date(planRenewsAt) : null;

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro_buyer':
        return 'blue';
      case 'verified_seller':
        return 'green';
      case 'partner_pro':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const color = getPlanColor(plan);
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    green: 'bg-green-50 text-green-900 border-green-200',
    purple: 'bg-purple-50 text-purple-900 border-purple-200',
    gray: 'bg-gray-50 text-gray-900 border-gray-200',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">Current Plan</p>
          <h3 className="mt-1 text-lg font-semibold">{PLAN_NAMES[plan]}</h3>
          {monthlyPrice > 0 && (
            <p className="mt-1 text-sm">
              ${monthlyPrice.toFixed(0)}/month
            </p>
          )}
          {renewDate && (
            <p className="mt-1 text-xs opacity-75">
              Renews {renewDate.toLocaleDateString()}
            </p>
          )}
        </div>
        {plan !== 'free' && (
          <Link
            href="/pricing"
            className="text-sm font-medium underline hover:no-underline"
          >
            Manage
          </Link>
        )}
        {plan === 'free' && (
          <Link
            href="/pricing"
            className="text-sm font-medium underline hover:no-underline"
          >
            Upgrade
          </Link>
        )}
      </div>
    </div>
  );
}
