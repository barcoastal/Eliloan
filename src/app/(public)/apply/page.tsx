"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { usePlaidLink } from "react-plaid-link";
import { CheckCircle, Building2 } from "lucide-react";
import { submitApplication } from "@/actions/applications";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                           */
/* ------------------------------------------------------------------ */
const STEPS = ["Amount", "Your Info", "Platforms", "Identity", "Bank Link", "Documents", "Review"];
const LOAN_TERMS = [3, 6, 9, 12, 15, 18];

const GIG_PLATFORMS = [
  { id: "uber", label: "Uber", icon: "🚗" },
  { id: "lyft", label: "Lyft", icon: "🚘" },
  { id: "doordash", label: "DoorDash", icon: "🍔" },
  { id: "ubereats", label: "Uber Eats", icon: "🥡" },
  { id: "instacart", label: "Instacart", icon: "🛒" },
  { id: "grubhub", label: "Grubhub", icon: "🍕" },
  { id: "amazonflex", label: "Amazon Flex", icon: "📦" },
  { id: "postmates", label: "Postmates", icon: "📬" },
  { id: "taskrabbit", label: "TaskRabbit", icon: "🔧" },
  { id: "fiverr", label: "Fiverr", icon: "💼" },
  { id: "upwork", label: "Upwork", icon: "💻" },
  { id: "shipt", label: "Shipt", icon: "🏪" },
  { id: "gopuff", label: "Gopuff", icon: "⚡" },
  { id: "spark", label: "Walmart Spark", icon: "🏬" },
];
const MIN_AMOUNT = 500;
const MAX_AMOUNT = 10000;
const STEP_SIZE = 100;
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, "Enter a valid SSN (XXX-XX-XXXX)"),
  loanAmount: z.number().positive("Loan amount must be positive"),
});

