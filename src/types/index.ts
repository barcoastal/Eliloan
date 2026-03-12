import type { Application, Document, LoanRule } from "@/generated/prisma/client";

export type { Application, Document, LoanRule };

export type ApplicationWithDocuments = Application & {
  documents: Document[];
};

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  rules: Record<string, string>;
}

export interface StorageProvider {
  upload(file: Buffer, filename: string): Promise<string>;
  getUrl(storagePath: string): string;
  delete(storagePath: string): Promise<void>;
}

export interface DecisionEngine {
  evaluate(
    application: ApplicationWithDocuments,
    rules: Record<string, string>
  ): EligibilityResult;
}
