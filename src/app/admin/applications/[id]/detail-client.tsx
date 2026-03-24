"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  updateTotalIncome,
  approveApplication,
  rejectApplication,
  revealSSN,
} from "@/actions/applications";
import { evaluateApplicationAction } from "@/actions/evaluation";
import { fetchAndStoreIncome } from "@/actions/plaid";
import { getPaymentsSummary, retryPayment, waiveLateFee } from "@/actions/payments";
import type { ApplicationWithDocuments, RiskScoreResult } from "@/types";
import type { EvaluationResult } from "@/types";

/* ── helpers ── */

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    APPROVED: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Approved" },
    REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    PENDING: { bg: "bg-amber-100", text: "text-amber-800", label: "Pending" },
    FUNDED: { bg: "bg-blue-100", text: "text-blue-800", label: "Funded" },
  };
  const s = map[status] ?? map.PENDING;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function RecommendationBadge({ recommendation }: { recommendation: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    APPROVE: { bg: "bg-emerald-100", text: "text-emerald-800" },
    REJECT: { bg: "bg-red-100", text: "text-red-800" },
    MANUAL_REVIEW: { bg: "bg-amber-100", text: "text-amber-800" },
  };
  const s = map[recommendation] ?? map.MANUAL_REVIEW;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${s.bg} ${s.text}`}>
      {recommendation.replace("_", " ")}
    </span>
  );
}

/* ── main component ── */

export function DetailClient({
  application,
}: {
  application: ApplicationWithDocuments;
}) {
  const router = useRouter();

  /* evaluation */
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [riskResult, setRiskResult] = useState<RiskScoreResult | null>(null);

  useEffect(() => {
    evaluateApplicationAction(application.id).then((evalResult) => {
      setEvaluation(evalResult);
      if (evalResult.riskScore) {
        setRiskResult(evalResult.riskScore);
      }
    });
  }, [application.id]);

  /* payments */
  const [paymentSummary, setPaymentSummary] = useState<Awaited<ReturnType<typeof getPaymentsSummary>> | null>(null);

  useEffect(() => {
    if (["ACTIVE", "LATE", "COLLECTIONS", "DEFAULTED", "PAID_OFF"].includes(application.status)) {
      getPaymentsSummary(application.id).then(setPaymentSummary);
    }
  }, [application.id, application.status]);

  /* SSN reveal */
  const [ssn, setSsn] = useState<string | null>(null);
  const [ssnLoading, setSsnLoading] = useState(false);

  async function handleRevealSSN() {
    setSsnLoading(true);
    try {
      const result = await revealSSN(application.id);
      if (result.success && result.ssn) {
        setSsn(result.ssn);
      } else {
        toast.error(result.error || "Failed to reveal SSN");
      }
    } catch {
      toast.error("Failed to reveal SSN");
    } finally {
      setSsnLoading(false);
    }
  }

  /* Plaid income */
  const [plaidIncome, setPlaidIncome] = useState<number | null>(
    (application as any).monthlyIncome ? Number((application as any).monthlyIncome) : null
  );
  const [fetchingIncome, setFetchingIncome] = useState(false);

  async function handleFetchIncome() {
    setFetchingIncome(true);
    try {
      const result = await fetchAndStoreIncome(application.id);
      if (result.success && result.monthlyIncome != null) {
        setPlaidIncome(result.monthlyIncome);
        toast.success("Income verified from Plaid");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to fetch income");
      }
    } catch {
      toast.error("Failed to fetch income from Plaid");
    } finally {
      setFetchingIncome(false);
    }
  }

  /* income */
  const [income, setIncome] = useState(
    application.totalIncome ? String(Number(application.totalIncome)) : ""
  );
  const [savingIncome, setSavingIncome] = useState(false);

  /* decision */
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  /* approval inputs */
  const [termMonths, setTermMonths] = useState<string>(
    String((application as any).loanTermMonths || 6)
  );

  /* funding */
  const [funding, setFunding] = useState(false);
  const [fundAmount, setFundAmount] = useState(String(Number(application.loanAmount)));

  /* derived values */
  const loanAmount = Number(application.loanAmount);
  const totalIncome = application.totalIncome ? Number(application.totalIncome) : null;

  /* ── handlers ── */

  async function handleSaveIncome() {
    const value = parseFloat(income);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid income amount");
      return;
    }
    setSavingIncome(true);
    try {
      await updateTotalIncome(application.id, value);
      toast.success("Income saved successfully");
      router.refresh();
    } catch {
      toast.error("Failed to save income");
    } finally {
      setSavingIncome(false);
    }
  }

  async function handleApprove() {
    const term = parseInt(termMonths);
    if (isNaN(term) || term <= 0) {
      toast.error("Please enter a valid loan term");
      return;
    }
    setApproving(true);
    try {
      const result = await approveApplication(application.id, term || undefined);
      if (result.error) {
        toast.error(result.error);
        if ((result as any).reasons) {
          (result as any).reasons.forEach((r: string) => toast.error(r));
        }
      } else {
        toast.success("Application approved");
        router.refresh();
      }
    } catch {
      toast.error("Failed to approve application");
    } finally {
      setApproving(false);
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setRejecting(true);
    try {
      const result = await rejectApplication(application.id, rejectionReason);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Application rejected");
        setShowRejectForm(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to reject application");
    } finally {
      setRejecting(false);
    }
  }

  async function handleFund() {
    setFunding(true);
    try {
      // fundApplication may not exist yet — we call it if available
      const { fundApplication } = await import("@/actions/applications");
      if (typeof fundApplication === "function") {
        const result = await fundApplication(application.id, parseFloat(fundAmount));
        if ((result as any).error) {
          toast.error((result as any).error);
        } else {
          toast.success("Loan marked as funded");
          router.refresh();
        }
      } else {
        toast.error("Fund action not yet available");
      }
    } catch {
      toast.error("Fund action not yet available");
    } finally {
      setFunding(false);
    }
  }

  /* ── render ── */

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Detail</h1>
              <p className="text-sm text-gray-500 mt-0.5">Review and analyze loan application</p>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="space-y-6">
          {/* ── Evaluation Card ── */}
          {evaluation && (
            <div className={`rounded-2xl border shadow-sm p-6 ${
              evaluation.recommendation === "APPROVE"
                ? "bg-emerald-50 border-emerald-200"
                : evaluation.recommendation === "REJECT"
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            }`}>
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
                Rules Engine Evaluation
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-700">Recommendation:</span>
                <RecommendationBadge recommendation={evaluation.recommendation} />
              </div>

              {evaluation.suggestedRate > 0 && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Suggested Rate: </span>
                  <span className="text-sm font-bold text-gray-900">{evaluation.suggestedRate}%</span>
                </div>
              )}

              {evaluation.reasons.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Reasons:</p>
                  <ul className="space-y-1">
                    {evaluation.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ── Applicant Info ── */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Applicant Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {application.firstName} {application.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                <p className="mt-1 text-sm text-gray-900">{application.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                <p className="mt-1 text-sm text-gray-900">{application.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Application Code</p>
                <p className="mt-1 text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1 inline-block">
                  {application.applicationCode}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Amount</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ${fmt(loanAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(application.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* New fields: Platform, Loan Term, Bank Link Status, SSN */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</p>
                <p className="mt-1 text-sm text-gray-900">{(application as any).platform || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Term</p>
                <p className="mt-1 text-sm text-gray-900">{(application as any).loanTermMonths || "N/A"} months</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Link Status</p>
                <p className="mt-1 text-sm">
                  {(application as any).plaidAccessToken ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Linked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <span className="h-2 w-2 rounded-full bg-gray-300" />
                      Not linked
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">SSN</p>
                <div className="mt-1">
                  {ssn ? (
                    <p className="text-sm font-mono font-semibold text-gray-900">{ssn}</p>
                  ) : (
                    <button
                      onClick={handleRevealSSN}
                      disabled={ssnLoading}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {ssnLoading ? "Revealing..." : "Reveal SSN"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {application.status === "REJECTED" && application.rejectionReason && (
              <div className="mt-5 rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-semibold text-red-800">Rejection Reason</p>
                <p className="mt-1 text-sm text-red-700">{application.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* ── Plaid Income Verification ── */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
              Plaid Income Verification
            </h2>

            <div className="flex items-center gap-4">
              {plaidIncome !== null ? (
                <div>
                  <p className="text-sm text-gray-600">Verified Monthly Income:</p>
                  <p className="text-2xl font-bold text-emerald-700">${fmt(plaidIncome)}/mo</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Not verified</p>
              )}
              <button
                onClick={handleFetchIncome}
                disabled={fetchingIncome || !(application as any).plaidAccessToken}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
                {fetchingIncome ? "Fetching..." : "Fetch from Plaid"}
              </button>
            </div>
            {!(application as any).plaidAccessToken && (
              <p className="mt-2 text-xs text-gray-400">No Plaid connection available for this application.</p>
            )}
          </div>

          {/* ── Documents ── */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Documents ({application.documents.length})
            </h2>

            {application.documents.length === 0 ? (
              <p className="text-sm text-gray-500">No documents uploaded.</p>
            ) : (
              <div className="space-y-2">
                {application.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3.5 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                        <svg className="h-5 w-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {doc.documentType} &middot; {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`/api/files/${doc.storagePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Income Entry ── */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Income Entry
            </h2>

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Total 3-Month Income (from pay stubs)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    $
                  </span>
                  <input
                    id="income"
                    type="number"
                    placeholder="0.00"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveIncome}
                disabled={savingIncome}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {savingIncome ? "Saving..." : "Save Income"}
              </button>
            </div>

            {totalIncome !== null && (
              <p className="mt-2.5 text-xs text-gray-500">
                Current recorded income:{" "}
                <span className="font-semibold text-gray-700">${fmt(totalIncome)}</span>
              </p>
            )}
          </div>

          {/* ── Risk Assessment (model-driven) ── */}
          {riskResult && (
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                Risk Assessment
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className={`text-3xl font-bold ${
                      riskResult.riskScore < 33 ? "text-emerald-600" :
                      riskResult.riskScore < 66 ? "text-amber-600" :
                      "text-red-600"
                    }`}>
                      {riskResult.riskScore.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">out of 100 (higher = riskier)</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-sm text-muted-foreground">Calculated Rate</p>
                    <p className="text-3xl font-bold">{riskResult.interestRate.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground">auto-set on approval</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Feature Breakdown</h4>
                  <div className="rounded border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-2">Feature</th>
                          <th className="text-right p-2">Raw Value</th>
                          <th className="text-right p-2">Normalized</th>
                          <th className="text-right p-2">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {riskResult.features.map((f) => (
                          <tr key={f.name} className="border-b last:border-0">
                            <td className="p-2 font-mono text-xs">{f.name}</td>
                            <td className="p-2 text-right">{f.rawValue?.toFixed(2) ?? "N/A"}</td>
                            <td className="p-2 text-right">{f.normalizedValue.toFixed(3)}</td>
                            <td className={`p-2 text-right ${f.weight > 0 ? "text-red-600" : "text-emerald-600"}`}>
                              {f.weight.toFixed(3)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {riskResult.features.find(f => f.name === "aggregate_exposure")?.rawValue != null &&
                  riskResult.features.find(f => f.name === "aggregate_exposure")!.rawValue! > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-800">Concurrent Loans Detected</p>
                    <p className="text-sm text-amber-700">
                      Exposure ratio: {riskResult.features.find(f => f.name === "aggregate_exposure")?.rawValue?.toFixed(2)}
                    </p>
                  </div>
                )}

                {!riskResult.modelId && (
                  <p className="text-sm text-amber-600">
                    No risk model loaded — using default rate. Run the seed script to initialize.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Decision Section (PENDING) ── */}
          {application.status === "PENDING" && (
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Decision
              </h2>

              {/* Term Input — interest rate is auto-set by risk model on approval */}
              <div className="mb-5">
                <div>
                  <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Loan Term (months)
                  </label>
                  <input
                    id="termMonths"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="6"
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {approving ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => setShowRejectForm(!showRejectForm)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </div>

              {showRejectForm && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-red-800 mb-1.5">
                    Rejection Reason
                  </label>
                  <textarea
                    id="reason"
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 mb-3"
                  />
                  <button
                    onClick={handleReject}
                    disabled={rejecting}
                    className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {rejecting ? "Rejecting..." : "Confirm Reject"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Fund Loan (APPROVED) ── */}
          {application.status === "APPROVED" && (
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
                Fund Loan
              </h2>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label htmlFor="fundAmount" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Fund Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      $
                    </span>
                    <input
                      id="fundAmount"
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white pl-8 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
                <button
                  onClick={handleFund}
                  disabled={funding}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {funding ? "Funding..." : "Mark as Funded"}
                </button>
              </div>
            </div>
          )}

          {/* ── Payment Schedule ── */}
          {paymentSummary && (
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                Payment Schedule
              </h2>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Total Owed</p>
                  <p className="text-xl font-bold text-gray-900">${fmt(paymentSummary.totalOwed)}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Total Paid</p>
                  <p className="text-xl font-bold text-emerald-700">${fmt(paymentSummary.totalPaid)}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Remaining Balance</p>
                  <p className="text-xl font-bold text-gray-900">${fmt(paymentSummary.remainingBalance)}</p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Total Late Fees</p>
                  <p className="text-xl font-bold text-amber-700">${fmt(paymentSummary.totalLateFees)}</p>
                </div>
              </div>

              {/* Payment Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2.5 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Principal</th>
                      <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Interest</th>
                      <th className="py-2.5 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Late Fee</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentSummary.payments.map((payment) => {
                      const statusColors: Record<string, string> = {
                        PAID: "bg-emerald-100 text-emerald-800",
                        PENDING: "bg-amber-100 text-amber-800",
                        FAILED: "bg-red-100 text-red-800",
                        PROCESSING: "bg-blue-100 text-blue-800",
                        LATE: "bg-orange-100 text-orange-800",
                        COLLECTIONS: "bg-red-100 text-red-800",
                        WAIVED: "bg-gray-100 text-gray-600",
                      };
                      const badgeClass = statusColors[payment.status] ?? "bg-gray-100 text-gray-600";
                      const lateFee = Number(payment.lateFee);

                      return (
                        <tr key={payment.id} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors">
                          <td className="py-2.5 px-3 text-gray-700 font-medium">{payment.paymentNumber}</td>
                          <td className="py-2.5 px-3 text-gray-700">
                            {new Date(payment.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-2.5 px-3 text-right text-gray-900 font-medium">${fmt(Number(payment.amount))}</td>
                          <td className="py-2.5 px-3 text-right text-gray-700">${fmt(Number(payment.principal))}</td>
                          <td className="py-2.5 px-3 text-right text-gray-500">${fmt(Number(payment.interest))}</td>
                          <td className={`py-2.5 px-3 text-right font-medium ${lateFee > 0 ? "text-amber-700" : "text-gray-400"}`}>
                            {lateFee > 0 ? `$${fmt(lateFee)}` : "—"}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              {payment.status === "FAILED" && (
                                <button
                                  onClick={async () => {
                                    const result = await retryPayment(payment.id);
                                    if (result.success) {
                                      toast.success(`Payment #${payment.paymentNumber} queued for retry`);
                                      getPaymentsSummary(application.id).then(setPaymentSummary);
                                    } else {
                                      toast.error(result.error || "Failed to retry payment");
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                                  </svg>
                                  Retry
                                </button>
                              )}
                              {lateFee > 0 && (
                                <button
                                  onClick={async () => {
                                    const result = await waiveLateFee(payment.id);
                                    if (result.success) {
                                      toast.success(`Late fee of $${fmt(result.waivedAmount ?? 0)} waived`);
                                      getPaymentsSummary(application.id).then(setPaymentSummary);
                                    } else {
                                      toast.error(result.error || "Failed to waive late fee");
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                                >
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                  </svg>
                                  Waive Fee
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
