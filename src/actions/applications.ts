"use server";

import { prisma } from "@/lib/db";
import { getLoanRules, decisionEngine } from "@/lib/rules-engine";
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
  files: z.array(
    z.object({
      fileName: z.string(),
      mimeType: z.string(),
      fileSize: z.number(),
      storagePath: z.string(),
    })
  ),
});

export async function submitApplication(data: z.infer<typeof submitSchema>) {
  const parsed = submitSchema.safeParse(data);
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

  const applicationCode = generateApplicationCode();

  await prisma.application.create({
    data: {
      applicationCode,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      loanAmount: parsed.data.loanAmount,
      documents: {
        create: parsed.data.files.map((f) => ({
          fileName: f.fileName,
          mimeType: f.mimeType,
          fileSize: f.fileSize,
          storagePath: f.storagePath,
          documentType: "PAY_STUB",
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
