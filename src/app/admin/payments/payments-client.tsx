"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllPayments } from "@/actions/payments";

type PaymentWithApp = Awaited<ReturnType<typeof getAllPayments>>[number];

const statuses = ["ALL", "PENDING", "PROCESSING", "PAID", "FAILED", "LATE", "COLLECTIONS"];

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-500",
    PROCESSING: "bg-blue-500",
    PAID: "bg-emerald-500",
    FAILED: "bg-red-500",
    LATE: "bg-orange-500",
    COLLECTIONS: "bg-rose-500",
  };
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${colors[status] || "bg-gray-400"}`} />
  );
}

export function PaymentsClient() {
  const [payments, setPayments] = useState<PaymentWithApp[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getAllPayments(filter).then((data) => {
      setPayments(data);
      setLoading(false);
    });
  }, [filter]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-emerald-950">Payments</h1>
        <p className="mt-1 text-[14px] text-emerald-800/50">
          View and manage all loan payments
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all ${
              filter === s
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-900/5 text-emerald-800/60 hover:bg-emerald-900/10"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-emerald-800/40">Loading...</div>
      ) : payments.length === 0 ? (
        <div className="rounded-2xl border border-emerald-900/5 bg-white p-10 text-center">
          <p className="text-emerald-800/40">No payments found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-emerald-900/5 bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-emerald-900/5 bg-emerald-50/50">
                <th className="px-4 py-3 text-left font-medium text-emerald-800/60">#</th>
                <th className="px-4 py-3 text-left font-medium text-emerald-800/60">Borrower</th>
                <th className="px-4 py-3 text-left font-medium text-emerald-800/60">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-emerald-800/60">Late Fee</th>
                <th className="px-4 py-3 text-left font-medium text-emerald-800/60">Due Date</th>
                <th className="px-4 py-3 text-left font-medium text-emerald-800/60">Status</th>
                <th className="px-4 py-3 text-left font-medium text-emerald-800/60">Retries</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/admin/applications/${p.applicationId}`)}
                  className="cursor-pointer border-b border-emerald-900/5 transition-colors hover:bg-emerald-50/30"
                >
                  <td className="px-4 py-3 font-mono">{p.paymentNumber}</td>
                  <td className="px-4 py-3">
                    {p.application.firstName} {p.application.lastName}
                    <span className="ml-2 text-emerald-800/40">{p.application.applicationCode}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{Number(p.lateFee) > 0 ? `$${Number(p.lateFee).toFixed(2)}` : "—"}</td>
                  <td className="px-4 py-3">{new Date(p.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <StatusDot status={p.status} />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.retryCount > 0 ? p.retryCount : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
