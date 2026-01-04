import { getPublicEnvFlags, getServerEnvFlags } from "@/utils/env";

export default function DebugPage() {
  // Only show debug page in development
  if (process.env.NODE_ENV !== "development") {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Debug page disabled.</h1>
            <p className="text-slate-600">This page is only available in development mode.</p>
          </div>
        </div>
      </div>
    );
  }

  const publicFlags = getPublicEnvFlags();
  const serverFlags = getServerEnvFlags();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Environment Status</h1>
        <p className="text-slate-600 mb-8">Diagnostic page for environment variable configuration</p>

        {/* Public Environment Variables */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Public Environment Variables</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">NEXT_PUBLIC_SITE_URL</span>
              <span className={`text-sm font-semibold ${publicFlags.siteUrlPresent ? "text-green-600" : "text-red-600"}`}>
                {publicFlags.siteUrlPresent ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">NEXT_PUBLIC_SUPABASE_URL</span>
              <span className={`text-sm font-semibold ${publicFlags.supabaseUrlPresent ? "text-green-600" : "text-red-600"}`}>
                {publicFlags.supabaseUrlPresent ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span className={`text-sm font-semibold ${publicFlags.supabaseAnonKeyPresent ? "text-green-600" : "text-red-600"}`}>
                {publicFlags.supabaseAnonKeyPresent ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">NODE_ENV</span>
              <span className="text-sm font-semibold text-slate-700">
                <code className="bg-slate-50 px-2 py-1 rounded">{publicFlags.nodeEnv || "(undefined)"}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Server Environment Variables */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Server Environment Variables</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">SUPABASE_SERVICE_ROLE_KEY</span>
              <span className={`text-sm font-semibold ${serverFlags.serviceRoleKeyPresent ? "text-green-600" : "text-red-600"}`}>
                {serverFlags.serviceRoleKeyPresent ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">STRIPE_WEBHOOK_SECRET</span>
              <span className={`text-sm font-semibold ${serverFlags.stripeWebhookSecretPresent ? "text-green-600" : "text-red-600"}`}>
                {serverFlags.stripeWebhookSecretPresent ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">STRIPE_PRICE_PRO_BUYER</span>
              <span className={`text-sm font-semibold ${serverFlags.stripePriceProBuyerPresent ? "text-green-600" : "text-red-600"}`}>
                {serverFlags.stripePriceProBuyerPresent ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">STRIPE_PRICE_VERIFIED_SELLER</span>
              <span className={`text-sm font-semibold ${serverFlags.stripePriceVerifiedSellerPresent ? "text-green-600" : "text-red-600"}`}>
                {serverFlags.stripePriceVerifiedSellerPresent ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">STRIPE_PRICE_PARTNER_PRO</span>
              <span className={`text-sm font-semibold ${serverFlags.stripePricePartnerProPresent ? "text-green-600" : "text-red-600"}`}>
                {serverFlags.stripePricePartnerProPresent ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-700">NODE_ENV</span>
              <span className="text-sm font-semibold text-slate-700">
                <code className="bg-slate-50 px-2 py-1 rounded">{serverFlags.nodeEnv || "(undefined)"}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Fix Steps */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Fix Steps</h2>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <span className="font-semibold text-blue-900">1.</span>
              <div>
                <strong className="text-blue-900">Local Development (macOS):</strong>
                <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                  <li>Update <code className="bg-blue-100 px-1 rounded">.env.local</code> in your project root</li>
                  <li>Add all required environment variables (see above)</li>
                  <li>Restart the dev server: <code className="bg-blue-100 px-1 rounded">pnpm dev</code></li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-semibold text-blue-900">2.</span>
              <div>
                <strong className="text-blue-900">Vercel Deployment:</strong>
                <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                  <li>Go to your Vercel project settings</li>
                  <li>Navigate to <code className="bg-blue-100 px-1 rounded">Settings → Environment Variables</code></li>
                  <li>Set Project Environment Variables for Production, Preview, and Development</li>
                  <li>Redeploy your application</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
