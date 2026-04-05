"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    headline: "Apply in 5 minutes",
    desc: "Fill out our short form — no lengthy paperwork, no W-2 required. Just your platform earnings and basic info.",
    svg: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <rect x="10" y="8" width="36" height="40" rx="4" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
        <path d="M18 20h20M18 28h14M18 36h8" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M42 34 C46 30, 50 34, 48 40 C46 44, 40 46, 36 42" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M36 42 L34 50 L42 46" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    headline: "We check earnings, not credit",
    desc: "We connect to your platform account to verify real income. Your credit score won't be pulled. We care about cash flow.",
    svg: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle cx="28" cy="28" r="20" stroke="#4ade80" strokeWidth="3" />
        <path d="M20 28 C22 22, 26 18, 28 18 C34 18, 38 22, 38 28" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M18 28 L38 28" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="4" stroke="#4ade80" strokeWidth="2.5" />
        <path d="M28 24 L28 14M28 32 L28 42" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "03",
    headline: "Cash to your account",
    desc: "Approved? Funds hit your bank in as little as 24-48 hours. Back to earning — no interruptions.",
    svg: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <rect x="8" y="16" width="40" height="28" rx="5" stroke="#4ade80" strokeWidth="3" />
        <circle cx="28" cy="30" r="7" stroke="#4ade80" strokeWidth="2.5" />
        <path d="M8 24h40" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 40 L44 32 L52 28" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M46 22 L50 18 L56 20" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const step0Ref = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  const stepRefs = [step0Ref, step1Ref, step2Ref];

  useEffect(() => {
    if (!sectionRef.current || !pinWrapRef.current) return;
    const ctx = gsap.context(() => {
      // Pin the section for a long scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: pinWrapRef.current,
        pinSpacing: true,
        anticipatePin: 1,
      });

      // Stagger steps in as scroll progresses
      STEPS.forEach((_, i) => {
        const el = stepRefs[i].current;
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 50 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${i * 60}% top`,
              end: `top+=${i * 60 + 40}% top`,
              scrub: 0.8,
            },
          }
        );
        if (i > 0) {
          gsap.fromTo(
            el,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -50,
              ease: "power2.in",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: `top+=${(i + 0.6) * 60}% top`,
                end: `top+=${(i + 0.6) * 60 + 30}% top`,
                scrub: 0.8,
              },
            }
          );
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "300vh" }}>
      <div
        ref={pinWrapRef}
        className="h-screen bg-[#1a1a1a] flex items-center overflow-hidden"
      >
        <div className="max-w-5xl mx-auto w-full px-6">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-[#15803d]/30 text-[#4ade80] text-[11px] font-semibold px-3 py-1.5 rounded-full mb-4 tracking-[0.04em] uppercase">
              How it works
            </div>
            <h2
              className="font-extrabold tracking-[-0.04em] leading-[0.95] text-white"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              Three steps to funded.
            </h2>
          </div>

          {/* Steps — stacked, animated via GSAP */}
          <div className="relative h-64">
            {STEPS.map((step, i) => (
              <div
                key={i}
                ref={stepRefs[i]}
                className="absolute inset-0 flex items-start gap-8"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {/* Number */}
                <div className="shrink-0">
                  <span
                    className="font-extrabold tracking-[-0.06em] text-[#333] leading-none select-none"
                    style={{ fontSize: "clamp(80px, 10vw, 120px)" }}
                  >
                    {step.num}
                  </span>
                </div>
                {/* Content */}
                <div className="pt-4">
                  <div className="mb-4">{step.svg}</div>
                  <h3
                    className="font-extrabold tracking-[-0.03em] text-white leading-tight mb-3"
                    style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
                  >
                    {step.headline}
                  </h3>
                  <p className="text-[#a1a1aa] text-[16px] leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-12">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#333]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
