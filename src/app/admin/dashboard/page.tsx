import { getApplications } from "@/actions/applications";
import { DashboardClient } from "./dashboard-client";
import type { ApplicationWithDocuments } from "@/types";

export default async function AdminDashboardPage() {
  const applications = (await getApplications()) as ApplicationWithDocuments[];

  return <DashboardClient applications={applications} />;
}
