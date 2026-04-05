"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PAIN_POINTS = [
  {
    title: "Rent is due tomorrow",
    desc: "Platform payouts running late? We fund in hours, not weeks. Cover rent before the late fees hit.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 12 L14 4 L24 12 V23 A1 1 0 0 1 23 24 H5 A1 1 0 0 1 4 23 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 24 V16 H17 V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Car payment behind",
    desc: "Your car is your income. Don't risk repossession. Catch up on auto loans fast without touching your credit.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 18 V13 L6 8 H22 L24 13 V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 18 H24 V21 H20 V19 H8 V21 H4 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="8" cy="20" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Surprise car repair",
    desc: "Flat tire, dead battery, blown transmission. We know: no car, no earnings. Get funded same-day for repairs.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M18 6 L22 10 L15 17 L11 13 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 13 L5 19 L9 23 L15 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Slow week on the app",
    desc: "Platform demand dropped? Bad weather? Peak-season slump? Bridge the gap until earnings pick back up.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 20 L10 14 L14 18 L24 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 8 H24 V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Medical bill came in",
    desc: "ER visit, dental emergency, prescription. Healthcare can't wait. Get funds fast so you can focus on healing.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4 C 10 4, 4 8, 4 14 C 4 20, 14 26, 14 26 C 14 26, 24 20, 24 14 C 24 8, 18 4, 14 4 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 10 V18 M10 14 H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Phone bill overdue",
    desc: "No phone means no work. Keep the lights on, the data flowing, and the orders coming in.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="8" y="3" width="12" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 21 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function PainPoints() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".pain-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 bg-[#fef2f2] text-[#b91c1c] text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5 tracking-[0.04em] uppercase">
            We get it
          </div>
          <h2
            className="font-extrabold tracking-[-0.04em] leading-[0.95] text-[#1a1a1a] mb-5"
            style={{ fontSize: "clamp(38px, 5.5vw, 68px)" }}
          >
            When life hits,
            <br />
            <span className="text-[#15803d]">we help.</span>
          </h2>
          <p className="text-[#71717a] text-[17px] leading-relaxed max-w-xl">
            Gig work means uneven paychecks. When rent, car payments, or
            unexpected costs pile up, a traditional loan isn&apos;t going to
            come through in time. We will.
          </p>
        </div>

        {/* Pain point cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PAIN_POINTS.map((point, i) => (
            <div
              key={i}
              className="pain-card group bg-[#faf8f0] hover:bg-[#f0f5f0] rounded-2xl p-6 transition-all duration-300 border border-transparent hover:border-[#15803d]/20"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#15803d] mb-4 shadow-sm group-hover:scale-105 transition-transform">
                {point.icon}
              </div>
              <h3 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1a1a1a] mb-2">
                {point.title}
              </h3>
              <p className="text-[#71717a] text-[14px] leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-wrap items-center gap-6">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 bg-[#15803d] text-white font-semibold text-[15px] px-8 py-4 rounded-xl hover:bg-[#166534] transition-colors shadow-lg shadow-green-900/20"
          >
            Get help now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <p className="text-[#71717a] text-[14px]">
            <span className="font-semibold text-[#1a1a1a]">48-hour funding</span>{" "}
            · No credit check · Apply in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
