import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  GigFund – Full Marketing Homepage                                  */
/* ------------------------------------------------------------------ */

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            GigFund
          </span>
        </Link>

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

      <div className="relative mx-auto max-w-3xl">
        <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
          For the drivers, the dashers, the grinders
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Rent is due. Gas ain&apos;t free.
          <br />
          <span className="text-amber-300">We got you.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/90 sm:text-xl">
          You work 12-hour shifts, deal with traffic, bad tippers, and algorithm changes.
          The last thing you need is a bank telling you your income &ldquo;doesn&apos;t count.&rdquo;
          It counts here.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/apply"
            className="rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
          >
            Get Cash Now
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
            <span className="text-2xl font-extrabold text-white sm:text-3xl">Zero</span>
            <span>Credit Check</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function TrustBar() {
  const platforms = ["Uber", "Lyft", "DoorDash", "Instacart", "Fiverr", "Upwork", "Amazon Flex"];

  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-5 text-sm font-medium tracking-wide text-slate-400 uppercase">
          Built for workers on
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

function RealTalk() {
  return (
    <section className="bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Let&apos;s be real for a sec
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-red-50 border border-red-100 p-8">
            <h3 className="text-lg font-bold text-red-900">The struggle is real</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-red-800">
              <li className="flex gap-2"><span className="mt-0.5 text-red-400">x</span> Car broke down but you still gotta make rent</li>
              <li className="flex gap-2"><span className="mt-0.5 text-red-400">x</span> Slow week on the app and bills don&apos;t care</li>
              <li className="flex gap-2"><span className="mt-0.5 text-red-400">x</span> Banks say your income &ldquo;doesn&apos;t qualify&rdquo;</li>
              <li className="flex gap-2"><span className="mt-0.5 text-red-400">x</span> Payday loans charging 400% APR</li>
              <li className="flex gap-2"><span className="mt-0.5 text-red-400">x</span> You&apos;re one bad week away from falling behind</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8">
            <h3 className="text-lg font-bold text-emerald-900">How we show up for you</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-emerald-800">
              <li className="flex gap-2"><span className="mt-0.5 text-emerald-500 font-bold">&check;</span> Up to $10K based on your actual earnings</li>
              <li className="flex gap-2"><span className="mt-0.5 text-emerald-500 font-bold">&check;</span> We read your pay stubs, not your credit score</li>
              <li className="flex gap-2"><span className="mt-0.5 text-emerald-500 font-bold">&check;</span> Apply from your phone between rides</li>
              <li className="flex gap-2"><span className="mt-0.5 text-emerald-500 font-bold">&check;</span> Fair terms, no predatory nonsense</li>
              <li className="flex gap-2"><span className="mt-0.5 text-emerald-500 font-bold">&check;</span> Built by people who actually get the gig life</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const steps = [
  {
    num: 1,
    title: "Drop your pay stubs",
    desc: "Screenshot your earnings from the last 3 months. Uber statement, DoorDash summary, whatever you got. Takes 2 minutes.",
    color: "from-purple-500 to-blue-500",
    bg: "bg-purple-50",
    icon: (
      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "We check the numbers",
    desc: "No credit check. No invasive questions. We just look at what you earned and make sure the math works.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Cash hits your account",
    desc: "Approved? Done. No waiting around, no jumping through hoops. Money where you need it, when you need it.",
    color: "from-cyan-500 to-emerald-500",
    bg: "bg-emerald-50",
    icon: (
      <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-slate-50 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Dead simple. Three steps.</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">No paperwork avalanche. No 3-week wait. Just vibes and funding.</p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className={`relative rounded-2xl ${s.bg} p-8 text-left shadow-sm`}>
              <span
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${s.color} text-sm font-bold text-white shadow`}
              >
                {s.num}
              </span>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                {s.icon}
              </div>
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
    title: "Rideshare Drivers",
    desc: "Running Uber and Lyft back to back? Yeah, that's real income. Banks don't get it. We do.",
    bg: "bg-gradient-to-br from-purple-50 to-purple-100",
    border: "border-purple-200",
    accent: "bg-purple-500",
  },
  {
    title: "Delivery Drivers",
    desc: "DoorDash at lunch, Instacart at night, Amazon Flex on weekends. You're working harder than anyone. Let us help.",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    border: "border-blue-200",
    accent: "bg-blue-500",
  },
  {
    title: "Freelancers",
    desc: "Graphic design at 2am, writing copy between gigs. Your 1099 income is real and we treat it that way.",
    bg: "bg-gradient-to-br from-amber-50 to-amber-100",
    border: "border-amber-200",
    accent: "bg-amber-500",
  },
  {
    title: "Contractors",
    desc: "Plumbing, electrical, consulting — you run your own thing. When cash flow gets tight, we bridge the gap.",
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    accent: "bg-emerald-500",
  },
];

function WhoWeHelp() {
  return (
    <section id="who-we-help" className="scroll-mt-16 bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">You&apos;re not alone in this</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          Millions of gig workers deal with the same cash flow rollercoaster. We built GigFund for every single one of you.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((p) => (
            <div
              key={p.title}
              className={`rounded-2xl border ${p.border} ${p.bg} p-6 text-left shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md`}
            >
              <div className={`mb-4 h-1.5 w-12 rounded-full ${p.accent}`} />
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
    title: "No Credit Check",
    desc: "Your FICO score is irrelevant here. We care about what you earned, not what some algorithm thinks about you.",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    iconBg: "bg-emerald-100 text-emerald-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Up to $10,000",
    desc: "Enough to cover a car repair, catch up on rent, or just breathe for a minute. Real money for real life.",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    iconBg: "bg-blue-100 text-blue-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "5-Minute App",
    desc: "Apply between rides. Literally. Fill out the form, upload your stubs, and you're done before the next ping.",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    iconBg: "bg-amber-100 text-amber-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Built for 1099",
    desc: "We're not a bank pretending to care. We literally built this because the system wasn't working for gig workers.",
    bg: "bg-gradient-to-br from-purple-50 to-pink-50",
    iconBg: "bg-purple-100 text-purple-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

function WhyUs() {
  return (
    <section id="why-us" className="scroll-mt-16 bg-slate-50 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Why people actually fw us</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          No cap — we built something different.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className={`rounded-2xl ${v.bg} p-6 text-left shadow-sm`}>
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${v.iconBg}`}>
                {v.icon}
              </div>
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
    quote: "I drive Uber like 50 hours a week and Chase literally told me I don't have real income. GigFund looked at my stubs and funded me in 2 days. Insane.",
    name: "Marcus T.",
    role: "Rideshare Driver",
  },
  {
    quote: "Slow week on DoorDash + rent due = panic mode. Applied here on a Tuesday, had cash by Thursday. No weird credit check, no judgment.",
    name: "Sarah K.",
    role: "Delivery Driver",
  },
  {
    quote: "As a freelancer my income is up and down. Every bank treats me like I'm unemployed. These people actually understood my situation fr.",
    name: "James R.",
    role: "Freelance Designer",
  },
];

function Testimonials() {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Don&apos;t just take our word</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          Real stories from people who were tired of being ignored by traditional lenders.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white p-8 text-left shadow-md">
              <div className="mb-4 flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-blue-400 text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
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
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Stop stressing. Start applying.
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Takes less time than waiting for your next DoorDash order to come through. For real.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/apply"
            className="rounded-full bg-orange-500 px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
          >
            Get Funded Now
          </Link>
          <Link href="/status" className="text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white transition-colors">
            Already applied? Check your status
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
        <div>
          <span className="text-xl font-extrabold text-white">GigFund</span>
          <p className="mt-1 text-sm">Cash for the people who keep things moving.</p>
        </div>

        <div className="flex gap-8 text-sm">
          <Link href="/apply" className="hover:text-white transition-colors">Apply</Link>
          <Link href="/status" className="hover:text-white transition-colors">Check Status</Link>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
        <p>Not a bank. Loans subject to approval and verification of income.</p>
        <p className="mt-1">&copy; 2026 GigFund. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <RealTalk />
      <HowItWorks />
      <WhoWeHelp />
      <WhyUs />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </>
  );
}
