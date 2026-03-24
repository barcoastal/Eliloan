"use client";

import Link from "next/link";
import { ApplicationTable } from "@/components/application-table";
import type { ApplicationWithDocuments } from "@/types";

export function DashboardClient({
  applications,
}: {
  applications: ApplicationWithDocuments[];
}) {
  // Core metrics
  const activeCount = applications.filter((a) => a.status === "ACTIVE").length;

  const outstandingTotal = applications
    .filter((a) => a.status === "ACTIVE" || a.status === "LATE" || a.status === "COLLECTIONS")
    .reduce((sum, a) => sum + Number(a.loanAmount), 0);

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  const defaultedCount = applications.filter((a) => a.status === "DEFAULTED").length;
  const closedCount = applications.filter(
    (a) => a.status === "PAID_OFF" || a.status === "DEFAULTED" || a.status === "REJECTED"
  ).length;
  const defaultRate =
    closedCount > 0 ? ((defaultedCount / closedCount) * 100).toFixed(1) : "0.0";

  // Recent 5 applications
  const recent = [...applications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1a1a1a]">
          Dashboard
        </h1>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Loans */}
        <div className="bg-white rounded-[10px] p-4">
          <p className="text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] font-semibold mb-2">
            Active Loans
          </p>
          <p className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1a1a1a]">
            {activeCount}
          </p>
        </div>

        {/* Outstanding */}
        <div className="bg-white rounded-[10px] p-4">
          <p className="text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] font-semibold mb-2">
            Outstanding
          </p>
          <p className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1a1a1a]">
            ${outstandingTotal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-[10px] p-4">
          <p className="text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] font-semibold mb-2">
            Pending
          </p>
          <p className="text-[22px] font-extrabold tracking-[-0.02em] text-[#b45309]">
            {pendingCount}
          </p>
        </div>

        {/* Default Rate */}
        <div className="bg-white rounded-[10px] p-4">
          <p className="text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] font-semibold mb-2">
            Default Rate
          </p>
          <p className="text-[22px] font-extrabold tracking-[-0.02em] text-[#15803d]">
            {defaultRate}%
          </p>
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Recent Applications</h2>
          <Link
            href="/admin/applications"
            className="text-sm text-[#71717a] hover:text-[#1a1a1a] transition-colors"
          >
            View all →
          </Link>
        </div>
        <ApplicationTable applications={recent} />
      </div>
    </div>
  );
}
