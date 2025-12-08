"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard"); // we'll create this later
  }

  return (
    <main className="py-16 max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold text-nxt-primary mb-4">Sign In</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full px-4 py-2 rounded-md border border-gray-300"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full px-4 py-2 rounded-md border border-gray-300"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-nxt-primary text-white rounded-md font-semibold"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-nxt-primary underline">
          Join Free
        </a>
      </p>
    </main>
  );
}
