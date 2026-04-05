import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { LogoMark } from "@/components/brand/logo";
import { JsonLd, loanProductSchema, faqSchema } from "@/components/seo/json-ld";
import { LandingLeadForm } from "./lead-form";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Loans for Uber & Lyft Drivers | $100 - $10,000 | CreditLime",
  description:
    "Fast loans for rideshare drivers. $100 to $10,000. No credit check. Same-day decisions. Built for Uber and Lyft drivers. Apply in 5 minutes.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Loans for Uber & Lyft Drivers | CreditLime",
    description:
      "Fast loans for rideshare drivers. $100 - $10,000. No credit check. Same-day decisions.",
    type: "website",
  },
};

const FAQS = [
  {
    question: "Do I need a W-2 or pay stubs to qualify?",
    answer:
      "No. We built CreditLime specifically for Uber and Lyft drivers who don't have traditional W-2 income. Instead, we verify your earnings directly from your rideshare account.",
  },
  {
    question: "Will this hurt my credit score?",
    answer:
      "No. We don't pull your credit report. We look at your rideshare earnings, trip history, and account tenure. Your credit score won't be affected by applying.",
  },
  {
    question: "How fast can I get funded?",
    answer:
      "Most rideshare drivers get a decision within hours. Once approved, funds hit your bank account in as little as 24-48 hours.",
  },
  {
    question: "How much can I borrow as a rideshare driver?",
    answer:
      "Loan amounts range from $100 to $10,000. The exact amount depends on your weekly earnings, trip consistency, and how long you've been driving.",
  },
  {
    question: "Can I qualify if I drive for both Uber and Lyft?",
    answer:
      "Yes. We actually prefer multi-platform drivers because it shows consistent earnings. Connect both accounts when you apply for the highest loan amount.",
  },
];

const TRUST_STATS = [
  { value: "$2M+", label: "Funded to rideshare drivers" },
  { value: "1,200+", label: "Drivers approved" },
  { value: "48h", label: "Average funding time" },
  { value: "4.8★", label: "Driver rating" },
];

const TESTIMONIALS = [
  {
    quote:
      "Got approved in under 3 hours. My transmission went out and I needed cash fast to get back on the road. CreditLime understood that without the car, there's no income.",
    name: "Marcus T.",
    role: "Uber Driver · Atlanta, GA",
    amount: "$4,200",
  },
  {
    quote:
      "Every other lender wanted W-2s I don't have. CreditLime just looked at my Lyft earnings. Applied Monday, funded Wednesday. Simple.",
    name: "Sofia R.",
    role: "Lyft Driver · Phoenix, AZ",
    amount: "$3,500",
  },
  {
    quote:
      "Rent was due and my week had been slow. Got a $1,500 loan same day. Back to driving by Friday. Game changer.",
    name: "David K.",
    role: "Uber/Lyft Driver · Chicago, IL",
    amount: "$1,500",
  },
];

