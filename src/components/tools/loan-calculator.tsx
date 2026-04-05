"use client";

import { useState } from "react";
import Link from "next/link";

function calculatePayment(principal: number, annualRate: number, months: number) {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  const payment = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return payment;
}

export function LoanCalculator() {
  const [amount, setAmount] = useState(5000);
  const [months, setMonths] = useState(12);
  const [apr, setApr] = useState(36);

  const monthly = calculatePayment(amount, apr, months);
  const total = monthly * months;
  const interest = total - amount;

  return (
    <div className="bg-white rounded-[10px] p-6 md:p-8 border border-[#e4e4e7]">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[13px] font-medium text-[#1a1a1a]">Loan Amount</label>
              <span className="text-[16px] font-extrabold text-[#15803d]">${amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              className="w-full accent-[#15803d]"
            />
            <div className="flex justify-between text-[11px] text-[#a1a1aa] mt-1">
              <span>$500</span>
              <span>$10,000</span>
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#1a1a1a] mb-2 block">Term</label>
            <div className="grid grid-cols-6 gap-1">
              {[3, 6, 9, 12, 15, 18].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`py-2 rounded-lg text-[12px] font-medium transition-colors ${
                    months === m
                      ? "bg-[#15803d] text-white"
                      : "bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7]"
                  }`}
                >
                  {m}mo
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[13px] font-medium text-[#1a1a1a]">APR</label>
              <span className="text-[16px] font-extrabold text-[#15803d]">{apr}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={60}
              step={1}
              value={apr}
              onChange={(e) => setApr(+e.target.value)}
              className="w-full accent-[#15803d]"
            />
            <div className="flex justify-between text-[11px] text-[#a1a1aa] mt-1">
              <span>30%</span>
              <span>60%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#f0f5f0] rounded-[10px] p-6 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.05em] text-[#71717a]">Monthly Payment</p>
            <p className="text-[42px] font-extrabold tracking-[-0.03em] text-[#1a1a1a]">
              ${monthly.toFixed(2)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.05em] text-[#71717a]">Total Interest</p>
              <p className="text-[18px] font-bold text-[#1a1a1a]">${interest.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.05em] text-[#71717a]">Total Cost</p>
              <p className="text-[18px] font-bold text-[#1a1a1a]">${total.toFixed(0)}</p>
            </div>
          </div>
          <Link
            href="/apply"
            className="mt-6 bg-[#15803d] text-white text-center text-[13px] font-medium py-3 rounded-lg hover:bg-[#166534] transition-colors"
          >
            Apply for This Loan
          </Link>
        </div>
      </div>
    </div>
  );
}
