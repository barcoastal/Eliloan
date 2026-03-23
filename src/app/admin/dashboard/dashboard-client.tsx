"use client";

import { useState } from "react";
import { ApplicationTable } from "@/components/application-table";
import type { ApplicationWithDocuments } from "@/types";

const statuses = [
  "ALL", "PENDING", "APPROVED", "REJECTED",
  "ACTIVE", "LATE", "COLLECTIONS", "DEFAULTED", "PAID_OFF",
] as const;

const statusLabels: Record<string, string> = {
  ALL: "All",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ACTIVE: "Active",
  LATE: "Late",
  COLLECTIONS: "Collections",
  DEFAULTED: "Defaulted",
  PAID_OFF: "Paid Off",
};

export function DashboardClient({
  applications,
}: {
  applications: ApplicationWithDocuments[];
}) {
  const [activeStatus, setActiveStatus] = useState<string>("ALL");

  const counts: Record<string, number> = {
    ALL: applications.length,
    PENDING: applications.filter((a) => a.status === "PENDING").length,
    APPROVED: applications.filter((a) => a.status === "APPROVED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
    ACTIVE: applications.filter((a) => a.status === "ACTIVE").length,
    LATE: applications.filter((a) => a.status === "LATE").length,
    COLLECTIONS: applications.filter((a) => a.status === "COLLECTIONS").length,
    DEFAULTED: applications.filter((a) => a.status === "DEFAULTED").length,
    PAID_OFF: applications.filter((a) => a.status === "PAID_OFF").length,
  };

  const filtered =
    activeStatus === "ALL"
      ? applications
      : applications.filter((a) => a.status === activeStatus);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-950">
          Applications
        </h1>
        <p className="text-sm text-emerald-800/60 mt-1">
          Review and manage incoming loan applications
        </p>
      </div>

      {/* Stats row — first row: core statuses */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Total</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.ALL}</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.PENDING}</p>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Approved</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.APPROVED}</p>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Rejected</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.REJECTED}</p>
        </div>
      </div>

      {/* Stats row — second row: lifecycle statuses */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Active */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Active</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.ACTIVE}</p>
        </div>

        {/* Late */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Late</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.LATE}</p>
        </div>

        {/* Collections */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Collections</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.COLLECTIONS}</p>
        </div>

        {/* Defaulted */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Defaulted</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.DEFAULTED}</p>
        </div>

        {/* Paid Off */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Paid Off</span>
          </div>
          <p className="text-3xl font-semibold text-emerald-950">{counts.PAID_OFF}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-150
              ${
                activeStatus === status
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "bg-white text-stone-500 border border-stone-200/80 hover:border-stone-300 hover:text-stone-700"
              }
            `}
          >
            {statusLabels[status]}
            <span
              className={`
                text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                ${
                  activeStatus === status
                    ? "bg-white/20 text-white"
                    : "bg-stone-100 text-stone-400"
                }
              `}
            >
              {counts[status]}
            </span>
          </button>
        ))}
      </div>

      <ApplicationTable applications={filtered} />
    </div>
  );
}
