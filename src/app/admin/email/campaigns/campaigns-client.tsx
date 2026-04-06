"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  segmentRules: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  scheduledAt: Date | null;
  createdAt: Date;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT: "bg-[#f4f4f5] text-[#71717a]",
    SCHEDULED: "bg-amber-50 text-amber-700",
    SENDING: "bg-blue-50 text-blue-700",
    SENT: "bg-[#f0fdf4] text-[#15803d]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${map[status] ?? map.DRAFT}`}>
      {status}
    </span>
  );
}

export function CampaignsClient({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="One-time email sends to contact segments"
        action={{ label: "+ New Campaign", href: "/admin/email/campaigns/new" }}
      />

      <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="text-center py-16 text-[#a1a1aa]">
            <p className="text-[15px] font-medium mb-1">No campaigns yet</p>
            <p className="text-[13px]">Create your first campaign to start sending.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e4e4e7]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Sent</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Opened</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Clicked</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#f8f8f6] cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/email/campaigns/${c.id}`)}
                >
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-semibold text-[#1a1a1a]">{c.name}</p>
                    <p className="text-[12px] text-[#71717a] truncate max-w-[240px]">{c.subject}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-[13px] text-[#1a1a1a]">{c.totalSent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[13px] text-[#1a1a1a]">{c.totalOpened.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[13px] text-[#1a1a1a]">{c.totalClicked.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[12px] text-[#71717a]">
                    {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4">
        <Link href="/admin/email/campaigns/new" className="text-[13px] font-medium text-[#15803d] hover:underline">
          + New Campaign
        </Link>
      </div>
    </div>
  );
}
