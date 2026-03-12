"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  NAVBAR                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 z-50 w-full bg-[#FAFAF7]/90 backdrop-blur-xl border-b border-emerald-900/5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="text-2xl font-bold tracking-[-0.03em] text-emerald-900">
          Elilons
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {["How It Works", "For Gig Workers", "Why Elilons"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[13px] font-medium text-emerald-800/50 transition-colors hover:text-emerald-900"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/status"
            className="hidden text-[13px] font-medium text-emerald-800/50 transition-colors hover:text-emerald-900 sm:block"
          >
            Check Status
          </Link>
          <Link
            href="/apply"
            className="rounded-full bg-emerald-600 px-5 py-2 text-[13px] font-semibold text-white transition-all hover:bg-emerald-500 hover:scale-105"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO — Sticky full viewport, content scrolls away                   */
/* ------------------------------------------------------------------ */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -150]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-[#FAFAF7]">
        {/* Background image */}
        <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80&auto=format"
            alt="Delivery rider biking through the city"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-[#FAFAF7]/50" />
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10"
          style={{ opacity, y }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-4 py-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-medium text-emerald-700">
              Made exclusively for gig workers
            </span>
          </motion.div>

          <motion.h1
            className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-emerald-950 sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            You drive.
            <br />
            You deliver.
            <br />
            You deserve
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              real funding.
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-emerald-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Up to $10,000 for Uber drivers, DoorDash dashers,
            and every 1099 worker. Zero credit check.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link
              href="/apply"
              className="group rounded-full bg-emerald-600 px-8 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-105"
            >
              Get Funded Now
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/status"
              className="rounded-full border border-emerald-900/15 bg-white/60 px-8 py-3.5 text-[15px] font-medium text-emerald-900 backdrop-blur transition-all hover:bg-white hover:border-emerald-900/25"
            >
              Check Status
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-emerald-800/30">
              Scroll
            </span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-emerald-600/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  STATS — Scroll-reveal inside sticky container                       */
/* ------------------------------------------------------------------ */
function Stats() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const stats = [
    { value: "$2M+", label: "Funded to gig workers" },
    { value: "5 min", label: "Application time" },
    { value: "Zero", label: "Credit checks" },
    { value: "48h", label: "Average funding" },
  ];

  return (
    <section ref={ref} className="relative bg-[#FAFAF7] px-6 py-28 sm:py-36">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-6">
        {stats.map((s, i) => {
          const itemOpacity = useTransform(
            scrollYProgress,
            [0.1 + i * 0.05, 0.25 + i * 0.05],
            [0, 1]
          );
          const itemY = useTransform(
            scrollYProgress,
            [0.1 + i * 0.05, 0.25 + i * 0.05],
            [40, 0]
          );

          return (
            <motion.div
              key={s.label}
              className="text-center"
              style={{ opacity: itemOpacity, y: itemY }}
            >
              <div className="text-4xl font-bold tracking-[-0.03em] text-emerald-700 sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm font-medium text-emerald-800/30">
                {s.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PLATFORM TICKER                                                     */
/* ------------------------------------------------------------------ */
function PlatformTicker() {
  const platforms = [
    "Uber", "Lyft", "DoorDash", "Instacart", "Amazon Flex",
    "Grubhub", "Postmates", "Fiverr", "Upwork", "TaskRabbit",
  ];

  return (
    <section className="overflow-hidden border-y border-emerald-900/5 bg-[#F5F5F0] py-10">
      <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-emerald-800/25">
        Built for workers on every platform
      </p>
      <div className="relative">
        <div className="flex animate-[scroll_25s_linear_infinite] gap-4 whitespace-nowrap">
          {[...platforms, ...platforms, ...platforms].map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="flex-shrink-0 rounded-full border border-emerald-800/8 bg-white/80 px-5 py-2 text-sm font-medium text-emerald-800/40"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS — Sticky scroll, steps transform in place              */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const steps = [
    {
      num: "01",
      title: "Apply",
      subtitle: "Upload your gig earnings",
      desc: "Screenshot your Uber dashboard, DoorDash summary, or any 1099 pay stub. Upload it right from your phone between rides. Takes 2 minutes.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format",
      imageAlt: "Person using phone",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-200",
      dot: "bg-emerald-500",
    },
    {
      num: "02",
      title: "Get Approved",
      subtitle: "We check the numbers — not your credit",
      desc: "No FICO score, no W-2, no invasive questions. We verify your last 3 months of gig earnings. If the math works, you're good.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format",
      imageAlt: "Analytics dashboard",
      color: "text-green-600",
      bg: "bg-green-50",
      ring: "ring-green-200",
      dot: "bg-green-500",
    },
    {
      num: "03",
      title: "Get Funded",
      subtitle: "Cash hits your account — fast",
      desc: "Approved? Done. No more waiting around, no jumping through hoops. Money where you need it so you can fix the car, pay rent, or just breathe.",
      image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80&auto=format",
      imageAlt: "Happy person",
      color: "text-lime-600",
      bg: "bg-lime-50",
      ring: "ring-lime-200",
      dot: "bg-lime-500",
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="relative h-[400vh] scroll-mt-16">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-[#FAFAF7]">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
          {/* Header — always visible */}
          <div className="mb-12">
            <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-emerald-600/50">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-emerald-950 sm:text-4xl">
              Three steps. That&apos;s it.
            </h2>
          </div>

          {/* Progress bar */}
          <div className="mb-12 flex items-center gap-0 max-w-xl">
            {steps.map((step, i) => {
              const stepProgress = useTransform(
                scrollYProgress,
                [i / 3, (i + 0.3) / 3],
                [0, 1]
              );
              const isActive = useTransform(
                scrollYProgress,
                [Math.max(0, (i - 0.1) / 3), i / 3],
                [0, 1]
              );

              return (
                <div key={step.num} className="flex flex-1 items-center">
                  {/* Step dot + label */}
                  <motion.div className="flex flex-col items-center gap-2 relative z-10">
                    <motion.div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-500`}
                      style={{
                        borderColor: useTransform(isActive, [0, 1], ["#d1d5db", step.dot === "bg-emerald-500" ? "#10b981" : step.dot === "bg-green-500" ? "#22c55e" : "#84cc16"]),
                        backgroundColor: useTransform(isActive, [0, 1], ["#ffffff", step.dot === "bg-emerald-500" ? "#ecfdf5" : step.dot === "bg-green-500" ? "#f0fdf4" : "#f7fee7"]),
                        color: useTransform(isActive, [0, 1], ["#9ca3af", step.dot === "bg-emerald-500" ? "#059669" : step.dot === "bg-green-500" ? "#16a34a" : "#65a30d"]),
                      }}
                    >
                      {step.num}
                    </motion.div>
                    <motion.span
                      className="text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{
                        color: useTransform(isActive, [0, 1], ["#9ca3af", step.dot === "bg-emerald-500" ? "#059669" : step.dot === "bg-green-500" ? "#16a34a" : "#65a30d"]),
                      }}
                    >
                      {step.title}
                    </motion.span>
                  </motion.div>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="relative mx-2 h-[2px] flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                        style={{ width: useTransform(stepProgress, [0, 1], ["0%", "100%"]) }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content — transforms in place */}
          <div className="relative h-[320px] sm:h-[280px]">
            {steps.map((step, i) => {
              const stepStart = i / 3;
              const stepEnd = (i + 1) / 3;
              const fadeIn = useTransform(
                scrollYProgress,
                [stepStart, stepStart + 0.05],
                [0, 1]
              );
              const fadeOut = useTransform(
                scrollYProgress,
                [stepEnd - 0.05, stepEnd],
                [1, i === steps.length - 1 ? 1 : 0]
              );
              const contentY = useTransform(
                scrollYProgress,
                [stepStart, stepStart + 0.05, stepEnd - 0.05, stepEnd],
                [30, 0, 0, i === steps.length - 1 ? 0 : -30]
              );

              return (
                <motion.div
                  key={step.num}
                  className="absolute inset-0 grid items-start gap-10 lg:grid-cols-2 lg:gap-16"
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      v => {
                        const fi = v < stepStart + 0.05 ? (v - stepStart) / 0.05 : 1;
                        const fo = i === steps.length - 1 ? 1 : (v > stepEnd - 0.05 ? 1 - (v - (stepEnd - 0.05)) / 0.05 : 1);
                        return Math.max(0, Math.min(1, fi)) * Math.max(0, Math.min(1, fo));
                      }
                    ),
                    y: contentY,
                  }}
                >
                  <div>
                    <div className={`inline-flex items-center gap-2 rounded-full ${step.bg} px-4 py-1.5 mb-4`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${step.dot}`} />
                      <span className={`text-[12px] font-semibold ${step.color}`}>
                        Step {step.num}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold tracking-[-0.02em] text-emerald-950 sm:text-4xl">
                      {step.subtitle}
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-emerald-800/40">
                      {step.desc}
                    </p>
                  </div>
                  <div className={`aspect-[16/10] overflow-hidden rounded-2xl ${step.bg} ring-1 ${step.ring} shadow-lg shadow-emerald-900/5`}>
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  THE STRUGGLE — Sticky scroll, problem → solution in place           */
/* ------------------------------------------------------------------ */
function TheStruggle() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const problemOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4, 0.5], [0, 1, 1, 0]);
  const problemY = useTransform(scrollYProgress, [0, 0.15, 0.4, 0.5], [60, 0, 0, -60]);
  const solutionOpacity = useTransform(scrollYProgress, [0.5, 0.65, 0.9, 1], [0, 1, 1, 1]);
  const solutionY = useTransform(scrollYProgress, [0.5, 0.65], [60, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-[#FAFAF7]">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">

          {/* Problem */}
          <motion.div
            className="absolute inset-0 flex items-center px-6 sm:px-10"
            style={{ opacity: problemOpacity, y: problemY }}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="text-[12px] font-semibold text-red-600">The reality</span>
                </div>
                <h2 className="text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-emerald-950 sm:text-5xl">
                  Banks don&apos;t see
                  <br />your grind.
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-emerald-800/40">
                  You&apos;re driving 12-hour shifts, delivering in the rain, picking up rides at 2am — and every bank says your income &ldquo;doesn&apos;t qualify.&rdquo;
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    "Car breaks down — repair can't wait till next payout",
                    "Slow week on Uber but rent is still due",
                    "Banks need a W-2 you'll never have",
                    "One bad week and everything spirals",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-red-300" />
                      <p className="text-sm leading-relaxed text-emerald-800/35">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-emerald-900/5 shadow-xl shadow-emerald-900/5">
                <img
                  src="https://images.unsplash.com/photo-1621976360623-004223992275?w=800&q=80&auto=format"
                  alt="Rideshare driver checking phone while waiting"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            className="absolute inset-0 flex items-center px-6 sm:px-10"
            style={{ opacity: solutionOpacity, y: solutionY }}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="order-2 lg:order-1 aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-emerald-200 shadow-xl shadow-emerald-900/5">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80&auto=format"
                  alt="Happy delivery rider on motorcycle"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[12px] font-semibold text-emerald-600">Elilons is different</span>
                </div>
                <h2 className="text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-emerald-950 sm:text-5xl">
                  We were built
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                    for your hustle.
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-emerald-800/40">
                  Elilons exists because gig workers deserve better. We look at your actual earnings — not your credit score.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    "Up to $10K based on your Uber, DoorDash, or Lyft earnings",
                    "We read your pay stubs — that's your proof",
                    "Apply from your phone between rides",
                    "Fair terms, fast funding — no predatory garbage",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500" />
                      <p className="text-sm leading-relaxed text-emerald-800/35">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOR GIG WORKERS — Photo cards                                       */
/* ------------------------------------------------------------------ */
function ForGigWorkers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const personas = [
    {
      title: "Rideshare Drivers",
      desc: "Uber and Lyft drivers working 50+ hour weeks. Your income is real.",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80&auto=format",
    },
    {
      title: "Delivery Riders",
      desc: "DoorDash, Instacart, Amazon Flex — rain or shine, you show up.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80&auto=format",
    },
    {
      title: "Bike Couriers",
      desc: "Pedaling through traffic making deliveries all day. We see the grind.",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&q=80&auto=format",
    },
    {
      title: "Freelancers",
      desc: "Designers, writers, developers. Your 1099 income counts here.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80&auto=format",
    },
  ];

  return (
    <section
      ref={ref}
      id="for-gig-workers"
      className="scroll-mt-16 bg-[#F5F5F0] px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-emerald-600/50">
            For gig workers
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-emerald-950 sm:text-4xl lg:text-5xl">
            If you work on an app,
            <br />
            <span className="text-emerald-600">Elilons is for you.</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer shadow-lg shadow-emerald-900/5"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="mb-2 h-[2px] w-6 rounded-full bg-emerald-400 transition-all duration-500 group-hover:w-12" />
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-1.5 max-h-0 overflow-hidden text-sm leading-relaxed text-emerald-100/60 transition-all duration-500 group-hover:max-h-20">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  WHY ELILONS                                                         */
/* ------------------------------------------------------------------ */
function WhyElilons() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      title: "Zero Credit Check",
      desc: "Banks judge you by a number. We judge you by your hustle. Your gig earnings are all the proof we need.",
    },
    {
      title: "Up to $10,000",
      desc: "Fix the car, catch up on rent, cover an emergency. Real money for the real stuff gig workers deal with.",
    },
    {
      title: "Apply Between Rides",
      desc: "Waiting for your next Uber ping? That's enough time. Upload stubs, fill the form, done.",
    },
    {
      title: "Made for 1099 Workers",
      desc: "This isn't a bank product. We built Elilons from scratch for people who earn on apps.",
    },
  ];

  return (
    <section ref={ref} id="why-elilons" className="scroll-mt-16 bg-[#FAFAF7] px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-emerald-600/50">
            Why Elilons
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-emerald-950 sm:text-4xl lg:text-5xl">
            Built different. <span className="text-emerald-600">Built for you.</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="rounded-2xl border border-emerald-900/5 bg-white/70 p-8 transition-all duration-500 hover:bg-white hover:shadow-lg hover:shadow-emerald-900/5 sm:p-10"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="text-xl font-bold tracking-[-0.02em] text-emerald-900 sm:text-2xl">
                {v.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-emerald-800/35">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TESTIMONIALS                                                        */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote: "I drive Uber like 50 hours a week and Chase literally told me I don't have real income. Elilons looked at my stubs and funded me in 2 days.",
      name: "Marcus T.",
      role: "Uber Driver, Atlanta",
      initials: "MT",
    },
    {
      quote: "Slow week on DoorDash plus rent due — instant panic. Applied on Elilons Tuesday, had cash by Thursday. They actually get the gig life.",
      name: "Sarah K.",
      role: "DoorDash Dasher, Phoenix",
      initials: "SK",
    },
    {
      quote: "I do Instacart and Amazon Flex. My income is all over the place. Every bank treats me like I'm unemployed. Elilons just said yes.",
      name: "DeAndre J.",
      role: "Instacart Shopper, Chicago",
      initials: "DJ",
    },
  ];

  return (
    <section ref={ref} className="bg-[#F5F5F0] px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-emerald-600/50">
            From the community
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-emerald-950 sm:text-4xl">
            Gig workers trust Elilons.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex h-full flex-col justify-between rounded-2xl border border-emerald-900/5 bg-white/70 p-8 sm:p-9"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-1 w-5 rounded-full bg-emerald-400" />
                  ))}
                </div>
                <p className="mt-6 text-[15px] leading-relaxed text-emerald-900/60">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-xs font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">{t.name}</p>
                  <p className="text-[12px] text-emerald-800/30">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-[10px] text-emerald-800/15">
          Testimonials are illustrative
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FINAL CTA                                                           */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-emerald-600 px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-green-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-800/30 blur-3xl" />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
          Your next ride
          <br />
          could fund
          <br />
          <span className="text-emerald-200">your next move.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg text-white/60">
          5 minutes. That&apos;s all it takes. Apply between deliveries.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/apply"
            className="group rounded-full bg-white px-10 py-4 text-[15px] font-bold text-emerald-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Get Funded Now
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <Link
            href="/status"
            className="text-sm font-medium text-white/60 underline underline-offset-4 transition-colors hover:text-white"
          >
            Already applied? Check status
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="bg-emerald-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <div>
            <span className="text-xl font-bold tracking-[-0.02em] text-white">
              Elilons
            </span>
            <p className="mt-1.5 max-w-xs text-sm text-emerald-200/25">
              Cash for the drivers, the dashers, the riders, and every gig worker keeping things moving.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-emerald-200/30">
            <Link href="/apply" className="transition-colors hover:text-emerald-300">Apply</Link>
            <Link href="/status" className="transition-colors hover:text-emerald-300">Status</Link>
            <a href="#how-it-works" className="transition-colors hover:text-emerald-300">How It Works</a>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-200/5 pt-6 text-center text-[10px] text-emerald-200/15">
          <p>Not a bank. Loans subject to approval and verification of income. Elilons is designed exclusively for 1099 independent contractors.</p>
          <p className="mt-1">&copy; 2026 Elilons. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <main className="bg-[#FAFAF7]">
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <Navbar />
      <Hero />
      <Stats />
      <PlatformTicker />
      <HowItWorks />
      <TheStruggle />
      <ForGigWorkers />
      <WhyElilons />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
