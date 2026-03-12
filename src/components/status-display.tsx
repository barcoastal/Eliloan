import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatusApplication = {
  applicationCode: string;
  firstName: string;
  status: string;
  loanAmount: number;
  rejectionReason: string | null;
  createdAt: Date;
};

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

export function StatusDisplay({
  application,
}: {
  application: StatusApplication;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Application Status</span>
          <StatusBadge status={application.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Applicant</dt>
            <dd className="font-medium mt-0.5">{application.firstName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Loan Amount</dt>
            <dd className="font-medium mt-0.5">
              ${Number(application.loanAmount).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Submitted</dt>
            <dd className="font-medium mt-0.5">
              {new Date(application.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Code</dt>
            <dd className="font-mono font-medium mt-0.5">
              {application.applicationCode}
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
  );
}
