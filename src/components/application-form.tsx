"use client";

import { useState, useRef, useCallback } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { submitApplication } from "@/actions/applications";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText, Loader2, CheckCircle2 } from "lucide-react";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  loanAmount: z.number().positive("Loan amount must be positive"),
});

export function ApplicationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [applicationCode, setApplicationCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const valid: File[] = [];
    for (const file of Array.from(newFiles)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Allowed: PDF, PNG, JPEG`);
        continue;
      }
      valid.push(file);
    }
    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = formSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      loanAmount: parseFloat(loanAmount),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key) fieldErrors[String(key)] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (files.length < 3) {
      toast.error("At least 3 pay stubs are required");
      return;
    }

    setSubmitting(true);
    setUploadProgress(true);

    try {
      // Step 1: Upload files
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const uploadData = await uploadRes.json();
      setUploadProgress(false);

      // Step 2: Submit application
      const result = await submitApplication({
        ...parsed.data,
        files: uploadData.files,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.applicationCode) {
        setApplicationCode(result.applicationCode);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
      setUploadProgress(false);
    }
  };

  if (applicationCode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center gap-6 py-8 text-center">
          <CheckCircle2 className="size-12 text-green-600" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Application Submitted!</h2>
            <p className="text-muted-foreground text-sm">
              Save your application code to check your status later.
            </p>
          </div>
          <div className="rounded-lg bg-zinc-100 px-6 py-4">
            <p className="text-xs text-muted-foreground mb-1">
              Application Code
            </p>
            <p className="text-3xl font-mono font-bold tracking-widest">
              {applicationCode}
            </p>
          </div>
          <a
            href={`/status/${applicationCode}`}
            className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Check application status
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Loan Application</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="loanAmount"
                type="number"
                min="1"
                step="any"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="5000"
                className="pl-7"
                aria-invalid={!!errors.loanAmount}
              />
            </div>
            {errors.loanAmount && (
              <p className="text-xs text-destructive">{errors.loanAmount}</p>
            )}
          </div>

          {/* File Upload Area */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Pay Stubs{" "}
              <span className="text-muted-foreground font-normal">
                ({files.length}/3 minimum)
              </span>
            </Label>
            <div
              ref={dropRef}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
            >
              <Upload className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PNG, or JPEG
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            {files.length > 0 && (
              <ul className="flex flex-col gap-1 mt-1">
                {files.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex items-center gap-2 rounded-md bg-zinc-50 px-3 py-1.5 text-sm"
                  >
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="shrink-0 rounded p-0.5 hover:bg-zinc-200"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="mt-2">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {uploadProgress ? "Uploading files..." : "Submitting..."}
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
