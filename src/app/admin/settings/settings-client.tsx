"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateLoanRule } from "@/actions/settings";
import type { LoanRule } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const ruleIcons: Record<string, React.ReactNode> = {
  loan_limit: (
    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  income_multiplier_ratio: (
    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  max_file_size_mb: (
    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  required_pay_stubs: (
    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  ),
};

function RuleCard({ rule }: { rule: LoanRule }) {
  const [value, setValue] = useState(rule.value);
  const [saving, setSaving] = useState(false);
  const changed = value !== rule.value;

  async function handleSave() {
    setSaving(true);
    try {
      await updateLoanRule(rule.id, value);
      toast.success(`${formatKey(rule.key)} updated`);
    } catch {
      toast.error("Failed to update rule");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-900/5 bg-white p-6 transition-all hover:shadow-lg hover:shadow-emerald-900/5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          {ruleIcons[rule.key] || (
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-emerald-900">{formatKey(rule.key)}</h3>
          {rule.description && (
            <p className="mt-1 text-[13px] text-emerald-800/50">{rule.description}</p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-xl border border-emerald-900/10 bg-[#FAFAF7] px-4 py-2.5 text-[14px] text-emerald-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              onClick={handleSave}
              disabled={saving || !changed}
              className={`rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all ${
                changed
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                  : "bg-emerald-900/5 text-emerald-800/30 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsClient({ rules }: { rules: LoanRule[] }) {
  const [modelInfo, setModelInfo] = useState<{
    version: number;
    accuracy: number;
    precision: number;
    recall: number;
    trainingSize: number;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/risk-model-info")
      .then((r) => r.json())
      .then((data) => setModelInfo(data.model ?? null))
      .catch(() => setModelInfo(null));
  }, []);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-emerald-950">Settings</h1>
        <p className="mt-1 text-[14px] text-emerald-800/50">
          Configure loan rules and parameters
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Risk Model</CardTitle>
        </CardHeader>
        <CardContent>
          {modelInfo ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-medium">v{modelInfo.version}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Training Date</p>
                <p className="font-medium">{new Date(modelInfo.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sample Size</p>
                <p className="font-medium">{modelInfo.trainingSize}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Accuracy</p>
                <p className="font-medium">{(modelInfo.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Precision</p>
                <p className="font-medium">{(modelInfo.precision * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recall</p>
                <p className="font-medium">{(modelInfo.recall * 100).toFixed(1)}%</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-amber-600">
              No risk model loaded. Run: <code className="bg-muted px-1 rounded">python3 scripts/train_risk_model.py --seed</code>
            </p>
          )}
        </CardContent>
      </Card>

      {rules.length === 0 ? (
        <div className="rounded-2xl border border-emerald-900/5 bg-white p-10 text-center">
          <p className="text-emerald-800/40">No rules configured.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  );
}
