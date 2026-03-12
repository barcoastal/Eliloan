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
        >
          Elilons
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {["How It Works", "For Gig Workers", "Why Elilons"].map((label) => (
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
            className="rounded-full bg-emerald-400 px-5 py-2 text-[13px] font-semibold text-emerald-950 transition-all hover:bg-emerald-300 hover:scale-105"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO — Full viewport, cinematic, green money energy                 */
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
      {/* Background — gig worker on bike */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80&auto=format"
          alt="Delivery rider biking through the city at golden hour"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-black/50 to-emerald-950/80" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ opacity, y: textY }}
      >
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[13px] font-medium text-emerald-300">
            Made exclusively for gig workers
          </span>
        </motion.div>

        <motion.h1
          className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          You drive. You deliver.
          <br />
          You deserve
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
            real funding.
          </span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Uber driver? DoorDash dasher? Instacart shopper?
          <br className="hidden sm:block" />
          Get up to $10,000 based on your gig earnings. Zero credit check.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Link
            href="/apply"
            className="group rounded-full bg-emerald-400 px-10 py-4 text-[15px] font-bold text-emerald-950 shadow-lg shadow-emerald-400/25 transition-all hover:bg-emerald-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-400/30"
          >
            Get Funded Now
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <Link
            href="/status"
            className="rounded-full border border-white/30 px-10 py-4 text-[15px] font-medium text-white/90 backdrop-blur transition-all hover:border-emerald-400/50 hover:bg-emerald-400/10"
          >
            Check Your Status
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
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-300/40">
            Scroll
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-emerald-400/40 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  STATS — Green money vibes                                           */
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
    <section ref={ref} className="bg-emerald-950 px-6 py-32 sm:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-12 lg:grid-cols-4 lg:gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <div className="text-4xl font-bold tracking-[-0.02em] text-emerald-300 sm:text-5xl lg:text-6xl">
              {s.value}
            </div>
            <div className="mt-3 text-sm font-medium text-emerald-300/40">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  GIG WORKER BANNER — "This is YOUR platform"                        */
/* ------------------------------------------------------------------ */
function GigWorkerBanner() {
  const platforms = [
    "Uber", "Lyft", "DoorDash", "Instacart", "Amazon Flex",
    "Grubhub", "Postmates", "Fiverr", "Upwork", "TaskRabbit",
  ];

  return (
    <section className="overflow-hidden bg-[#0a0f0a] py-16">
      <FadeIn>
        <p className="mb-8 text-center text-[13px] font-medium uppercase tracking-[0.3em] text-emerald-400/50">
          Built for workers on every platform
        </p>
      </FadeIn>
      {/* Scrolling ticker */}
      <div className="relative">
        <div className="flex animate-[scroll_20s_linear_infinite] gap-6">
          {[...platforms, ...platforms].map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="flex-shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-6 py-2 text-sm font-medium text-emerald-300/70"
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
/*  THE STRUGGLE — Problem vs Solution with gig worker imagery          */
/* ------------------------------------------------------------------ */
function TheStruggle() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="bg-[#060a06]">
      {/* Problem */}
      <div className="relative min-h-screen px-6 py-32 sm:py-40">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <FadeIn>
            <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-red-400/80">
              The reality for gig workers
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl">
              Banks don&apos;t see
              <br />
              your grind.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/40">
              You&apos;re out there driving 10 hours, making deliveries in the rain, picking up late-night rides — and when you need cash, every bank says &ldquo;you don&apos;t qualify.&rdquo;
            </p>
            <div className="mt-10 space-y-5">
              {[
                "Car breaks down mid-shift — repair costs won't wait till next payout",
                "Slow week on Uber but rent is still due on the first",
                "Every bank needs a W-2 you don't have",
                "Payday lenders charge you 400% because they can",
              ].map((text, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400/60" />
                    <p className="text-base leading-relaxed text-white/50">
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
                src="https://images.unsplash.com/photo-1621976360623-004223992275?w=900&q=80&auto=format"
                alt="Rideshare driver waiting in car checking phone"
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
                alt="Happy delivery driver on motorcycle smiling"
                scrollYProgress={scrollYProgress}
                outputRange={["-5%", "5%"]}
                className="h-[110%] w-full"
              />
            </div>
          </FadeIn>

          <FadeIn className="order-1 lg:order-2">
            <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-emerald-400/80">
              Elilons is different
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl">
              We were built
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
                for your hustle.
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/40">
              Elilons exists because gig workers deserve better than what traditional banks offer. We look at your actual earnings — not a credit score.
            </p>
            <div className="mt-10 space-y-5">
              {[
                "Up to $10K based on your Uber, DoorDash, or Lyft earnings",
                "We read your pay stubs — that's your proof of income",
                "Apply from your phone between rides or deliveries",
                "Fair terms, fast funding — no predatory garbage",
              ].map((text, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                    <p className="text-base leading-relaxed text-white/50">
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
/*  HOW IT WORKS — Big scroll cards with gig worker photos              */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Show us your earnings",
      desc: "Screenshot your Uber driver dashboard, DoorDash earnings page, or Instacart pay summary. We accept it all — PDFs, screenshots, whatever you got. Takes 2 minutes from your phone between rides.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&auto=format",
      imageAlt: "Person using phone to take photo of document",
    },
    {
      num: "02",
      title: "We verify the numbers",
      desc: "No credit check. No invasive questions about your life. We just look at what you earned delivering, driving, or freelancing in the last 3 months. If the math works, you're in.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format",
      imageAlt: "Dashboard showing data and analytics",
    },
    {
      num: "03",
      title: "Cash in your account",
      desc: "Approved? Done. No more waiting, no more hoops. Money lands in your account so you can fix the car, pay rent, or just stop stressing for a minute.",
      image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900&q=80&auto=format",
      imageAlt: "Person smiling looking at phone with good news",
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-16 bg-[#f0f7f0] px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-emerald-600/60">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-emerald-950 sm:text-5xl lg:text-6xl">
            Three steps.
            <br />
            <span className="text-emerald-600">That&apos;s it.</span>
          </h2>
        </FadeIn>

        <div className="mt-24 space-y-32 lg:space-y-40">
          {steps.map((step, i) => (
            <FadeIn key={step.num}>
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="text-6xl font-bold tracking-[-0.04em] text-emerald-500/[0.1] sm:text-8xl">
                    {step.num}
                  </span>
                  <h3 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-emerald-950 sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-emerald-900/50">
                    {step.desc}
                  </p>
                </div>
                <div
                  className={`aspect-[4/3] overflow-hidden rounded-3xl bg-emerald-100 shadow-xl shadow-emerald-900/5 ${
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
/*  FOR GIG WORKERS — Immersive photo cards of actual gig workers       */
/* ------------------------------------------------------------------ */
function ForGigWorkers() {
  const personas = [
    {
      title: "Rideshare Drivers",
      desc: "Uber and Lyft drivers working 50+ hour weeks. Your income is real — we see every ride.",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80&auto=format",
    },
    {
      title: "Delivery Riders",
      desc: "DoorDash, Instacart, Amazon Flex — rain or shine, you show up. We show up for you.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80&auto=format",
    },
    {
      title: "Bike Couriers",
      desc: "Pedaling through traffic all day making deliveries. Your legs are your engine and your earnings are your proof.",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80&auto=format",
    },
    {
      title: "Freelancers",
      desc: "Designers, writers, developers — your 1099 income counts here. Every gig, every project, every dollar.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format",
    },
  ];

  return (
    <section
      id="for-gig-workers"
      className="scroll-mt-16 bg-emerald-950 px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-emerald-400/50">
            For gig workers
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl">
            If you work on an app,
            <br />
            <span className="text-emerald-300">Elilons is for you.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-white/40">
            We don&apos;t care which platform you&apos;re on. If you&apos;re grinding and earning on a 1099, we&apos;re here to help when you need cash.
          </p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-2 h-1 w-8 rounded-full bg-emerald-400 transition-all duration-500 group-hover:w-16" />
                  <h3 className="text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-emerald-200/60 transition-all duration-500 group-hover:max-h-24">
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
/*  WHY ELILONS — Value props                                           */
/* ------------------------------------------------------------------ */
function WhyElilons() {
  const values = [
    {
      title: "Zero Credit Check",
      desc: "Banks judge you by a number. We judge you by your hustle. Your gig earnings are all the proof we need.",
      accent: "border-emerald-400/20 hover:border-emerald-400/40",
    },
    {
      title: "Up to $10,000",
      desc: "Fix the car, catch up on rent, cover an emergency. Real money for the real stuff gig workers deal with daily.",
      accent: "border-green-400/20 hover:border-green-400/40",
    },
    {
      title: "Apply Between Rides",
      desc: "Waiting for your next Uber ping? That's enough time. Fill out the form, upload your stubs, done.",
      accent: "border-lime-400/20 hover:border-lime-400/40",
    },
    {
      title: "Made for 1099 Workers",
      desc: "This isn't a bank product with gig workers slapped on the landing page. We built Elilons from day one for people like you.",
      accent: "border-teal-400/20 hover:border-teal-400/40",
    },
  ];

  return (
    <section id="why-elilons" className="scroll-mt-16 bg-[#060a06] px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-emerald-400/50">
            Why Elilons
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            Built different.
            <br />
            <span className="text-emerald-400">Built for you.</span>
          </h2>
        </FadeIn>

        <div className="mt-20 grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <div className={`rounded-2xl border ${v.accent} bg-white/[0.02] p-10 transition-all duration-500 sm:p-12`}>
                <h3 className="text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                  {v.title}
                </h3>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-white/40">
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
/*  TESTIMONIALS — Real gig worker stories                              */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const testimonials = [
    {
      quote:
        "I drive Uber like 50 hours a week and Chase literally told me I don't have real income. Elilons looked at my stubs and funded me in 2 days. I could finally fix my car.",
      name: "Marcus T.",
      role: "Uber Driver, Atlanta",
      initials: "MT",
    },
    {
      quote:
        "Slow week on DoorDash plus rent due equals instant panic. Applied on Elilons on a Tuesday, had cash by Thursday. They actually get what it's like to live gig-to-gig.",
      name: "Sarah K.",
      role: "DoorDash Dasher, Phoenix",
      initials: "SK",
    },
    {
      quote:
        "I do Instacart and Amazon Flex. My income is all over the place. Every bank treats me like I'm unemployed. Elilons just looked at my earnings and said yes.",
      name: "DeAndre J.",
      role: "Instacart Shopper, Chicago",
      initials: "DJ",
    },
  ];

  return (
    <section className="bg-emerald-950 px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-emerald-400/50">
            From the community
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
            Gig workers trust Elilons.
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.15}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-8 sm:p-10">
                <div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="h-1.5 w-6 rounded-full bg-emerald-400"
                      />
                    ))}
                  </div>
                  <p className="mt-8 text-lg leading-relaxed text-white/60">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-sm font-bold text-emerald-950">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-[13px] text-emerald-300/40">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <p className="mt-10 text-center text-[11px] text-emerald-400/20">
          Testimonials are illustrative
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FINAL CTA — Big cinematic closer                                    */
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
      {/* Background — gig worker imagery */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1920&q=80&auto=format"
          alt="Cyclist delivery rider on city street"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 to-emerald-950/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <FadeIn>
          <h2 className="text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl lg:text-7xl">
            Your next ride
            <br />
            could fund
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
              your next move.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-md text-lg text-white/50">
            5 minutes. That&apos;s all it takes. Apply between deliveries and get back to earning.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/apply"
              className="group rounded-full bg-emerald-400 px-10 py-4 text-[15px] font-bold text-emerald-950 shadow-lg shadow-emerald-400/25 transition-all hover:bg-emerald-300 hover:scale-105"
            >
              Get Funded Now
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/status"
              className="text-sm font-medium text-white/50 underline underline-offset-4 transition-colors hover:text-emerald-300"
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
    <footer className="bg-[#030503] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-start">
          <div>
            <span className="text-2xl font-bold tracking-[-0.02em] text-white">
              Elilons
            </span>
            <p className="mt-2 max-w-xs text-sm text-white/30">
              Cash for the drivers, the dashers, the riders, and every gig worker keeping things moving.
            </p>
          </div>

          <div className="flex gap-10 text-sm text-white/30">
            <Link href="/apply" className="transition-colors hover:text-emerald-300">
              Apply
            </Link>
            <Link href="/status" className="transition-colors hover:text-emerald-300">
              Status
            </Link>
            <a href="#how-it-works" className="transition-colors hover:text-emerald-300">
              How It Works
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-8 text-center text-[11px] text-white/20">
          <p>
            Not a bank. Loans subject to approval and verification of income. Elilons is designed exclusively for 1099 independent contractors.
          </p>
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
    <main className="bg-emerald-950">
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <Navbar />
      <Hero />
      <Stats />
      <GigWorkerBanner />
      <TheStruggle />
      <HowItWorks />
      <ForGigWorkers />
      <WhyElilons />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
