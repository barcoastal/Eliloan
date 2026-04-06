import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";

export function ContentCta({ text, subtext, variant = "default" }: { text?: string; subtext?: string; variant?: "default" | "inline" | "banner" }) {
  if (variant === "inline") {
    return (
      <div className="my-10 bg-gradient-to-r from-[#15803d] to-[#166534] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 text-white">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <LogoMark size={24} />
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#bbf7d0]">PennyLime</span>
          </div>
          <p className="text-[18px] font-extrabold tracking-[-0.02em] mb-1">
            {text || "Need cash between gigs?"}
          </p>
          <p className="text-[14px] text-[#bbf7d0]">
            {subtext || "$100 - $10,000. No credit check. Funded in 48 hours."}
          </p>
        </div>
        <Link
          href="/apply"
          className="shrink-0 bg-white text-[#15803d] font-bold text-[14px] px-6 py-3.5 rounded-xl hover:bg-[#f0fdf4] transition-colors shadow-lg"
        >
          Apply Now
        </Link>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="my-10 border-2 border-[#15803d] rounded-2xl p-6 md:p-8 bg-[#f0fdf4] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#15803d]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <LogoMark size={20} />
            <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#15803d]">Quick Tip</span>
          </div>
          <p className="text-[16px] font-bold text-black mb-2">
            {text || "Did you know?"}
          </p>
          <p className="text-[14px] text-[#52525b] leading-relaxed mb-4">
            {subtext || "PennyLime doesn't check your credit score. We verify your gig platform earnings directly, so a low credit score won't hold you back."}
          </p>
          <Link href="/apply" className="text-[14px] font-bold text-[#15803d] hover:underline">
            Check your eligibility &rarr;
          </Link>
        </div>
      </div>
    );
  }

  // default — end-of-article CTA
  return (
    <section className="mt-14 bg-gradient-to-br from-[#15803d] to-[#14532d] rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[200px] h-[200px] rounded-full bg-[#4ade80]/10 blur-3xl" />
      </div>
      <div className="relative z-10">
        <LogoMark size={36} className="mx-auto mb-4" />
        <h2 className="text-[28px] font-extrabold tracking-[-0.03em] mb-3">
          {text || "Ready to Get Funded?"}
        </h2>
        <p className="text-[16px] text-[#bbf7d0] mb-6 max-w-md mx-auto">
          {subtext || "Join 1,200+ gig workers who got the cash they needed. No credit check. Apply in 5 minutes."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/apply"
            className="bg-white text-[#15803d] font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-[#f0fdf4] transition-colors shadow-xl"
          >
            Start My Application
          </Link>
          <Link
            href="/tools/loan-calculator"
            className="text-[#bbf7d0] font-medium text-[14px] hover:text-white transition-colors"
          >
            Calculate my payment &rarr;
          </Link>
        </div>
        <div className="flex justify-center gap-6 mt-6 text-[12px] text-[#86efac]">
          <span>No credit check</span>
          <span>48h funding</span>
          <span>$100 - $10K</span>
        </div>
      </div>
    </section>
  );
}
