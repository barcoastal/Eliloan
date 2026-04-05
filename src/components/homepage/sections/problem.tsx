"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Draw SVG paths on scroll
      const paths = svgRef.current?.querySelectorAll("path, circle, rect, line");
      if (paths) {
        paths.forEach((path) => {
          const el = path as SVGGeometryElement;
          try {
            const len = el.getTotalLength ? el.getTotalLength() : 200;
            gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(el, {
              strokeDashoffset: 0,
              duration: 1.4,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 65%",
                end: "top 20%",
                toggleActions: "play none none reverse",
              },
            });
          } catch {
            // ignore elements without getTotalLength
          }
        });
      }

      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center bg-white px-6 py-24 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div ref={leftRef}>
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-6 tracking-[0.04em] uppercase">
            The problem
          </div>
          <h2
            className="font-extrabold tracking-[-0.04em] leading-[0.95] text-[#1a1a1a] mb-8"
            style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
          >
            Banks don&apos;t get
            <br />
            gig work.
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 2l6 6M8 2L2 8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[#71717a] text-[16px] leading-relaxed">
                <span className="font-bold text-[#1a1a1a]">73% of gig workers</span> say traditional loans are completely inaccessible to them — rejected for lacking W-2s or pay stubs.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 2l6 6M8 2L2 8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[#71717a] text-[16px] leading-relaxed">
                <span className="font-bold text-[#1a1a1a]">44% of SMBs</span> don&apos;t even apply because they assume denial before they start.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1.5 5l2.5 2.5L8.5 2" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[#71717a] text-[16px] leading-relaxed">
                <span className="font-bold text-[#1a1a1a]">LimeCredit reads your earnings</span>, not your credit score. We built this for how you actually work.
              </p>
            </div>
          </div>
        </div>

        {/* Right: hand-drawn SVG illustration */}
        <div ref={rightRef} className="flex items-center justify-center">
          <svg
            ref={svgRef}
            width="360"
            height="360"
            viewBox="0 0 360 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Bank building outline — hand-drawn style */}
            <rect x="60" y="160" width="240" height="140" rx="4" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Columns */}
            <line x1="100" y1="160" x2="100" y2="300" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
            <line x1="140" y1="160" x2="140" y2="300" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
            <line x1="180" y1="160" x2="180" y2="300" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
            <line x1="220" y1="160" x2="220" y2="300" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
            <line x1="260" y1="160" x2="260" y2="300" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
            {/* Roof/pediment */}
            <path d="M50 160 L180 80 L310 160Z" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Steps */}
            <line x1="45" y1="300" x2="315" y2="300" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
            <line x1="35" y1="316" x2="325" y2="316" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />

            {/* Big X overlay — rejected */}
            <path d="M90 110 L270 330" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M270 110 L90 330" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />

            {/* Hand-drawn circles around X */}
            <path
              d="M168 205 C158 185, 155 168, 175 155 C200 140, 225 150, 225 175 C225 200, 205 218, 182 215 C170 213, 162 207, 168 205Z"
              stroke="#ef4444"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Sage green small accent — checkmark off to side */}
            <path d="M295 80 L308 96 L328 62" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="312" cy="82" r="22" stroke="#15803d" strokeWidth="3" />

            {/* Arrow pointing away from bank */}
            <path d="M290 200 C320 200, 340 190, 355 175" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
            <path d="M348 168 L355 175 L346 181" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
