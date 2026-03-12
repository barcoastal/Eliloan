import { StatusChecker } from "@/components/status-checker";

export default function StatusPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Check Application Status
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your application code to check the status
        </p>
      </div>
      <StatusChecker />
    </div>
  );
}
