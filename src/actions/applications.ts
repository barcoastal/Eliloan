"use server";

import { prisma } from "@/lib/db";
import { getLoanRules, decisionEngine } from "@/lib/rules-engine";
import { encrypt, hashSSN } from "@/lib/encryption";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

function generateApplicationCode(): string {
  return uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase();
}

const submitSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  loanAmount: z.number().positive("Loan amount must be positive"),
  loanTermMonths: z.number().int().min(3).max(18),
  platform: z.string().optional(),
  ssnRaw: z.string().optional(),
  plaidAccessToken: z.string().optional(),
  plaidAccountId: z.string().optional(),
  plaidItemId: z.string().optional(),
  files: z.array(
    z.object({
      fileName: z.string(),
      mimeType: z.string(),
      fileSize: z.number(),
      storagePath: z.string(),
    })
  ),
});

export async function submitApplication(input: z.infer<typeof submitSchema>) {
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const rules = await getLoanRules();
  const loanLimit = parseFloat(rules.loan_limit || "10000");
  const requiredStubs = parseInt(rules.required_pay_stubs || "3");

  if (parsed.data.loanAmount > loanLimit) {
    return {
      error: `Loan amount cannot exceed $${loanLimit.toLocaleString()}`,
    };
  }

  if (parsed.data.files.length < requiredStubs) {
    return { error: `At least ${requiredStubs} pay stubs are required` };
  }

  const data = parsed.data;

  const ssnEncrypted = data.ssnRaw ? encrypt(data.ssnRaw) : null;
  const ssnHash = data.ssnRaw ? hashSSN(data.ssnRaw) : null;

  if (ssnHash) {
    const existing = await prisma.application.findFirst({ where: { ssnHash } });
    if (existing) {
      return { success: false, error: "An application with this SSN already exists." };
    }
  }

  const applicationCode = generateApplicationCode();

  const application = await prisma.application.create({
    data: {
      applicationCode,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      loanAmount: data.loanAmount,
      loanTermMonths: data.loanTermMonths,
      platform: data.platform || null,
      ssnEncrypted,
      ssnHash,
      plaidAccessToken: data.plaidAccessToken || null,
      plaidAccountId: data.plaidAccountId || null,
      plaidItemId: data.plaidItemId || null,
      documents: {
        create: data.files.map((file) => ({
          fileName: file.fileName,
          mimeType: file.mimeType,
          fileSize: file.fileSize,
          storagePath: file.storagePath,
        })),
      },
    },
  });

  return { success: true, applicationCode };
}

export async function getApplicationByCode(code: string) {
  return prisma.application.findUnique({
    where: { applicationCode: code.toUpperCase() },
    select: {
      applicationCode: true,
      firstName: true,
      status: true,
      loanAmount: true,
      rejectionReason: true,
      createdAt: true,
    },
  });
}

export async function getApplications(status?: string) {
  const where = status && status !== "ALL" ? { status } : {};
  return prisma.application.findMany({
    where,
    include: { documents: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplicationById(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: { documents: true },
  });
}

export async function updateTotalIncome(id: string, totalIncome: number) {
  return prisma.application.update({
    where: { id },
    data: { totalIncome },
  });
}

export async function approveApplication(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: { documents: true },
  });

  if (!application) return { error: "Application not found" };

  const rules = await getLoanRules();
  const result = decisionEngine.evaluate(application, rules);

  if (!result.eligible) {
    return { error: result.reason };
  }

  await prisma.application.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return { success: true };
}

export async function rejectApplication(id: string, reason: string) {
  if (!reason.trim()) {
    return { error: "Rejection reason is required" };
  }

  await prisma.application.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: reason },
  });

  return { success: true };
}
