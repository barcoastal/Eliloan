import type { Application, Document, LoanRule } from "@/generated/prisma/client";

export type ApplicationWithDocuments = Application & { documents: Document[] };

export interface EvaluationResult {
  recommendation: "APPROVE" | "REJECT" | "MANUAL_REVIEW";
  reasons: string[];
  suggestedRate: number;
  rules: Record<string, string>;
}

export interface StorageProvider {
  upload(file: Buffer, filename: string): Promise<string>;
  getUrl(storagePath: string): string;
  delete(storagePath: string): Promise<void>;
}

// Re-export Prisma types used elsewhere
export type { LoanRule };
