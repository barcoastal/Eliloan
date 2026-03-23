import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "..", "dev.db");

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.loanRule.upsert({
    where: { key: "loan_limit" },
    update: {},
    create: {
      key: "loan_limit",
      value: "10000",
      description: "Maximum loan amount in USD",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "income_multiplier_ratio" },
    update: {},
    create: {
      key: "income_multiplier_ratio",
      value: "2.0",
      description: "Required ratio of 3-month income to loan amount (income >= ratio * loanAmount)",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "max_file_size_mb" },
    update: {},
    create: {
      key: "max_file_size_mb",
      value: "10",
      description: "Maximum file upload size in MB",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "required_pay_stubs" },
    update: {},
    create: {
      key: "required_pay_stubs",
      value: "3",
      description: "Number of pay stubs required with application",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "min_loan" },
    update: {},
    create: {
      key: "min_loan",
      value: "100",
      description: "Minimum loan amount in dollars",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "min_bank_balance" },
    update: {},
    create: {
      key: "min_bank_balance",
      value: "200",
      description: "Minimum bank balance at time of application",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "max_loan_term_months" },
    update: {},
    create: {
      key: "max_loan_term_months",
      value: "18",
      description: "Maximum repayment period in months",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "min_interest_rate" },
    update: {},
    create: {
      key: "min_interest_rate",
      value: "30",
      description: "Floor interest rate (annual %)",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "late_fee_amount" },
    update: {},
    create: {
      key: "late_fee_amount",
      value: "25",
      description: "Flat late fee per missed payment in dollars",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "late_fee_grace_days" },
    update: {},
    create: {
      key: "late_fee_grace_days",
      value: "3",
      description: "Days after due date before late fee applies",
    },
  });

  await prisma.loanRule.upsert({
    where: { key: "collections_threshold_days" },
    update: {},
    create: {
      key: "collections_threshold_days",
      value: "30",
      description: "Days overdue before collections escalation",
    },
  });

  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@loanportal.com" },
    update: {},
    create: {
      email: "admin@loanportal.com",
      passwordHash,
      name: "Admin User",
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
