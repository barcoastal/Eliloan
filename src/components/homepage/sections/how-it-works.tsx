"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    headline: "Apply in 5 minutes",
    desc: "Fill out our short form — no lengthy paperwork, no W-2 required. Just your platform earnings and basic info.",
    img: "/illustrations/step-1-apply.png",
    imgAlt: "Person applying on smartphone illustration",
  },
  {
    num: "02",
    headline: "We check earnings, not credit",
    desc: "We connect to your platform account to verify real income. Your credit score won't be pulled. We care about cash flow.",
    img: "/illustrations/step-2-approved.png",
    imgAlt: "Documents with green checkmark approval illustration",
  },
  {
    num: "03",
    headline: "Cash to your account",
    desc: "Approved? Funds hit your bank in as little as 24-48 hours. Back to earning — no interruptions.",
    img: "/illustrations/step-3-funded.png",
    imgAlt: "Money flowing into smartphone illustration",
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
                  <div className="mb-4">
                    <Image
                      src={step.img}
                      alt={step.imgAlt}
                      width={72}
                      height={72}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
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
