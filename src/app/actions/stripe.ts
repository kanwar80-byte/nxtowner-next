"use server";

export async function createCheckoutSession(priceId: string) {
  console.log("Stripe placeholder called with:", priceId);
  return { url: "/" };
}