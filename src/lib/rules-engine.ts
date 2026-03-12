import { prisma } from "@/lib/db";
import type {
  DecisionEngine,
  EligibilityResult,
  ApplicationWithDocuments,
} from "@/types";

export async function getLoanRules(): Promise<Record<string, string>> {
  const rules = await prisma.loanRule.findMany();
  return Object.fromEntries(rules.map((r) => [r.key, r.value]));
}

export class ManualDecisionEngine implements DecisionEngine {
  evaluate(
    application: ApplicationWithDocuments,
    rules: Record<string, string>
  ): EligibilityResult {
    const loanLimit = parseFloat(rules.loan_limit || "10000");
    const multiplier = parseFloat(rules.income_multiplier_ratio || "2.0");
    const loanAmount = Number(application.loanAmount);
    const totalIncome = application.totalIncome
      ? Number(application.totalIncome)
      : null;

    if (loanAmount > loanLimit) {
      return {
        eligible: false,
        reason: `Loan amount $${loanAmount} exceeds limit of $${loanLimit}`,
        rules,
      };
    }

    if (totalIncome === null) {
      return {
        eligible: false,
        reason: "Total income has not been entered yet",
        rules,
      };
    }

    const requiredIncome = multiplier * loanAmount;
    if (totalIncome < requiredIncome) {
      return {
        eligible: false,
        reason: `Income $${totalIncome} is less than required $${requiredIncome} (${multiplier}x loan amount)`,
        rules,
      };
    }

    return { eligible: true, rules };
  }
}

export const decisionEngine: DecisionEngine = new ManualDecisionEngine();
