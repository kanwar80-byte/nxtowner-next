// src/lib/automation/eventHandler.ts

import { aiProcessListing } from "@/app/actions/aiProcessListing"; 

// Define common events that drive automation
export type PlatformEvent = 
    | { type: 'LISTING_CREATED_OR_UPDATED'; listingId: string; userId: string }
    | { type: 'NDA_SIGNED'; listingId: string; buyerId: string; sellerId: string }
    | { type: 'INACTIVE_LISTING'; listingId: string; sellerId: string }
    | { type: 'PRICE_CHANGE_REQUESTED'; listingId: string; sellerId: string; newPrice: number }
    | { type: 'BUYER_MESSAGE'; listingId: string; buyerId: string; sellerId: string };

/**
 * Central system handler for all platform events.
 * This executes the logic defined in the Automation Infrastructure plan.
 */
export async function handleEvent(event: PlatformEvent) {
    console.log(`[EVENT HANDLER] Received event: ${event.type}`);

    switch (event.type) {
        
        // --- 1. AI Pillar Automation (Listing Intelligence) ---
        case 'LISTING_CREATED_OR_UPDATED':
            // Listing publish -> AI verification -> badge assignment
            console.log(`Triggering AI verification for listing ${event.listingId}...`);
            await aiProcessListing(event.listingId);
            // In a real app, you would also trigger email notification to seller if listing is ready.
            break;
            
        // --- 2. Deal Friction Automation ---
        case 'NDA_SIGNED':
            // NDA signed -> deal room unlocked -> seller notified
            console.log(`NDA signed by buyer ${event.buyerId} for listing ${event.listingId}.`);
            // MOCK: In production, this would:
            // 1. Update the 'deal_room_access' table for the buyer.
            // 2. Send an email notification to the seller.
            break;
            
        case 'BUYER_MESSAGE':
            // Buyer message -> seller alert -> response SLA tracking
            console.log(`New message for listing ${event.listingId}. Starting response SLA timer.`);
            // MOCK: In production, this would:
            // 1. Send an immediate push/email notification to the seller.
            // 2. Log the message timestamp to track response time metrics.
            break;

        // --- 3. Growth & Nudge Automation ---
        case 'INACTIVE_LISTING':
            // Inactive listing -> nudge seller -> suggest price update
            console.log(`Inactive listing ${event.listingId} detected. Sending nudge to seller ${event.sellerId}.`);
            // MOCK: In production, this would:
            // 1. Send an email with analytics summary and a link to the AI Pricing Suggestion (if Seller Premium).
            break;
            
        case 'PRICE_CHANGE_REQUESTED':
            // High-view / low-inquiry listing -> AI pricing suggestion
            console.log(`Seller ${event.sellerId} requested a price change for ${event.listingId}.`);
            // MOCK: In production, this would:
            // 1. Re-run AI Pillar 2 to validate/suggest the new price against market data.
            // 2. Log the change for future analytics.
            break;

        default:
            console.warn(`[EVENT HANDLER] Unknown event type: ${event.type}`);
    }
}
