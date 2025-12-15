"use server";

// Placeholder action to fix build error
export async function createCheckoutSession(priceId: string) {
	console.log("Stripe checkout session requested for:", priceId);
	return { url: "#" }; // Returns a dummy URL so the site doesn't crash
}
// Stripe server action placeholder
// Add your Stripe-related server actions here, e.g. createCheckoutSession, handleWebhook, etc.