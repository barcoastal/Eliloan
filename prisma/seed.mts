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
