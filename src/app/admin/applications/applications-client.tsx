"use client";

import { useState } from "react";
import { ApplicationTable } from "@/components/application-table";
import type { ApplicationWithDocuments } from "@/types";

type FilterTab = "All" | "Pending" | "Approved" | "Active" | "Late" | "Collections" | "Defaulted" | "Paid Off";

const STATUS_MAP: Record<FilterTab, string | null> = {
  All: null,
  Pending: "PENDING",
  Approved: "APPROVED",
  Active: "ACTIVE",
  Late: "LATE",
  Collections: "COLLECTIONS",
  Defaulted: "DEFAULTED",
  "Paid Off": "PAID_OFF",
};

const TABS: FilterTab[] = ["All", "Pending", "Approved", "Active", "Late", "Collections", "Defaulted", "Paid Off"];

export function ApplicationsClient({
  applications,
}: {
  applications: ApplicationWithDocuments[];
}) {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const filtered =
    STATUS_MAP[activeTab] === null
      ? applications
      : applications.filter((a) => a.status === STATUS_MAP[activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1a1a1a]">
          Applications
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "bg-[#1a1a1a] text-white rounded-lg px-3 py-1.5 text-sm font-medium"
                : "text-[#71717a] hover:text-[#1a1a1a] px-3 py-1.5 text-sm font-medium"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <ApplicationTable applications={filtered} />
    </div>
  );
}
