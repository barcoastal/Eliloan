"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateLoanRule } from "@/actions/settings";
import type { LoanRule } from "@/types";

function formatKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function RuleCard({ rule }: { rule: LoanRule }) {
  const [value, setValue] = useState(rule.value);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateLoanRule(rule.id, value);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${formatKey(rule.key)} updated successfully`);
      }
    } catch {
      toast.error("Failed to update rule");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{formatKey(rule.key)}</CardTitle>
      </CardHeader>
      <CardContent>
        {rule.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {rule.description}
          </p>
        )}
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor={rule.id}>Value</Label>
            <Input
              id={rule.id}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsClient({ rules }: { rules: LoanRule[] }) {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure loan rules and parameters
        </p>
      </div>

      {rules.length === 0 ? (
        <p className="text-muted-foreground">No rules configured.</p>
      ) : (
        rules.map((rule) => <RuleCard key={rule.id} rule={rule} />)
      )}
    </div>
  );
}
