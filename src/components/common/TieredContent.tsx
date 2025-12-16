"use client";

import { Lock, Zap } from 'lucide-react';
import { UserAccessTier } from '@/app/actions/userAccess';

// Maps our simple keys to a numerical level for easy comparison
const ACCESS_LEVELS = {
    NO_AUTH: 0,
    FREE: 1,
    PRO: 2,
    ELITE: 3,
};

// Define the required tier for the content to be visible
type RequiredTier = 'FREE' | 'PRO' | 'ELITE';

interface TieredContentProps {
    // The current user's access tier
    userTier: UserAccessTier;
    // The minimum tier required to see the content
    requiredTier: RequiredTier;
    // The content to display if access is granted
    children: React.ReactNode;
    // Optional: Title for the upgrade prompt
    upgradeTitle?: string;
}

export function TieredContent({ userTier, requiredTier, children, upgradeTitle }: TieredContentProps) {
    const userLevel = ACCESS_LEVELS[userTier] || 0;
    const requiredLevel = ACCESS_LEVELS[requiredTier];
    
    const isVisible = userLevel >= requiredLevel;

    // 1. If content is visible, render children
    if (isVisible) {
        return <>{children}</>;
    }

    // 2. If user is not logged in, prompt them to log in
    if (userTier === 'NO_AUTH') {
         return (
            <div className="p-6 bg-gray-100 rounded-lg text-center border-dashed border-gray-300">
                <Lock size={20} className="mx-auto mb-2 text-gray-500"/>
                <p className="font-semibold text-gray-700">Log in to view this section</p>
                <button className="mt-2 text-sm text-blue-600 hover:underline">Log In / Sign Up</button>
            </div>
        );
    }

    // 3. Content is locked (user is logged in, but not high enough tier)
    // Determine the required plan name for the prompt
    let requiredPlanName = "Pro"; 
    let requiredUpgradeCost = "$49/month";
    if (requiredTier === 'ELITE') {
        requiredPlanName = "Elite";
        requiredUpgradeCost = "$99/month";
    }

    return (
        <div className="p-6 bg-gray-100 rounded-lg text-center border-dashed border-gray-300">
            <Zap size={20} className="mx-auto mb-2 text-orange-500"/>
            <p className="font-semibold text-gray-700">{upgradeTitle || `${requiredPlanName} Access Required`}</p>
            <p className="text-sm text-gray-500 mt-1">Upgrade to <strong>{requiredPlanName}</strong> ({requiredUpgradeCost}) to unlock this data.</p>
            <button className="mt-3 text-sm font-bold bg-[#F97316] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
                View Plans
            </button>
        </div>
    );
}
