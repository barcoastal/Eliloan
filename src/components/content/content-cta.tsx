import Link from "next/link";

export function ContentCta({ text, subtext }: { text?: string; subtext?: string }) {
  return (
    <section className="mt-12 bg-[#f0f5f0] rounded-[10px] p-8 text-center">
      <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#1a1a1a] mb-2">
        {text || "Ready to Get Funded?"}
      </h2>
      <p className="text-[14px] text-[#71717a] mb-4">
        {subtext || "Apply in 5 minutes. No credit checks. Get funded in hours."}
      </p>
      <Link
        href="/apply"
        className="inline-block bg-[#15803d] text-white text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-[#166534] transition-colors"
      >
        Apply Now
      </Link>
    </section>
  );
}
