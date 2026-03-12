import { getApplicationByCode } from "@/actions/applications";
import { StatusDisplay } from "@/components/status-display";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function StatusByCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const application = await getApplicationByCode(code);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Application Status
        </h1>
      </div>
      <div className="w-full max-w-md">
        {application ? (
          <StatusDisplay
            application={{
              ...application,
              loanAmount: Number(application.loanAmount),
            }}
          />
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Application not found. Please check your code and try again.
              </p>
            </CardContent>
          </Card>
        )}
        <div className="mt-4 text-center">
          <Link
            href="/status"
            className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Look up another application
          </Link>
        </div>
      </div>
    </div>
  );
}
