"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Utility: fade-in on scroll                                         */
/* ------------------------------------------------------------------ */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Utility: parallax image                                             */
/* ------------------------------------------------------------------ */
function ParallaxImage({
  src,
  alt,
  scrollYProgress,
  outputRange = ["-10%", "10%"],
  className = "",
}: {
  src: string;
  alt: string;
  scrollYProgress: MotionValue<number>;
  outputRange?: string[];
  className?: string;
}) {
  const y = useTransform(scrollYProgress, [0, 1], outputRange);

  return (
    <motion.div className={`overflow-hidden ${className}`} style={{ y }}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVBAR                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 z-50 w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="text-2xl font-bold tracking-[-0.02em] text-white"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          gigfund
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {["How It Works", "Who We Help", "Why Us"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[13px] font-medium tracking-wide text-white/70 transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/status"
            className="hidden text-[13px] font-medium text-white/70 transition-colors hover:text-white sm:block"
          >
            Check Status
          </Link>
          <Link
            href="/apply"
            className="rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-black transition-all hover:bg-white/90 hover:scale-105"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO — Full viewport, cinematic                                     */
/* ------------------------------------------------------------------ */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  return (
    <section ref={ref} className="relative h-[100vh] overflow-hidden">
      {/* Background image with parallax zoom */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80&auto=format"
          alt="Delivery rider on a bike in the city"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ opacity, y: textY }}
      >
        <motion.p
          className="mb-6 text-[13px] font-medium uppercase tracking-[0.3em] text-white/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Built for gig workers
        </motion.p>

        <motion.h1
          className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Rent is due.
          <br />
          Gas ain&apos;t free.
          <br />
          <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            We got you.
          </span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Up to $10,000 based on your actual earnings.
          <br className="hidden sm:block" />
          No credit check. Apply in 5 minutes.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Link
            href="/apply"
            className="group rounded-full bg-white px-10 py-4 text-[15px] font-bold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
          >
            Get Funded
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <Link
            href="/status"
            className="rounded-full border border-white/30 px-10 py-4 text-[15px] font-medium text-white/90 backdrop-blur transition-all hover:border-white/60 hover:bg-white/10"
          >
            Check Status
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
            Scroll
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  STATS — Sticky counter section                                     */
/* ------------------------------------------------------------------ */
function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "$2M+", label: "Funded to gig workers" },
    { value: "5 min", label: "Average application time" },
    { value: "0", label: "Credit checks required" },
    { value: "48hrs", label: "Average funding time" },
  ];

  return (
    <section ref={ref} className="bg-black px-6 py-32 sm:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-12 lg:grid-cols-4 lg:gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <div className="text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
              {s.value}
            </div>
            <div className="mt-3 text-sm font-medium text-white/40">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  THE STRUGGLE — Side-by-side sticky scroll                          */
/* ------------------------------------------------------------------ */
function TheStruggle() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="bg-[#0a0a0a]">
      {/* Problem */}
      <div className="relative min-h-screen px-6 py-32 sm:py-40">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <FadeIn>
            <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-red-400/80">
              The reality
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl">
              The system wasn&apos;t
              <br />
              built for you.
            </h2>
            <div className="mt-10 space-y-6">
              {[
                "Car breaks down and you still gotta make rent",
                "Slow week on the app but bills don't wait",
                "Banks say your income 'doesn't qualify'",
                "One bad week and you're behind on everything",
              ].map((text, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400/60" />
                    <p className="text-lg leading-relaxed text-white/60">
                      {text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1616587894289-86480e533129?w=900&q=80&auto=format"
                alt="Person looking at phone stressed"
                scrollYProgress={scrollYProgress}
                outputRange={["-5%", "5%"]}
                className="h-[110%] w-full"
              />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Solution */}
      <div className="relative min-h-screen px-6 py-32 sm:py-40">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <FadeIn delay={0.2} className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80&auto=format"
                alt="Happy delivery driver on motorcycle"
                scrollYProgress={scrollYProgress}
                outputRange={["-5%", "5%"]}
                className="h-[110%] w-full"
              />
            </div>
          </FadeIn>

          <FadeIn className="order-1 lg:order-2">
            <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-emerald-400/80">
              The solution
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl">
              We show up
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                when they won&apos;t.
              </span>
            </h2>
            <div className="mt-10 space-y-6">
              {[
                "Up to $10K based on your actual gig earnings",
                "We read your pay stubs, not your credit score",
                "Apply from your phone between rides",
                "Fair terms — no predatory nonsense",
              ].map((text, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400/60" />
                    <p className="text-lg leading-relaxed text-white/60">
                      {text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS — Large scroll-triggered cards                         */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Drop your pay stubs",
      desc: "Screenshot your Uber earnings, DoorDash summary, whatever you got. We accept it all. Takes 2 minutes from your phone.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format",
      imageAlt: "Phone showing earnings",
    },
    {
      num: "02",
      title: "We check the numbers",
      desc: "No credit check. No invasive questions. We just verify what you earned in the last 3 months and make sure the math works.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format",
      imageAlt: "Data analysis",
    },
    {
      num: "03",
      title: "Cash hits your account",
      desc: "Approved? Done. No waiting around, no jumping through hoops. Money where you need it, when you need it.",
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=900&q=80&auto=format",
      imageAlt: "Cash money",
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-16 bg-white px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-black/40">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-black sm:text-5xl lg:text-6xl">
            Three steps.
            <br />
            That&apos;s it.
          </h2>
        </FadeIn>

        <div className="mt-24 space-y-32 lg:space-y-40">
          {steps.map((step, i) => (
            <FadeIn key={step.num}>
              <div
                className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
                  i % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="text-6xl font-bold tracking-[-0.04em] text-black/[0.06] sm:text-8xl">
                    {step.num}
                  </span>
                  <h3 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-black sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-black/50">
                    {step.desc}
                  </p>
                </div>
                <div
                  className={`aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100 ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  WHO WE HELP — Immersive image cards                                 */
/* ------------------------------------------------------------------ */
function WhoWeHelp() {
  const personas = [
    {
      title: "Rideshare Drivers",
      desc: "Running Uber and Lyft back to back? That's real income. We see you.",
      image:
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80&auto=format",
    },
    {
      title: "Delivery Riders",
      desc: "DoorDash at lunch, Instacart at night. You're working harder than anyone.",
      image:
        "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&q=80&auto=format",
    },
    {
      title: "Freelancers",
      desc: "Design at 2am, code between gigs. Your 1099 income counts here.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format",
    },
    {
      title: "Contractors",
      desc: "Plumbing, electrical, consulting. When cash flow gets tight, we bridge the gap.",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format",
    },
  ];

  return (
    <section
      id="who-we-help"
      className="scroll-mt-16 bg-[#0a0a0a] px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-white/40">
            Who we help
          </p>
          <h2 className="mt-4 max-w-lg text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl">
            You&apos;re not alone in this
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500">
                  <h3 className="text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {p.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  WHY US — Minimal text blocks                                        */
/* ------------------------------------------------------------------ */
function WhyUs() {
  const values = [
    {
      title: "No Credit Check",
      desc: "Your FICO score is irrelevant. We care about what you earned — that's it.",
    },
    {
      title: "Up to $10,000",
      desc: "Cover a car repair, catch up on rent, or just breathe for a minute.",
    },
    {
      title: "5-Minute Application",
      desc: "Apply between rides. Fill the form, upload stubs, done before the next ping.",
    },
    {
      title: "Built for 1099",
      desc: "We built this because the system wasn't working for gig workers. Period.",
    },
  ];

  return (
    <section id="why-us" className="scroll-mt-16 bg-white px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-black/40">
            Why us
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-black sm:text-5xl lg:text-6xl">
            Different by design.
          </h2>
        </FadeIn>

        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-black/[0.06] bg-black/[0.06] sm:grid-cols-2">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <div className="group bg-white p-10 transition-colors hover:bg-gray-50 sm:p-12">
                <h3 className="text-2xl font-bold tracking-[-0.02em] text-black sm:text-3xl">
                  {v.title}
                </h3>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-black/50">
                  {v.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TESTIMONIALS                                                       */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const testimonials = [
    {
      quote:
        "I drive Uber like 50 hours a week and Chase literally told me I don't have real income. GigFund looked at my stubs and funded me in 2 days.",
      name: "Marcus T.",
      role: "Rideshare Driver",
    },
    {
      quote:
        "Slow week on DoorDash plus rent due equals panic mode. Applied here on a Tuesday, had cash by Thursday. No weird credit check, no judgment.",
      name: "Sarah K.",
      role: "Delivery Driver",
    },
    {
      quote:
        "As a freelancer my income goes up and down. Every bank treats me like I'm unemployed. These people actually understood my situation.",
      name: "James R.",
      role: "Freelance Designer",
    },
  ];

  return (
    <section className="bg-[#0a0a0a] px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-white/40">
            Real stories
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
            Don&apos;t take our word.
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.15}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur sm:p-10">
                <div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="h-1.5 w-6 rounded-full bg-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-8 text-lg leading-relaxed text-white/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-[13px] text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <p className="mt-10 text-center text-[11px] text-white/20">
          Testimonials are illustrative
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FINAL CTA — Cinematic                                               */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden px-6 py-40 sm:py-52"
      style={{ scale, opacity }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80&auto=format"
          alt="People working together"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <FadeIn>
          <h2 className="text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl lg:text-7xl">
            Stop stressing.
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              Start moving.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-md text-lg text-white/60">
            Takes less time than waiting for your next order to come through.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/apply"
              className="group rounded-full bg-white px-10 py-4 text-[15px] font-bold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
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
        </FadeIn>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="bg-black px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-start">
          <div>
            <span className="text-2xl font-bold tracking-[-0.02em] text-white">
              gigfund
            </span>
            <p className="mt-2 text-sm text-white/30">
              Cash for the people who keep things moving.
            </p>
          </div>

          <div className="flex gap-10 text-sm text-white/40">
            <Link
              href="/apply"
              className="transition-colors hover:text-white"
            >
              Apply
            </Link>
            <Link
              href="/status"
              className="transition-colors hover:text-white"
            >
              Status
            </Link>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-white"
            >
              How It Works
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-8 text-center text-[11px] text-white/20">
          <p>
            Not a bank. Loans subject to approval and verification of income.
          </p>
          <p className="mt-1">&copy; 2026 GigFund. All rights reserved.</p>
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
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Stats />
      <TheStruggle />
      <HowItWorks />
      <WhoWeHelp />
      <WhyUs />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
