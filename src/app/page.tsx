import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  GigFund – Full Marketing Homepage                                  */
/* ------------------------------------------------------------------ */

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            GigFund
          </span>
        </Link>

        {/* Center links – hidden on small screens */}
        <div className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            How It Works
          </a>
          <a href="#who-we-help" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Who We Help
          </a>
          <a href="#why-us" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Why Us
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/status"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors sm:inline-block"
          >
            Check Status
          </Link>
          <Link
            href="/apply"
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-500 px-4 py-24 text-center text-white sm:py-32 lg:py-40">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-purple-400/15 blur-2xl" />

      {/* Floating emoji decorations */}
      <span className="pointer-events-none absolute top-16 left-[10%] text-4xl opacity-30 select-none sm:text-5xl" aria-hidden="true">🚗</span>
      <span className="pointer-events-none absolute top-28 right-[12%] text-4xl opacity-30 select-none sm:text-5xl" aria-hidden="true">📦</span>
      <span className="pointer-events-none absolute bottom-20 left-[20%] text-4xl opacity-30 select-none sm:text-5xl" aria-hidden="true">💰</span>
      <span className="pointer-events-none absolute bottom-28 right-[18%] text-3xl opacity-20 select-none sm:text-4xl" aria-hidden="true">⚡</span>

      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Your Hustle Deserves&nbsp;Backup
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/90 sm:text-xl">
          Fast loans up to $10,000 for Uber drivers, DoorDash dashers, and every gig worker grinding daily.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/apply"
            className="rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
          >
            Apply in 5 Minutes
          </Link>
          <Link
            href="/status"
            className="rounded-full border-2 border-white/80 px-8 py-3.5 text-base font-bold text-white hover:bg-white/10 transition-colors"
          >
            Check Your Status
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/80 sm:gap-10 sm:text-base">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-extrabold text-white sm:text-3xl">$2M+</span>
            <span>Funded</span>
          </div>
          <div className="hidden h-8 w-px bg-white/30 sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-extrabold text-white sm:text-3xl">5 Min</span>
            <span>Application</span>
          </div>
          <div className="hidden h-8 w-px bg-white/30 sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-extrabold text-white sm:text-3xl">No</span>
            <span>Credit Check</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function TrustBar() {
  const platforms = ["Uber", "Lyft", "DoorDash", "Instacart", "Fiverr", "Upwork"];

  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-5 text-sm font-medium tracking-wide text-slate-400 uppercase">
          Trusted by 1099 workers from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {platforms.map((p) => (
            <span
              key={p}
              className="rounded-full border border-slate-200 bg-white px-5 py-1.5 text-sm font-medium text-slate-500"
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

const steps = [
  {
    num: 1,
    emoji: "\uD83D\uDCC4",
    title: "Upload Your Pay Stubs",
    desc: "Share your last 3 months of earnings. We accept screenshots, PDFs, anything.",
    color: "from-purple-500 to-blue-500",
    bg: "bg-purple-50",
  },
  {
    num: 2,
    emoji: "\u26A1",
    title: "We Review Fast",
    desc: "Our team reviews your application. No credit check, no BS.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    num: 3,
    emoji: "\uD83D\uDCB0",
    title: "Get Your Money",
    desc: "Approved? Funds hit your account fast.",
    color: "from-cyan-500 to-emerald-500",
    bg: "bg-emerald-50",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">How It Works</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">Three simple steps between you and the cash you need.</p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className={`relative rounded-2xl ${s.bg} p-8 text-left shadow-sm`}>
              {/* Number badge */}
              <span
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${s.color} text-sm font-bold text-white shadow`}
              >
                {s.num}
              </span>
              <div className="mb-3 text-4xl">{s.emoji}</div>
              <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const personas = [
  {
    emoji: "\uD83D\uDE97",
    title: "Rideshare Drivers",
    desc: "Uber, Lyft \u2014 we know your income is real even if it\u2019s not a W-2.",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    emoji: "\uD83D\uDCE6",
    title: "Delivery Partners",
    desc: "DoorDash, Instacart, Amazon Flex \u2014 your hustle counts.",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    emoji: "\uD83D\uDCBB",
    title: "Freelancers",
    desc: "Designers, developers, writers \u2014 1099 income is real income.",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    emoji: "\uD83D\uDD27",
    title: "Independent Contractors",
    desc: "Plumbers, electricians, consultants \u2014 we got you.",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

function WhoWeHelp() {
  return (
    <section id="who-we-help" className="scroll-mt-16 bg-slate-50 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Built for People Like&nbsp;You</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          Traditional banks don&apos;t understand gig income. We built this for you.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((p) => (
            <div
              key={p.title}
              className={`rounded-2xl border ${p.border} ${p.bg} p-6 text-left shadow-sm transition-transform hover:-translate-y-1`}
            >
              <div className="mb-3 text-4xl">{p.emoji}</div>
              <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const values = [
  {
    emoji: "\u2705",
    title: "No Credit Check",
    desc: "We look at your income, not your credit score.",
    bg: "bg-green-50",
  },
  {
    emoji: "\uD83D\uDCB5",
    title: "Up to $10,000",
    desc: "Get the cash you need to keep moving.",
    bg: "bg-blue-50",
  },
  {
    emoji: "\u23F1\uFE0F",
    title: "5-Minute Application",
    desc: "Seriously. Upload stubs, fill the form, done.",
    bg: "bg-amber-50",
  },
  {
    emoji: "\uD83D\uDCC4",
    title: "Built for 1099",
    desc: "Traditional banks don\u2019t get it. We do.",
    bg: "bg-purple-50",
  },
];

function WhyUs() {
  return (
    <section id="why-us" className="scroll-mt-16 bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Why Gig Workers Trust&nbsp;Us</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          We&apos;re not a traditional lender. We&apos;re built for the way you work.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className={`rounded-2xl ${v.bg} p-6 text-left shadow-sm`}>
              <div className="mb-3 text-4xl">{v.emoji}</div>
              <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const testimonials = [
  {
    quote: "I drive for Uber full-time and no bank would touch me. These guys funded me in 2 days.",
    name: "Marcus T.",
    role: "Rideshare Driver",
  },
  {
    quote: "As a DoorDash driver, my income looks weird on paper. They understood that.",
    name: "Sarah K.",
    role: "Delivery Partner",
  },
  {
    quote: "Finally someone who treats 1099 workers like real workers.",
    name: "James R.",
    role: "Freelancer",
  },
];

function Testimonials() {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Real Talk from Real Workers</h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white p-8 text-left shadow-md">
              {/* Stars */}
              <div className="mb-4 text-amber-400" aria-label="5 out of 5 stars">
                {"★★★★★"}
              </div>
              <p className="text-sm leading-relaxed text-slate-700 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5">
                <p className="text-sm font-bold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-400">Testimonials are illustrative.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-500 px-4 py-20 text-center text-white sm:py-28">
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Stop Stressing About&nbsp;Money?</h2>
        <p className="mt-4 text-lg text-white/90">
          Apply now &mdash; it takes less time than a DoorDash delivery.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/apply"
            className="rounded-full bg-orange-500 px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
          >
            Apply Now
          </Link>
          <Link href="/status" className="text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white transition-colors">
            Check Your Status
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-slate-900 px-4 py-14 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        {/* Brand */}
        <div>
          <span className="text-xl font-extrabold text-white">GigFund</span>
          <p className="mt-1 text-sm">Fast loans for the 1099 workforce.</p>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm">
          <Link href="/apply" className="hover:text-white transition-colors">Apply</Link>
          <Link href="/status" className="hover:text-white transition-colors">Check Status</Link>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
        <p>Not a bank. Loans subject to approval.</p>
        <p className="mt-1">&copy; 2026 GigFund. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <WhoWeHelp />
      <WhyUs />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </>
  );
}