export default function UberLyftLandingPage() {
  return (
    <div className="min-h-screen bg-[#faf8f0]">
      <JsonLd data={loanProductSchema()} />
      <JsonLd data={faqSchema(FAQS)} />

      {/* Minimal header - no nav distractions */}
      <header className="bg-white border-b border-[#e4e4e7]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <LogoMark size={28} />
            <span className="font-extrabold text-[15px] tracking-[-0.03em]">
              Credit<span className="text-[#15803d]">Lime</span>
            </span>
          </div>
          <a href="tel:+18005551234" className="text-[13px] font-medium text-[#71717a] hover:text-[#1a1a1a]">
            <span className="hidden sm:inline">Questions? </span>Call 1-800-555-1234
          </a>
        </div>
      </header>

      {/* Hero + Form */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#f0f5f0] opacity-60 blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-8%] w-[400px] h-[400px] rounded-full bg-[#d1fae5] opacity-30 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#15803d] text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5 tracking-[0.04em] uppercase">
                <span className="w-1.5 h-1.5 bg-[#15803d] rounded-full" />
                Built for Uber &amp; Lyft drivers
              </div>

              <h1
                className="font-extrabold tracking-[-0.04em] leading-[0.95] text-[#1a1a1a] mb-5"
                style={{ fontSize: "clamp(42px, 6.5vw, 84px)" }}
              >
                Loans for
                <br />
                <span className="text-[#15803d]">rideshare</span> drivers.
              </h1>

              <p className="text-[#71717a] text-[18px] leading-relaxed max-w-xl mb-6">
                $100 to $10,000. No credit check. Same-day decisions. We verify
                your Uber and Lyft earnings, not your credit score.
              </p>

              {/* Trust row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-[14px] text-[#1a1a1a]">
                {[
                  "No credit check",
                  "48-hour funding",
                  "No W-2 required",
                  "5 min application",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="#15803d" />
                      <path
                        d="M4 8.5L6.5 11L12 5.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>

              {/* Trust stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#e4e4e7]">
                {TRUST_STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[24px] font-extrabold tracking-[-0.02em] text-[#1a1a1a]">
                      {stat.value}
                    </p>
                    <p className="text-[12px] text-[#71717a] leading-tight mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Lead form */}
            <div className="lg:sticky lg:top-8">
              <LandingLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="font-extrabold tracking-[-0.03em] leading-tight text-[#1a1a1a] mb-4"
              style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
            >
              Three steps. No paperwork.
            </h2>
            <p className="text-[#71717a] text-[16px] max-w-xl mx-auto">
              We designed the whole process for drivers on the road. Works on
              your phone between trips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Apply in 5 minutes",
                desc: "Tell us your loan amount and basic info. No lengthy forms, no document uploads required upfront.",
                img: "/illustrations/step-1-apply.png",
              },
              {
                num: "02",
                title: "Connect your driving account",
                desc: "We verify your Uber or Lyft earnings directly. Read-only, secure, no credit pull.",
                img: "/illustrations/step-2-approved.png",
              },
              {
                num: "03",
                title: "Cash in your account",
                desc: "Approved loans fund in as little as 24-48 hours. Back on the road, no interruptions.",
                img: "/illustrations/step-3-funded.png",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-[#faf8f0] rounded-2xl p-6 border border-transparent hover:border-[#15803d]/20 transition-colors"
              >
                <div className="w-14 h-14 mb-4 relative">
                  <Image
                    src={step.img}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="56px"
                  />
                </div>
                <p className="text-[11px] font-semibold text-[#15803d] tracking-[0.1em] mb-2">
                  STEP {step.num}
                </p>
                <h3 className="text-[19px] font-extrabold tracking-[-0.02em] text-[#1a1a1a] mb-2">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#71717a] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f0f5f0] py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="font-extrabold tracking-[-0.03em] leading-tight text-[#1a1a1a]"
              style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
            >
              Drivers we&apos;ve funded.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e4e7]"
              >
                <div className="flex items-center gap-1 text-[#eab308] mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M7 0l2 4.5 5 0.5-3.5 3.5 1 5-4.5-2.5-4.5 2.5 1-5L0 5l5-0.5z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[14px] text-[#1a1a1a] leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#f4f4f5]">
                  <div>
                    <p className="text-[13px] font-bold text-[#1a1a1a]">{t.name}</p>
                    <p className="text-[11px] text-[#71717a]">{t.role}</p>
                  </div>
                  <span className="text-[13px] font-extrabold text-[#15803d]">
                    {t.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-extrabold tracking-[-0.03em] leading-tight text-[#1a1a1a] mb-10 text-center"
            style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
          >
            Rideshare driver questions.
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-[#faf8f0] rounded-xl border border-[#e4e4e7] overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                  <span className="text-[15px] font-bold text-[#1a1a1a]">
                    {faq.question}
                  </span>
                  <span className="text-[#15803d] text-[20px] group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-[14px] text-[#71717a] leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-16 md:py-24 px-4"
        style={{
          background: "linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-extrabold tracking-[-0.04em] leading-[0.95] text-white mb-5"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Ready to hit the road
            <br />
            fully funded?
          </h2>
          <p className="text-[#bbf7d0] text-[17px] mb-8 max-w-xl mx-auto">
            Join 1,200+ Uber and Lyft drivers who got the cash they needed. No
            credit check. Decisions in hours.
          </p>
          <Link
            href="/apply?utm_source=lp&amp;utm_campaign=uber-lyft"
            className="inline-flex items-center gap-2 bg-white text-[#15803d] font-extrabold text-[17px] px-10 py-5 rounded-2xl hover:bg-[#f0fdf4] transition-colors shadow-2xl"
          >
            Apply for Your Loan
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4 9h10M10 5l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <p className="mt-6 text-[#86efac] text-[13px]">
            No credit check · 5 minute application · Funded in 48 hours
          </p>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-[#1a1a1a] text-[#a1a1aa] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 text-white text-[13px] font-extrabold">
            <LogoMark size={22} />
            Credit<span className="text-[#4ade80]">Lime</span>
          </div>
          <p className="text-[11px] text-[#71717a] text-center md:text-right max-w-xl">
            APR range 30-60%. Loan amounts $100-$10,000. Terms 3-18 months. Loan
            approval subject to eligibility.{" "}
            <Link href="/disclosures" className="underline hover:text-white">
              See full disclosures
            </Link>
            {" · "}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy
            </Link>
            {" · "}
            <Link href="/terms" className="underline hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
