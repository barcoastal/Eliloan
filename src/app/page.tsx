import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-6 text-center py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              1099 Loan Application Portal
            </h1>
            <p className="text-muted-foreground text-base">
              Quick loans for independent contractors — up to $10,000
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
            <Link
              href="/apply"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Apply Now
            </Link>
            <Link
              href="/status"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Check Status
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
