"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const role = (formData.get('role') as string) || "buyer";

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <main className="bg-brand-bg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 space-y-6">
        <h1 className="text-2xl font-bold text-brand-text mb-6">
          Join NxtOwner
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-muted mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-muted mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-muted">Choose your role</label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="buyer" defaultChecked className="h-4 w-4 text-brand-navy focus:ring-brand-navy" />
                <span className="text-sm text-brand-text">Buyer - I&apos;m looking to purchase a business</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="seller" className="h-4 w-4 text-brand-navy focus:ring-brand-navy" />
                <span className="text-sm text-brand-text">Seller - I&apos;m selling my business</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="both" className="h-4 w-4 text-brand-navy focus:ring-brand-navy" />
                <span className="text-sm text-brand-text">Both - I&apos;m buying and selling</span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
          {success && <p className="text-sm text-brand-green bg-green-50 px-3 py-2 rounded-md">Account created! Redirecting to login...</p>}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating account..." : success ? "Success!" : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
