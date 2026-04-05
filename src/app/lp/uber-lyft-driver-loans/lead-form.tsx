"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLATFORMS = ["Uber", "Lyft", "Both"] as const;
const AMOUNTS = [
  { value: 500, label: "$500" },
  { value: 1500, label: "$1,500" },
  { value: 3000, label: "$3,000" },
  { value: 5000, label: "$5,000" },
  { value: 7500, label: "$7,500" },
  { value: 10000, label: "$10,000" },
];

export function LandingLeadForm() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(3000);
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>("Uber");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Store lead data in sessionStorage so /apply can prefill
    const leadData = {
      loanAmount,
      platform,
      firstName,
      email,
      phone,
      source: "lp-uber-lyft",
    };
    try {
      sessionStorage.setItem("creditlime_lead", JSON.stringify(leadData));
    } catch {
      /* ignore storage failures */
    }

    // Redirect to application with UTM tracking + prefill params
    const params = new URLSearchParams({
      utm_source: "lp",
      utm_campaign: "uber-lyft",
      amount: String(loanAmount),
      platform,
      firstName,
      email,
      phone,
    });
    router.push(`/apply?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#e4e4e7] overflow-hidden">
      {/* Form header */}
      <div
        className="px-6 py-5 text-white"
        style={{
          background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bbf7d0]">
          Get started
        </p>
        <h3 className="text-[22px] font-extrabold tracking-[-0.02em] mt-1">
          See your loan amount
        </h3>
        <p className="text-[13px] text-[#bbf7d0] mt-1">
          No credit check. 5 minute application.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Loan amount */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-[#71717a] font-semibold block mb-2">
            How much do you need?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setLoanAmount(a.value)}
                className={`py-2.5 rounded-lg text-[13px] font-bold transition-colors ${
                  loanAmount === a.value
                    ? "bg-[#15803d] text-white"
                    : "bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7]"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-[#71717a] font-semibold block mb-2">
            Which platform do you drive for?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`py-2.5 rounded-lg text-[13px] font-bold transition-colors ${
                  platform === p
                    ? "bg-[#15803d] text-white"
                    : "bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* First name */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-[#71717a] font-semibold block mb-1.5">
            First name
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Marcus"
            className="w-full text-[14px] px-3.5 py-3 border border-[#e4e4e7] rounded-lg focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-[#71717a] font-semibold block mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full text-[14px] px-3.5 py-3 border border-[#e4e4e7] rounded-lg focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-[#71717a] font-semibold block mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full text-[14px] px-3.5 py-3 border border-[#e4e4e7] rounded-lg focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !firstName || !email || !phone}
          className="w-full bg-[#15803d] text-white font-extrabold text-[15px] py-4 rounded-xl hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-900/20"
        >
          {submitting ? "Submitting..." : "See My Loan Amount →"}
        </button>

        <p className="text-[11px] text-[#a1a1aa] text-center leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-[#15803d] hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-[#15803d] hover:underline">
            Privacy Policy
          </a>
          . No credit check. Applying will not affect your credit score.
        </p>
      </form>
    </div>
  );
}
