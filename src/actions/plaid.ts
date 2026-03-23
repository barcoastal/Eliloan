"use server";

import { prisma } from "@/lib/db";
import { plaidClient } from "@/lib/plaid";
import { decrypt } from "@/lib/encryption";

export async function fetchAndStoreIncome(applicationId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application?.plaidAccessToken) {
    return { success: false, error: "No Plaid connection" };
  }

  try {
    const accessToken = decrypt(application.plaidAccessToken);

    // Use Transactions to estimate income (3-month deposit average)
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    const txResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: threeMonthsAgo.toISOString().split("T")[0],
      end_date: now.toISOString().split("T")[0],
    });

    // Sum deposit transactions (Plaid: negative amount = money in)
    const deposits = txResponse.data.transactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const monthlyIncome = deposits / 3;

    await prisma.application.update({
      where: { id: applicationId },
      data: { monthlyIncome },
    });

    return { success: true, monthlyIncome };
  } catch (error) {
    console.error("Plaid income fetch error:", error);
    return { success: false, error: "Could not verify income" };
  }
}

export async function getPlaidIncomeData(applicationId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { monthlyIncome: true, plaidAccessToken: true },
  });

  return {
    monthlyIncome: application?.monthlyIncome ? Number(application.monthlyIncome) : null,
    hasPlaidConnection: !!application?.plaidAccessToken,
  };
}
