import { ApplicationForm } from "@/components/application-form";

export default function ApplyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Apply for a Loan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill out the form below to submit your application
        </p>
      </div>
      <ApplicationForm />
    </div>
  );
}
