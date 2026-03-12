"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DocumentViewer } from "@/components/document-viewer";
import {
  updateTotalIncome,
  approveApplication,
  rejectApplication,
} from "@/actions/applications";
import type { ApplicationWithDocuments } from "@/types";
import { ArrowLeftIcon, CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          Pending
        </Badge>
      );
  }
}

export function DetailClient({
  application,
}: {
  application: ApplicationWithDocuments;
}) {
  const router = useRouter();
  const [income, setIncome] = useState(
    application.totalIncome ? String(Number(application.totalIncome)) : ""
  );
  const [savingIncome, setSavingIncome] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  async function handleSaveIncome() {
    const value = parseFloat(income);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid income amount");
      return;
    }
    setSavingIncome(true);
    try {
      await updateTotalIncome(application.id, value);
      toast.success("Income saved successfully");
      router.refresh();
    } catch {
      toast.error("Failed to save income");
    } finally {
      setSavingIncome(false);
    }
  }

  async function handleApprove() {
    setApproving(true);
    try {
      const result = await approveApplication(application.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Application approved");
        router.refresh();
      }
    } catch {
      toast.error("Failed to approve application");
    } finally {
      setApproving(false);
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setRejecting(true);
    try {
      const result = await rejectApplication(application.id, rejectionReason);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Application rejected");
        setRejectDialogOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to reject application");
    } finally {
      setRejecting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" render={<Link href="/admin/dashboard" />}>
          <ArrowLeftIcon className="size-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Application Detail</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Applicant Information</span>
            <StatusBadge status={application.status} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium mt-0.5">
                {application.firstName} {application.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium mt-0.5">{application.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium mt-0.5">{application.phone}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Loan Amount</dt>
              <dd className="font-medium mt-0.5">
                ${Number(application.loanAmount).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Application Code</dt>
              <dd className="font-mono font-medium mt-0.5">
                {application.applicationCode}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Submitted</dt>
              <dd className="font-medium mt-0.5">
                {new Date(application.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>

          {application.status === "REJECTED" && application.rejectionReason && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <p className="font-medium">Rejection Reason</p>
              <p className="mt-0.5">{application.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentViewer documents={application.documents} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="income">Total Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  id="income"
                  type="number"
                  placeholder="0"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveIncome}
              disabled={savingIncome}
              size="lg"
            >
              {savingIncome ? "Saving..." : "Save Income"}
            </Button>
          </div>
          {application.totalIncome && (
            <p className="mt-2 text-xs text-muted-foreground">
              Current recorded income: $
              {Number(application.totalIncome).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {application.status === "PENDING" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={approving}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <CheckIcon className="size-4 mr-1" />
                {approving ? "Approving..." : "Approve"}
              </Button>

              <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogTrigger
                  render={
                    <Button variant="destructive" size="lg">
                      <XIcon className="size-4 mr-1" />
                      Reject
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Application</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this application.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Enter rejection reason..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={rejecting}
                    >
                      {rejecting ? "Rejecting..." : "Confirm Reject"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
