"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getApplicationByCode } from "@/actions/applications";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { StatusDisplay } from "@/components/status-display";

type ApplicationResult = NonNullable<Awaited<ReturnType<typeof getApplicationByCode>>>;

export function StatusChecker() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = code.trim();
    if (trimmed.length !== 8) {
      toast.error("Application code must be 8 characters");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const app = await getApplicationByCode(trimmed);
      setResult(app ?? null);
      if (!app) {
        toast.error("Application not found");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Check Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">Application Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 8))}
                placeholder="e.g. AB12CD34"
                maxLength={8}
                className="font-mono text-lg tracking-widest uppercase"
              />
            </div>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  Check Status
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && !loading && result && <StatusDisplay application={{
        ...result,
        loanAmount: Number(result.loanAmount),
      }} />}

      {searched && !loading && !result && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Application not found. Please check your code and try again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
