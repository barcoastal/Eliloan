"use client";

type PaymentInfo = {
  id: string;
  paymentNumber: number;
  amount: number | { toString(): string };
  principal: number | { toString(): string };
  interest: number | { toString(): string };
  lateFee: number | { toString(): string };
  dueDate: Date | string;
  paidAt: Date | string | null;
  status: string;
};

type StatusApplication = {
  applicationCode: string;
  firstName: string;
  status: string;
  loanAmount: number;
  loanTermMonths: number | null;
  interestRate: number | { toString(): string } | null;
  fundedAmount: number | { toString(): string } | null;
  fundedAt: Date | string | null;
  rejectionReason: string | null;
  createdAt: Date | string;
  payments: PaymentInfo[];
};

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: "bg-amber-50", text: "text-amber-700", label: "Under Review" },
    APPROVED: { bg: "bg-green-50", text: "text-green-700", label: "Approved" },
    REJECTED: { bg: "bg-red-50", text: "text-red-700", label: "Rejected" },
    ACTIVE: { bg: "bg-blue-50", text: "text-blue-700", label: "Active" },
    LATE: { bg: "bg-orange-50", text: "text-orange-700", label: "Late" },
    COLLECTIONS: { bg: "bg-rose-50", text: "text-rose-700", label: "Collections" },
    DEFAULTED: { bg: "bg-red-50", text: "text-red-800", label: "Defaulted" },
    PAID_OFF: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Paid Off" },
  };
  const c = config[status] || { bg: "bg-gray-50", text: "text-gray-700", label: status };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

export function StatusDisplay({ application }: { application: StatusApplication }) {
  const isActiveLoan = ["ACTIVE", "LATE", "COLLECTIONS", "DEFAULTED", "PAID_OFF"].includes(application.status);
  const payments = application.payments || [];

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + Number(p.amount), 0);
  const totalOwed = payments.reduce((s, p) => s + Number(p.amount), 0);
  const remainingBalance = totalOwed - totalPaid;
  const totalLateFees = payments.reduce((s, p) => s + Number(p.lateFee), 0);
  const nextPayment = payments.find((p) => p.status === "PENDING" || p.status === "FAILED");

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Loan Status</h2>
          <StatusBadge status={application.status} />
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Applicant</dt>
            <dd className="font-medium mt-0.5">{application.firstName}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Loan Amount</dt>
            <dd className="font-medium mt-0.5">${Number(application.loanAmount).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Submitted</dt>
            <dd className="font-medium mt-0.5">{new Date(application.createdAt).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Code</dt>
            <dd className="font-mono font-medium mt-0.5">{application.applicationCode}</dd>
          </div>
          {isActiveLoan && application.interestRate && (
            <>
              <div>
                <dt className="text-gray-500">Interest Rate</dt>
                <dd className="font-medium mt-0.5">{Number(application.interestRate)}% APR</dd>
              </div>
              <div>
                <dt className="text-gray-500">Term</dt>
                <dd className="font-medium mt-0.5">{application.loanTermMonths} months</dd>
              </div>
            </>
          )}
        </dl>

        {application.status === "REJECTED" && application.rejectionReason && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            <p className="font-medium">Rejection Reason</p>
            <p className="mt-0.5">{application.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Balance Summary (active loans only) */}
      {isActiveLoan && payments.length > 0 && (
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Balance Summary</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Total Owed</dt>
              <dd className="text-lg font-bold mt-0.5">${totalOwed.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Total Paid</dt>
              <dd className="text-lg font-bold text-emerald-600 mt-0.5">${totalPaid.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Remaining</dt>
              <dd className="text-lg font-bold mt-0.5">${remainingBalance.toFixed(2)}</dd>
            </div>
            {totalLateFees > 0 && (
              <div>
                <dt className="text-gray-500">Late Fees</dt>
                <dd className="text-lg font-bold text-orange-600 mt-0.5">${totalLateFees.toFixed(2)}</dd>
              </div>
            )}
          </dl>
          {nextPayment && (
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-medium">Next Payment</p>
              <p className="mt-0.5">
                Payment #{nextPayment.paymentNumber}: ${Number(nextPayment.amount).toFixed(2)} due{" "}
                {new Date(nextPayment.dueDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Payment History (active loans only) */}
      {isActiveLoan && payments.length > 0 && (
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Due Date</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{p.paymentNumber}</td>
                    <td className="py-2 pr-4">{new Date(p.dueDate).toLocaleDateString()}</td>
                    <td className="py-2 pr-4 font-medium">
                      ${Number(p.amount).toFixed(2)}
                      {Number(p.lateFee) > 0 && (
                        <span className="ml-1 text-xs text-orange-600">+${Number(p.lateFee).toFixed(2)} fee</span>
                      )}
                    </td>
                    <td className="py-2">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