/* ------------------------------------------------------------------ */
/*  NAVBAR (same as homepage)                                           */
/* ------------------------------------------------------------------ */
function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-[#FAFAF7]/90 backdrop-blur-xl border-b border-emerald-900/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="text-2xl font-bold tracking-[-0.03em] text-emerald-900">
          Elilons
        </Link>
        <Link
          href="/status"
          className="text-[13px] font-medium text-emerald-800/60 transition-colors hover:text-emerald-900"
        >
          Check Status
        </Link>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP INDICATOR                                                      */
/* ------------------------------------------------------------------ */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-3">
            {i > 0 && (
              <div
                className={`h-[2px] w-6 sm:w-10 rounded-full transition-colors duration-500 ${
                  done ? "bg-emerald-500" : "bg-emerald-900/8"
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-500 ${
                  done
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 scale-110"
                    : "bg-emerald-900/5 text-emerald-800/30"
                }`}
              >
                {done ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`hidden text-[12px] font-medium sm:block transition-colors duration-300 ${
                  active ? "text-emerald-900" : done ? "text-emerald-600" : "text-emerald-800/30"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 1 — LOAN AMOUNT                                               */
/* ------------------------------------------------------------------ */
function StepAmount({
  amount,
  setAmount,
  loanTermMonths,
  setLoanTermMonths,
  onNext,
}: {
  amount: number;
  setAmount: (v: number) => void;
  loanTermMonths: number;
  setLoanTermMonths: (v: number) => void;
  onNext: () => void;
}) {
  const presets = [1000, 2500, 5000, 7500, 10000];
  const pct = ((amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[12px] font-semibold text-emerald-600">Step 1 of 7</span>
      </div>

      <h2 className="mt-4 text-center text-3xl font-bold tracking-[-0.03em] text-emerald-950 sm:text-4xl">
        How much do you need?
      </h2>
      <p className="mt-3 text-center text-base text-emerald-800/60">
        Choose your loan amount. Up to $10,000 for 1099 workers.
      </p>

      {/* Big amount display */}
      <div className="mt-10 mb-8 text-center">
        <div className="relative inline-block">
          <span className="absolute -left-6 top-3 text-2xl font-bold text-emerald-600/40">$</span>
          <motion.span
            key={amount}
            className="text-7xl font-bold tracking-[-0.04em] text-emerald-900 sm:text-8xl"
            initial={{ scale: 1.05, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {amount.toLocaleString()}
          </motion.span>
        </div>
      </div>

      {/* Custom range slider */}
      <div className="w-full max-w-md px-2">
        <div className="relative h-3 w-full">
          {/* Track bg */}
          <div className="absolute inset-0 rounded-full bg-emerald-100" />
          {/* Track fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
            style={{ width: `${pct}%` }}
            layout
            transition={{ duration: 0.1 }}
          />
          {/* Thumb glow */}
          <motion.div
            className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20"
            style={{ left: `${pct}%` }}
            layout
            transition={{ duration: 0.1 }}
          />
          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-emerald-500 bg-white shadow-lg shadow-emerald-500/20"
            style={{ left: `${pct}%` }}
            layout
            transition={{ duration: 0.1 }}
          />
          {/* Invisible range input on top */}
          <input
            type="range"
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            step={STEP_SIZE}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="absolute inset-0 w-full cursor-pointer opacity-0"
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-medium text-emerald-800/35">
          <span>${MIN_AMOUNT.toLocaleString()}</span>
          <span>${MAX_AMOUNT.toLocaleString()}</span>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(p)}
            className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-200 ${
              amount === p
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                : "border border-emerald-900/10 bg-white text-emerald-800/60 hover:border-emerald-500/30 hover:text-emerald-700"
            }`}
          >
            ${p.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Loan term selector */}
      <div className="mt-10 w-full max-w-md">
        <p className="mb-3 text-center text-[14px] font-medium text-emerald-800/70">
          Repayment Term
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {LOAN_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setLoanTermMonths(term)}
              className={`rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                loanTermMonths === term
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                  : "border border-emerald-900/10 bg-white text-emerald-800/60 hover:border-emerald-500/30 hover:text-emerald-700"
              }`}
            >
              {term}mo
            </button>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="mt-10 flex items-start gap-3 rounded-2xl bg-emerald-50/80 px-5 py-4 max-w-md">
        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[13px] leading-relaxed text-emerald-800/60">
          No credit check required. Your approval is based on your gig earnings from the last 3 months.
        </p>
      </div>

      {/* Next button */}
      <motion.button
        type="button"
        onClick={onNext}
        className="mt-10 group rounded-full bg-emerald-600 px-10 py-4 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-105"
        whileTap={{ scale: 0.97 }}
      >
        Continue
        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
      </motion.button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 2 — PERSONAL INFO                                             */
/* ------------------------------------------------------------------ */
function StepInfo({
  form,
  setForm,
  errors,
  onNext,
  onBack,
}: {
  form: { firstName: string; lastName: string; email: string; phone: string; ssn: string };
  setForm: (f: { firstName: string; lastName: string; email: string; phone: string; ssn: string }) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}) {
  const [showSsn, setShowSsn] = useState(false);

  const formatSsn = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-emerald-900 placeholder:text-emerald-800/25 outline-none transition-all duration-200 ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-emerald-900/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[12px] font-semibold text-emerald-600">Step 2 of 7</span>
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-emerald-950">
        Tell us about yourself
      </h2>
      <p className="mt-2 text-base text-emerald-800/60">
        Basic info so we can process your application.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-emerald-800/70">First Name</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Marcus"
              className={inputClass("firstName")}
            />
            {errors.firstName && <p className="mt-1 text-[12px] text-red-500">{errors.firstName}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-emerald-800/70">Last Name</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Thompson"
              className={inputClass("lastName")}
            />
            {errors.lastName && <p className="mt-1 text-[12px] text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-emerald-800/70">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="marcus@gmail.com"
            className={inputClass("email")}
          />
          {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-emerald-800/70">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(555) 123-4567"
            className={inputClass("phone")}
          />
          {errors.phone && <p className="mt-1 text-[12px] text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-emerald-800/70">
            Social Security Number (SSN)
          </label>
          <div className="relative">
            <input
              type={showSsn ? "text" : "password"}
              value={form.ssn}
              onChange={(e) => setForm({ ...form, ssn: formatSsn(e.target.value) })}
              placeholder="XXX-XX-XXXX"
              maxLength={11}
              className={inputClass("ssn") + " pr-12"}
            />
            <button
              type="button"
              onClick={() => setShowSsn(!showSsn)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-800/30 hover:text-emerald-800/60 transition-colors"
            >
              {showSsn ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {errors.ssn && <p className="mt-1 text-[12px] text-red-500">{errors.ssn}</p>}
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50/80 px-3 py-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-[11px] leading-relaxed text-amber-800/60">
              Your SSN is encrypted and only used for identity verification. We never share it.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-emerald-900/10 bg-white px-6 py-3.5 text-[14px] font-medium text-emerald-800/60 transition-all hover:border-emerald-900/20 hover:text-emerald-900"
        >
          &larr; Back
        </button>
        <motion.button
          type="button"
          onClick={onNext}
          className="group flex-1 rounded-full bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02]"
          whileTap={{ scale: 0.97 }}
        >
          Continue
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 3 — GIG PLATFORMS & EARNINGS                                   */
/* ------------------------------------------------------------------ */
function StepPlatforms({
  platforms,
  setPlatforms,
  otherPlatform,
  setOtherPlatform,
  weeklyEarnings,
  setWeeklyEarnings,
  onNext,
  onBack,
}: {
  platforms: string[];
  setPlatforms: (p: string[]) => void;
  otherPlatform: string;
  setOtherPlatform: (v: string) => void;
  weeklyEarnings: string;
  setWeeklyEarnings: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const togglePlatform = (id: string) => {
    setPlatforms(
      platforms.includes(id) ? platforms.filter((p) => p !== id) : [...platforms, id]
    );
  };

  const hasOther = platforms.includes("other");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[12px] font-semibold text-emerald-600">Step 3 of 7</span>
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-emerald-950">
        Where do you earn?
      </h2>
      <p className="mt-2 text-base text-emerald-800/60">
        Select the platforms you work on. Pick all that apply.
      </p>

      {/* Platform grid */}
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {GIG_PLATFORMS.map((p) => {
          const selected = platforms.includes(p.id);
          return (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => togglePlatform(p.id)}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                selected
                  ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-500/10"
                  : "border-emerald-900/8 bg-white hover:border-emerald-500/30"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-lg">{p.icon}</span>
              <span
                className={`text-[13px] font-medium transition-colors ${
                  selected ? "text-emerald-800" : "text-emerald-800/50"
                }`}
              >
                {p.label}
              </span>
              {selected && (
                <motion.div
                  className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}

        {/* Other option */}
        <motion.button
          type="button"
          onClick={() => togglePlatform("other")}
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
            hasOther
              ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-500/10"
              : "border-emerald-900/8 bg-white hover:border-emerald-500/30"
          }`}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-lg">+</span>
          <span
            className={`text-[13px] font-medium transition-colors ${
              hasOther ? "text-emerald-800" : "text-emerald-800/50"
            }`}
          >
            Other
          </span>
          {hasOther && (
            <motion.div
              className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Other platform text input */}
      {hasOther && (
        <motion.div
          className="mt-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          <input
            value={otherPlatform}
            onChange={(e) => setOtherPlatform(e.target.value)}
            placeholder="Enter platform name..."
            className="w-full rounded-xl border border-emerald-900/10 bg-white px-4 py-3.5 text-[15px] text-emerald-900 placeholder:text-emerald-800/25 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </motion.div>
      )}

      {/* Selected count */}
      {platforms.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[13px] font-medium text-emerald-800/60">
            {platforms.length} platform{platforms.length !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {/* Average weekly earnings */}
      <div className="mt-8">
        <label className="mb-1.5 block text-[13px] font-medium text-emerald-800/70">
          Average weekly earnings (past 12 months)
        </label>
        <p className="mb-3 text-[12px] text-emerald-800/40">
          Your best estimate across all platforms combined.
        </p>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-emerald-800/30">$</span>
          <input
            type="number"
            min="0"
            step="50"
            value={weeklyEarnings}
            onChange={(e) => setWeeklyEarnings(e.target.value)}
            placeholder="800"
            className="w-full rounded-xl border border-emerald-900/10 bg-white pl-8 pr-24 py-3.5 text-[15px] text-emerald-900 placeholder:text-emerald-800/25 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-emerald-800/30">/ week</span>
        </div>
        {weeklyEarnings && Number(weeklyEarnings) > 0 && (
          <motion.p
            className="mt-2 text-[12px] text-emerald-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            That&apos;s ~${(Number(weeklyEarnings) * 4.33).toLocaleString(undefined, { maximumFractionDigits: 0 })}/month or ~${(Number(weeklyEarnings) * 52).toLocaleString(undefined, { maximumFractionDigits: 0 })}/year
          </motion.p>
        )}
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-emerald-900/10 bg-white px-6 py-3.5 text-[14px] font-medium text-emerald-800/60 transition-all hover:border-emerald-900/20 hover:text-emerald-900"
        >
          &larr; Back
        </button>
        <motion.button
          type="button"
          onClick={() => {
            if (platforms.length === 0) {
              toast.error("Select at least one platform");
              return;
            }
            if (hasOther && !otherPlatform.trim()) {
              toast.error("Please enter your platform name");
              return;
            }
            if (!weeklyEarnings || Number(weeklyEarnings) <= 0) {
              toast.error("Enter your average weekly earnings");
              return;
            }
            onNext();
          }}
          className="group flex-1 rounded-full bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02]"
          whileTap={{ scale: 0.97 }}
        >
          Continue
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 4 — IDENTITY (Photo ID + Bank Statement)                      */
/* ------------------------------------------------------------------ */
function StepIdentity({
  photoId,
  setPhotoId,
  bankStatement,
  setBankStatement,
  onNext,
  onBack,
}: {
  photoId: File | null;
  setPhotoId: (f: File | null) => void;
  bankStatement: File | null;
  setBankStatement: (f: File | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const idInputRef = useRef<HTMLInputElement>(null);
  const bankInputRef = useRef<HTMLInputElement>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const handleIdSelect = (file: File) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error("Photo ID must be an image (PNG or JPEG)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB.");
      return;
    }
    setPhotoId(file);
    const reader = new FileReader();
    reader.onload = (e) => setIdPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleBankSelect = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Bank statement must be PDF, PNG, or JPEG");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB.");
      return;
    }
    setBankStatement(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[12px] font-semibold text-emerald-600">Step 4 of 7</span>
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-emerald-950">
        Verify your identity
      </h2>
      <p className="mt-2 text-base text-emerald-800/60">
        Upload a government-issued photo ID and a recent bank statement.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {/* Photo ID Upload */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-[13px] font-medium text-emerald-800/70">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
            Photo ID
            <span className="text-red-400">*</span>
          </label>
          <p className="mb-3 text-[12px] text-emerald-800/40">
            Driver&apos;s license, state ID, or passport. Must show your full name and photo clearly.
          </p>

          {photoId && idPreview ? (
            <div className="relative rounded-2xl border border-emerald-200 bg-white overflow-hidden">
              <img src={idPreview} alt="ID preview" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-[12px] font-medium text-white truncate max-w-[200px]">{photoId.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setPhotoId(null); setIdPreview(null); }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-white/30 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => idInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-emerald-900/10 bg-white p-8 transition-all hover:border-emerald-500/30 hover:bg-emerald-50/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[14px] font-medium text-emerald-900">
                  Take a photo or <span className="text-emerald-600">upload your ID</span>
                </p>
                <p className="mt-1 text-[12px] text-emerald-800/40">PNG or JPEG, max 10MB</p>
              </div>
            </button>
          )}
          <input
            ref={idInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleIdSelect(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>

        {/* Bank Statement Upload */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-[13px] font-medium text-emerald-800/70">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
            Bank Statement
            <span className="text-red-400">*</span>
          </label>
          <p className="mb-3 text-[12px] text-emerald-800/40">
            Most recent bank statement (last 30 days) showing your name and account activity.
          </p>

          {bankStatement ? (
            <motion.div
              className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium text-emerald-900">{bankStatement.name}</p>
                <p className="text-[11px] text-emerald-800/40">{(bankStatement.size / 1024).toFixed(0)} KB</p>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setBankStatement(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-800/30 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={() => bankInputRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-emerald-900/10 bg-white px-6 py-5 transition-all hover:border-emerald-500/30 hover:bg-emerald-50/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[14px] font-medium text-emerald-900">
                  Upload bank statement
                </p>
                <p className="text-[12px] text-emerald-800/40">PDF, PNG, or JPEG</p>
              </div>
            </button>
          )}
          <input
            ref={bankInputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleBankSelect(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Security note */}
      <div className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-50/80 px-4 py-3">
        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <p className="text-[11px] leading-relaxed text-emerald-800/55">
          Your documents are verified automatically and encrypted with bank-level security. We check that IDs are genuine government-issued documents.
        </p>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-emerald-900/10 bg-white px-6 py-3.5 text-[14px] font-medium text-emerald-800/60 transition-all hover:border-emerald-900/20 hover:text-emerald-900"
        >
          &larr; Back
        </button>
        <motion.button
          type="button"
          onClick={() => {
            if (!photoId) { toast.error("Please upload your photo ID"); return; }
            if (!bankStatement) { toast.error("Please upload your bank statement"); return; }
            onNext();
          }}
          className="group flex-1 rounded-full bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02]"
          whileTap={{ scale: 0.97 }}
        >
          Continue
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 5 — PLAID BANK LINK                                           */
/* ------------------------------------------------------------------ */
function StepPlaidLink({
  plaidAccessToken,
  plaidAccountId,
  plaidItemId,
  setPlaidData,
  onNext,
  onBack,
}: {
  plaidAccessToken: string | null;
  plaidAccountId: string | null;
  plaidItemId: string | null;
  setPlaidData: (data: { accessToken: string; accountId: string; itemId: string }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const linked = !!(plaidAccessToken && plaidAccountId && plaidItemId);

  useEffect(() => {
    if (linked) return;
    const fetchToken = async () => {
      try {
        setLoading(true);
        const tempId = crypto.randomUUID();
        const res = await fetch("/api/plaid/create-link-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: tempId }),
        });
        if (!res.ok) throw new Error("Failed to create link token");
        const data = await res.json();
        setLinkToken(data.linkToken);
      } catch (err) {
        toast.error("Could not initialize bank connection. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, [linked]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        setLoading(true);
        const res = await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicToken,
            accountId: metadata.accounts[0]?.id,
          }),
        });
        if (!res.ok) throw new Error("Failed to link bank account");
        const data = await res.json();
        setPlaidData({
          accessToken: data.accessToken,
          accountId: data.accountId,
          itemId: data.itemId,
        });
        toast.success("Bank account linked successfully!");
      } catch (err) {
        toast.error("Failed to link bank account. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onExit: () => {},
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[12px] font-semibold text-emerald-600">Step 5 of 7</span>
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-emerald-950">
        Link your bank account
      </h2>
      <p className="mt-2 text-base text-emerald-800/60">
        Securely connect your bank account so we can verify your income and set up disbursement.
      </p>

      <div className="mt-8">
        {linked ? (
          <motion.div
            className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold text-emerald-900">Bank Account Linked</p>
              <p className="mt-1 text-[13px] text-emerald-800/60">
                Your bank account has been securely connected.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-emerald-900/10 bg-white p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <Building2 className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-medium text-emerald-900">
                Connect with Plaid
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-emerald-800/50">
                We use Plaid to securely connect to your bank. Your credentials are never shared with us directly.
              </p>
            </div>
            <motion.button
              type="button"
              onClick={() => open()}
              disabled={!ready || loading}
              className="w-full rounded-full bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              whileTap={!ready || loading ? {} : { scale: 0.97 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connecting...
                </span>
              ) : (
                <>
                  <Building2 className="mr-2 inline h-4 w-4" />
                  Link Bank Account
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-50/80 px-4 py-3">
        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <p className="text-[11px] leading-relaxed text-emerald-800/55">
          Plaid uses bank-level encryption. We never see your bank login credentials and cannot make transactions on your behalf.
        </p>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-emerald-900/10 bg-white px-6 py-3.5 text-[14px] font-medium text-emerald-800/60 transition-all hover:border-emerald-900/20 hover:text-emerald-900"
        >
          &larr; Back
        </button>
        <motion.button
          type="button"
          onClick={() => {
            if (!linked) {
              toast.error("Please link your bank account to continue");
              return;
            }
            onNext();
          }}
          className="group flex-1 rounded-full bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02]"
          whileTap={{ scale: 0.97 }}
        >
          Continue
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 6 — PAY STUBS UPLOAD                                          */
/* ------------------------------------------------------------------ */
function StepUpload({
  files,
  addFiles,
  removeFile,
  onNext,
  onBack,
}: {
  files: File[];
  addFiles: (f: FileList | File[]) => void;
  removeFile: (i: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[12px] font-semibold text-emerald-600">Step 6 of 7</span>
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-emerald-950">
        Upload your pay stubs
      </h2>
      <p className="mt-2 text-base text-emerald-800/60">
        We need at least 3 recent pay stubs from your gig platforms.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-8 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-all duration-300 ${
          dragOver
            ? "border-emerald-500 bg-emerald-50 scale-[1.01]"
            : "border-emerald-900/10 bg-white hover:border-emerald-500/30 hover:bg-emerald-50/50"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[14px] font-medium text-emerald-900">
            Drop files here or <span className="text-emerald-600">browse</span>
          </p>
          <p className="mt-1 text-[12px] text-emerald-800/40">
            PDF, PNG, or JPEG - screenshots of your Uber, DoorDash, Lyft earnings
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* File count badge */}
      <div className="mt-4 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${files.length >= 3 ? "bg-emerald-500" : "bg-amber-400"}`} />
        <span className="text-[13px] font-medium text-emerald-800/60">
          {files.length} of 3 minimum uploaded
        </span>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file, i) => (
            <motion.li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-emerald-900/5 bg-white px-4 py-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium text-emerald-900">{file.name}</p>
                <p className="text-[11px] text-emerald-800/40">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-800/30 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-emerald-900/10 bg-white px-6 py-3.5 text-[14px] font-medium text-emerald-800/60 transition-all hover:border-emerald-900/20 hover:text-emerald-900"
        >
          &larr; Back
        </button>
        <motion.button
          type="button"
          onClick={() => {
            if (files.length < 3) {
              toast.error("Upload at least 3 pay stubs to continue");
              return;
            }
            onNext();
          }}
          className="group flex-1 rounded-full bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02]"
          whileTap={{ scale: 0.97 }}
        >
          Continue
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 5 — REVIEW & SUBMIT                                           */
/* ------------------------------------------------------------------ */
function StepReview({
  amount,
  loanTermMonths,
  form,
  files,
  photoId,
  bankStatement,
  platforms,
  otherPlatform,
  weeklyEarnings,
  bankLinked,
  submitting,
  uploadProgress,
  onBack,
  onSubmit,
}: {
  amount: number;
  loanTermMonths: number;
  form: { firstName: string; lastName: string; email: string; phone: string; ssn: string };
  files: File[];
  photoId: File | null;
  bankStatement: File | null;
  platforms: string[];
  otherPlatform: string;
  weeklyEarnings: string;
  bankLinked: boolean;
  submitting: boolean;
  uploadProgress: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const maskedSsn = form.ssn ? `***-**-${form.ssn.slice(-4)}` : "";
  const totalDocs = files.length + (photoId ? 1 : 0) + (bankStatement ? 1 : 0);
  const platformLabels = platforms
    .map((id) => {
      if (id === "other") return otherPlatform || "Other";
      return GIG_PLATFORMS.find((p) => p.id === id)?.label || id;
    })
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[12px] font-semibold text-emerald-600">Step 7 of 7</span>
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-emerald-950">
        Review & submit
      </h2>
      <p className="mt-2 text-base text-emerald-800/60">
        Double check everything looks right before submitting.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {/* Amount card */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] font-medium text-emerald-600">Loan Amount</p>
              <p className="mt-1 text-4xl font-bold tracking-[-0.03em] text-emerald-900">
                ${amount.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-medium text-emerald-600">Repayment Term</p>
              <p className="mt-1 text-[18px] font-bold text-emerald-900">{loanTermMonths} months</p>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="rounded-2xl border border-emerald-900/5 bg-white p-6">
          <p className="mb-4 text-[12px] font-medium text-emerald-600">Your Information</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Name", value: `${form.firstName} ${form.lastName}` },
              { label: "Email", value: form.email },
              { label: "Phone", value: form.phone },
              { label: "SSN", value: maskedSsn },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] text-emerald-800/40">{item.label}</p>
                <p className="mt-0.5 text-[14px] font-medium text-emerald-900 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms & Earnings card */}
        <div className="rounded-2xl border border-emerald-900/5 bg-white p-6">
          <p className="mb-4 text-[12px] font-medium text-emerald-600">Gig Platforms & Earnings</p>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[11px] text-emerald-800/40">Platforms</p>
              <p className="mt-0.5 text-[14px] font-medium text-emerald-900">{platformLabels}</p>
            </div>
            <div>
              <p className="text-[11px] text-emerald-800/40">Avg. Weekly Earnings</p>
              <p className="mt-0.5 text-[14px] font-medium text-emerald-900">
                ${Number(weeklyEarnings).toLocaleString()}/week (~${(Number(weeklyEarnings) * 52).toLocaleString()}/year)
              </p>
            </div>
          </div>
        </div>

        {/* Documents card */}
        <div className="rounded-2xl border border-emerald-900/5 bg-white p-6">
          <p className="mb-4 text-[12px] font-medium text-emerald-600">Documents ({totalDocs} files)</p>
          <div className="flex flex-col gap-2">
            {photoId && (
              <div className="flex items-center gap-2 text-[13px]">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-800/60">Photo ID:</span>
                <span className="font-medium text-emerald-900 truncate">{photoId.name}</span>
              </div>
            )}
            {bankStatement && (
              <div className="flex items-center gap-2 text-[13px]">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-800/60">Bank Statement:</span>
                <span className="font-medium text-emerald-900 truncate">{bankStatement.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-[13px]">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-800/60">Pay Stubs:</span>
              <span className="font-medium text-emerald-900">{files.length} file{files.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Bank link card */}
        <div className="rounded-2xl border border-emerald-900/5 bg-white p-6">
          <p className="mb-4 text-[12px] font-medium text-emerald-600">Bank Account</p>
          <div className="flex items-center gap-2 text-[13px]">
            <div className={`h-1.5 w-1.5 rounded-full ${bankLinked ? "bg-emerald-500" : "bg-amber-400"}`} />
            <span className="font-medium text-emerald-900">
              {bankLinked ? "Bank account linked via Plaid" : "Not linked"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-full border border-emerald-900/10 bg-white px-6 py-3.5 text-[14px] font-medium text-emerald-800/60 transition-all hover:border-emerald-900/20 hover:text-emerald-900 disabled:opacity-50"
        >
          &larr; Back
        </button>
        <motion.button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="group flex-1 rounded-full bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          whileTap={submitting ? {} : { scale: 0.97 }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {uploadProgress ? "Uploading files..." : "Submitting..."}
            </span>
          ) : (
            <>
              Submit Application
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  SUCCESS SCREEN                                                      */
/* ------------------------------------------------------------------ */
function SuccessScreen({ code }: { code: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </motion.div>

      <h2 className="mt-6 text-3xl font-bold tracking-[-0.03em] text-emerald-950 sm:text-4xl">
        You&apos;re all set!
      </h2>
      <p className="mt-3 max-w-sm text-base text-emerald-800/60">
        Your application has been submitted. Save this code to check your status.
      </p>

      <motion.div
        className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 px-10 py-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-[11px] font-medium text-emerald-600 mb-2">Application Code</p>
        <p className="text-4xl font-mono font-bold tracking-[0.15em] text-emerald-900">{code}</p>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href={`/status/${code}`}
          className="group rounded-full bg-emerald-600 px-8 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-105"
        >
          Check Status
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
        </Link>
        <Link
          href="/"
          className="rounded-full border border-emerald-900/10 bg-white px-8 py-3.5 text-[14px] font-medium text-emerald-800/60 transition-all hover:text-emerald-900"
        >
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                           */
/* ------------------------------------------------------------------ */
export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [loanAmount, setLoanAmount] = useState(5000);
  const [loanTermMonths, setLoanTermMonths] = useState(6);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", ssn: "" });
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [otherPlatform, setOtherPlatform] = useState("");
  const [weeklyEarnings, setWeeklyEarnings] = useState("");
  const [photoId, setPhotoId] = useState<File | null>(null);
  const [bankStatement, setBankStatement] = useState<File | null>(null);
  const [plaidAccessToken, setPlaidAccessToken] = useState<string | null>(null);
  const [plaidAccountId, setPlaidAccountId] = useState<string | null>(null);
  const [plaidItemId, setPlaidItemId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [applicationCode, setApplicationCode] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const valid: File[] = [];
    for (const file of Array.from(newFiles)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Allowed: PDF, PNG, JPEG`);
        continue;
      }
      valid.push(file);
    }
    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const validateStep2 = () => {
    const parsed = formSchema.safeParse({
      ...form,
      loanAmount,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key && key !== "loanAmount") fieldErrors[String(key)] = issue.message;
      }
      setErrors(fieldErrors);
      return Object.keys(fieldErrors).length === 0;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setUploadProgress(true);

    try {
      // Upload all files together: pay stubs + photo ID + bank statement
      const formData = new FormData();
      for (const file of files) formData.append("files", file);
      if (photoId) formData.append("files", photoId);
      if (bankStatement) formData.append("files", bankStatement);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const uploadData = await uploadRes.json();
      setUploadProgress(false);

      const result = await submitApplication({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        loanAmount,
        loanTermMonths,
        platform: platforms.join(", "),
        ssnRaw: form.ssn,
        plaidAccessToken: plaidAccessToken ?? undefined,
        plaidAccountId: plaidAccountId ?? undefined,
        plaidItemId: plaidItemId ?? undefined,
        files: uploadData.files,
      });

      if (result.error) throw new Error(result.error);
      if (result.applicationCode) setApplicationCode(result.applicationCode);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
      setUploadProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-28 sm:px-10">
        {!applicationCode && <StepIndicator current={step} />}

        <div className="mt-12 flex justify-center">
          <AnimatePresence mode="wait">
            {applicationCode ? (
              <SuccessScreen key="success" code={applicationCode} />
            ) : step === 0 ? (
              <StepAmount
                key="amount"
                amount={loanAmount}
                setAmount={setLoanAmount}
                loanTermMonths={loanTermMonths}
                setLoanTermMonths={setLoanTermMonths}
                onNext={() => setStep(1)}
              />
            ) : step === 1 ? (
              <StepInfo
                key="info"
                form={form}
                setForm={setForm}
                errors={errors}
                onNext={() => {
                  if (validateStep2()) setStep(2);
                }}
                onBack={() => setStep(0)}
              />
            ) : step === 2 ? (
              <StepPlatforms
                key="platforms"
                platforms={platforms}
                setPlatforms={setPlatforms}
                otherPlatform={otherPlatform}
                setOtherPlatform={setOtherPlatform}
                weeklyEarnings={weeklyEarnings}
                setWeeklyEarnings={setWeeklyEarnings}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            ) : step === 3 ? (
              <StepIdentity
                key="identity"
                photoId={photoId}
                setPhotoId={setPhotoId}
                bankStatement={bankStatement}
                setBankStatement={setBankStatement}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            ) : step === 4 ? (
              <StepPlaidLink
                key="plaid"
                plaidAccessToken={plaidAccessToken}
                plaidAccountId={plaidAccountId}
                plaidItemId={plaidItemId}
                setPlaidData={({ accessToken, accountId, itemId }) => {
                  setPlaidAccessToken(accessToken);
                  setPlaidAccountId(accountId);
                  setPlaidItemId(itemId);
                }}
                onNext={() => setStep(5)}
                onBack={() => setStep(3)}
              />
            ) : step === 5 ? (
              <StepUpload
                key="upload"
                files={files}
                addFiles={addFiles}
                removeFile={removeFile}
                onNext={() => setStep(6)}
                onBack={() => setStep(4)}
              />
            ) : (
              <StepReview
                key="review"
                amount={loanAmount}
                loanTermMonths={loanTermMonths}
                form={form}
                files={files}
                photoId={photoId}
                bankStatement={bankStatement}
                platforms={platforms}
                otherPlatform={otherPlatform}
                weeklyEarnings={weeklyEarnings}
                bankLinked={!!(plaidAccessToken && plaidAccountId && plaidItemId)}
                submitting={submitting}
                uploadProgress={uploadProgress}
                onBack={() => setStep(5)}
                onSubmit={handleSubmit}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
