"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      } else {
        router.push("/admin/dashboard");
      }
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] p-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/20">
            <svg className="size-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-emerald-900">
            Elilons
          </h1>
          <p className="mt-1 text-sm text-emerald-800/50">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-emerald-900/8 bg-white p-8 shadow-xl shadow-emerald-900/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-emerald-900"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@elilons.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-emerald-900/10 bg-[#FAFAF7] px-4 py-2.5 text-[14px] text-emerald-900 placeholder:text-emerald-800/30 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-emerald-900"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-emerald-900/10 bg-[#FAFAF7] px-4 py-2.5 text-[14px] text-emerald-900 placeholder:text-emerald-800/30 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-600 px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:bg-emerald-600"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[12px] text-emerald-800/30">
          Elilons Loan Portal &middot; Secure Admin Access
        </p>
      </div>
    </div>
  );
}
