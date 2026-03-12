"use client";

import { useState } from "react";
import { ApplicationTable } from "@/components/application-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ApplicationWithDocuments } from "@/types";

const statuses = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

export function DashboardClient({
  applications,
}: {
  applications: ApplicationWithDocuments[];
}) {
  const [activeStatus, setActiveStatus] = useState<string>("ALL");

  const counts = {
    ALL: applications.length,
    PENDING: applications.filter((a) => a.status === "PENDING").length,
    APPROVED: applications.filter((a) => a.status === "APPROVED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  const filtered =
    activeStatus === "ALL"
      ? applications
      : applications.filter((a) => a.status === activeStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and manage loan applications
        </p>
      </div>

      <div className="flex gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={activeStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveStatus(status)}
            className={cn("gap-2")}
          >
            {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            <Badge
              variant="secondary"
              className={cn(
                "ml-1 text-[10px] px-1.5",
                activeStatus === status && "bg-primary-foreground/20 text-primary-foreground"
              )}
            >
              {counts[status]}
            </Badge>
          </Button>
        ))}
      </div>

      <ApplicationTable applications={filtered} />
    </div>
  );
}
