import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";

export default function EmailPage() {
  return (
    <div>
      <PageHeader title="Email Marketing" description="Campaigns, sequences, and templates" />
      <div className="bg-white rounded-xl border border-[#e4e4e7]">
        <EmptyState
          title="Coming soon"
          description="Email marketing with automated sequences, manual campaigns, and a drip builder is coming in Phase 3."
        />
      </div>
    </div>
  );
}
