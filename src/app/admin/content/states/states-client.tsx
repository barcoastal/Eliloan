"use client";

import Link from "next/link";

interface StatePageItem {
  id: string;
  stateName: string;
  stateCode: string;
  slug: string;
  published: boolean;
  updatedAt: string;
}

export function StatesClient({ states }: { states: StatePageItem[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1a1a1a]">State Pages</h1>
        <Link href="/admin/content/states/new" className="bg-[#15803d] text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-[#166534]">
          New State Page
        </Link>
      </div>
      <div className="bg-white rounded-[10px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f4f4f5]">
              <th className="text-left text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] px-4 py-3">State</th>
              <th className="text-left text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] px-4 py-3">Code</th>
              <th className="text-left text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] px-4 py-3">Status</th>
              <th className="text-left text-[11px] uppercase tracking-[0.05em] text-[#a1a1aa] px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {states.map((s) => (
              <tr key={s.id} className="border-b border-[#f4f4f5] last:border-0 hover:bg-[#f8faf8]">
                <td className="px-4 py-3">
                  <Link href={`/admin/content/states/${s.id}`} className="text-[13px] font-medium text-[#1a1a1a] hover:text-[#15803d]">{s.stateName}</Link>
                  <p className="text-[11px] text-[#a1a1aa]">/1099-loans-{s.slug}</p>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#71717a]">{s.stateCode}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${s.published ? "bg-[#f0f5f0] text-[#15803d]" : "bg-[#f4f4f5] text-[#71717a]"}`}>
                    {s.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#71717a]">{new Date(s.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {states.length === 0 && <p className="text-center text-[#71717a] text-[14px] py-12">No state pages yet.</p>}
      </div>
    </div>
  );
}
