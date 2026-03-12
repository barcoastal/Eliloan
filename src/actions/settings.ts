"use server";

import { prisma } from "@/lib/db";

export async function getLoanRulesAction() {
  return prisma.loanRule.findMany({ orderBy: { key: "asc" } });
}

export async function updateLoanRule(id: string, value: string) {
  if (!value.trim()) {
    return { error: "Value is required" };
  }

  if (isNaN(parseFloat(value))) {
    return { error: "Value must be a number" };
  }

  await prisma.loanRule.update({
    where: { id },
    data: { value: value.trim() },
  });

  return { success: true };
}
