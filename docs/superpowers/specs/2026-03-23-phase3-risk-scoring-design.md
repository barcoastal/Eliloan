# Phase 3: Risk Scoring & Dynamic Pricing — Design Spec

**Goal:** Replace the hardcoded 30% interest rate and manual pricing with a data-driven risk scoring model that uses logistic regression to compute per-application interest rates based on borrower financial signals, gig platform risk, loan characteristics, and repayment history.

**Architecture:** Hybrid ML pipeline — Python (scikit-learn) for training, TypeScript for inference. Cold-started from public lending default data, auto-retrains when enough real loan outcomes accumulate. Risk score (0-100) maps continuously to interest rate between admin-configurable floor and ceiling.

**Tech Stack:** scikit-learn, numpy, pandas (training only); pure TypeScript inference; Prisma/SQLite for model storage.

---

## 1. Risk Score Features

Seven input features, each normalized to 0-1:

| # | Feature | Source | Normalization |
|---|---------|--------|---------------|
| 1 | Income-to-loan ratio | `monthlyIncome * termMonths / loanAmount` | Cap at 5.0, divide by 5 |
| 2 | Bank balance ratio | `bankBalance / loanAmount` | Cap at 2.0, divide by 2 |
| 3 | Platform risk factor | Lookup table by gig platform | Pre-assigned 0-1 (e.g., Uber=0.3, TaskRabbit=0.6) |
| 4 | Loan term | `loanTermMonths` | Divide by 18 (max term) |
| 5 | Document score | `min(docCount, requiredDocs) / requiredDocs` | Already 0-1 |
| 6 | Repayment history | Past loan performance via SSN hash | 0.5 default (no history), formula below |
| 7 | Aggregate exposure | `totalOutstandingBalance / (monthlyIncome * 3)` | Cap at 3.0, divide by 3; 0.0 if no active loans |

### Repayment History Formula

For repeat borrowers (matched via SSN hash), query all `RiskProfile` rows:

```
historyScore = (1 - lateRatio) * (anyDefault ? 0.5 : 1.0)
```

Where `lateRatio = totalLatePayments / totalPayments` across all past loans. No history = 0.5 (neutral).

### Model Output

Logistic regression produces a probability of default (0-1), scaled to risk score (0-100):

```
z = intercept + sum(features[i] * coefficients[i])
probability = 1 / (1 + exp(-z))
riskScore = probability * 100
```

Interest rate via continuous formula:

```
rate = minRate + (maxRate - minRate) * (riskScore / 100)
```

Where `minRate` and `maxRate` are admin-configurable LoanRules. No tiers — continuous mapping. No auto-reject — score determines rate only, admin retains approve/reject authority.

---

## 2. Database Changes

### Modified: `Application` table

- `riskScore: Decimal` — already exists, will now be populated during evaluation
- `bankBalance: Decimal` — **new column**, stored from Plaid balance fetch at application time

### Modified: `Application.status` enum

Add `DEFAULTED` as a terminal state after COLLECTIONS (90+ days configurable).

### Existing (now used): `RiskProfile` table

Already defined in schema but never populated. Will be populated when loans reach terminal states (PAID_OFF or DEFAULTED):

- `outcome`: "PAID_OFF" or "DEFAULTED"
- `totalPaid`: sum of paid payment amounts
- `totalOwed`: original loan total
- `latePaymentCount`: count of payments with late fees
- `completedAt` / `defaultedAt`: timestamp of terminal state

### New: `RiskModel` table

```prisma
model RiskModel {
  id           String   @id @default(cuid())
  version      Int      @default(autoincrement())
  coefficients String   // JSON: array of floats
  intercept    Float
  features     String   // JSON: feature names + normalization params
  trainingSize Int
  accuracy     Float
  precision    Float
  recall       Float
  isActive     Boolean  @default(false)
  createdAt    DateTime @default(now())
}
```

Only one row has `isActive = true` at a time. Previous models kept for rollback.

### New LoanRules

| Rule | Default | Purpose |
|------|---------|---------|
| `max_interest_rate` | 36 | Rate ceiling (%) |
| `retrain_threshold` | 50 | Completed loans before auto-retrain |
| `retrain_min_data` | 30 | Minimum training samples required |
| `default_threshold_days` | 90 | Days in COLLECTIONS before DEFAULTED |
| `completed_since_last_train` | 0 | Counter, reset after each training run |

---

## 3. Python Training Pipeline

### Script: `scripts/train_risk_model.py`

**Dependencies:** `scikit-learn`, `numpy`, `pandas` (in `scripts/requirements.txt`)

**Two modes:**

#### `--seed` (Cold Start)

- Generates synthetic feature vectors based on public lending default data distributions (LendingClub-style)
- Maps to our 7 features with known default outcomes
- Trains logistic regression on synthetic data
- Exports coefficients to `risk-model.json` and inserts `RiskModel` row (isActive=true)
- Run once during initial setup

#### `--retrain` (Live Data)

- Reads all `RiskProfile` rows from SQLite
- Joins with `Application` data to build feature matrix
- Splits 80/20 train/test
- Trains `LogisticRegression` with balanced class weights (handles imbalanced default rates)
- Validates: accuracy, precision, recall logged to stdout

**Safeguards:**
- Won't deploy if accuracy < 60% (logged as warning, previous model stays active)
- Won't retrain if total samples < `retrain_min_data`
- Previous model row kept (isActive set to false), rollback = flip the boolean
- Exports to both `risk-model.json` (file backup) and `RiskModel` table (source of truth)

**Database connection:** Direct SQLite read/write via Python's `sqlite3` module (same `dev.db` file).

---

## 4. TypeScript Inference Engine

### File: `src/lib/risk-model.ts`

**Functions:**

- **`loadActiveModel()`** — queries `RiskModel` for `isActive = true`, parses JSON fields. Cached in module-level variable with 5-minute TTL to avoid repeated DB reads.

- **`extractFeatures(application, activeLoansSummary, repaymentHistory)`** — builds normalized 7-element feature vector from application data, active loan exposure, and past loan performance.

- **`computeRiskScore(features, model)`** — dot product + sigmoid + scale to 0-100. Pure math, ~10 lines.

- **`calculateRate(riskScore)`** — loads `min_interest_rate` and `max_interest_rate` from LoanRules, applies linear formula, rounds to 2 decimal places.

- **`scoreApplication(applicationId)`** — orchestrator. Loads model, queries active loans and repayment history by SSN hash, extracts features, computes score, calculates rate. Returns `{ riskScore, interestRate, features }`.

### Integration

`evaluateApplication()` in the rules engine calls `scoreApplication()` instead of hardcoding `min_interest_rate` as the suggested rate. The rules engine still handles hard validation (loan limits, min amounts, term limits). Rate determination is fully delegated to the model.

If no active model exists (fresh install before seed), falls back to `min_interest_rate` with a logged warning.

---

## 5. Concurrent Loans & Exposure

### Submission Changes

- Remove the duplicate SSN rejection from `submitApplication()`
- Block only if there's a PENDING or APPROVED application for the same SSN (prevents double-submission, not repeat borrowing)
- New applications allowed when existing loans are ACTIVE, LATE, COLLECTIONS, PAID_OFF, or DEFAULTED

### New Query: `getActiveLoansBySSN(ssnHash)`

Returns all loans in ACTIVE, LATE, or COLLECTIONS status for a given SSN hash. Used during feature extraction to compute aggregate exposure.

### Exposure Calculation

```
totalOutstandingBalance = sum of remaining balance across all active loans
exposureRatio = totalOutstandingBalance / (monthlyIncome * 3)
normalizedExposure = min(exposureRatio, 3.0) / 3.0
```

No hard cap on concurrent loans — the exposure feature naturally increases the rate as leverage grows. Admin can still reject if overextended.

---

## 6. Plaid Balance Integration

### Token Exchange Enhancement

After Plaid token exchange in `src/actions/plaid.ts`, add a call to `plaidClient.accountsBalanceGet()`:

- Fetch current balance for the linked account
- Store in `Application.bankBalance`
- Also update during admin "Verify Income" refresh

### Minimal Change

One additional Plaid API call at application time. Balance data is already available from the Plaid account — this just stores it explicitly for the risk model.

---

## 7. RiskProfile Population & Retraining Trigger

### PAID_OFF (in payment-status cron)

When all payments for a loan are PAID:
1. Set application status to PAID_OFF (already happens)
2. Create `RiskProfile` row: `outcome = "PAID_OFF"`, `totalPaid` = sum of paid amounts, `latePaymentCount` = count of payments with late fees, `completedAt` = now
3. Increment `completed_since_last_train` LoanRule
4. Check threshold → spawn retrain if met

### DEFAULTED (in collections cron)

New escalation: if COLLECTIONS status has persisted for `default_threshold_days` (default 90):
1. Set application status to DEFAULTED
2. Create `RiskProfile` row: `outcome = "DEFAULTED"`, `defaultedAt` = now, `totalPaid` = sum of collected amounts, `latePaymentCount` from payment records
3. Increment `completed_since_last_train` LoanRule
4. Check threshold → spawn retrain if met

### Retrain Trigger

After incrementing the counter:
```
if completed_since_last_train >= retrain_threshold:
  spawn('python3', ['scripts/train_risk_model.py', '--retrain'])
  reset completed_since_last_train to 0
```

Child process runs asynchronously. If training fails (accuracy too low, insufficient data), the active model is unchanged and counter resets — it will re-trigger after the next batch.

---

## 8. Admin UI Changes

### Application Detail Page

**Replace** the current ad-hoc risk display (inline income-to-loan calculation) with model-driven output:

- **Risk Score card** — 0-100 score with color gradient (green at 0 → yellow at 50 → red at 100)
- **Calculated Rate** — model-determined interest rate, displayed prominently. No input field, no override.
- **Feature Breakdown table** — each feature's raw value, normalized value, and weight (coefficient). Lets admin understand the score. Example: "Income-to-loan ratio: 2.8 (normalized: 0.56, weight: -1.23)"
- **Borrower History section** — if repeat borrower, show past loans summary: count, outcomes, late payment rate
- **Active Exposure section** — if concurrent loans, show total outstanding balance and exposure ratio

### Approval Flow Change

- "Approve" button no longer shows interest rate input field
- Rate auto-set from model when admin clicks Approve
- Loan term input remains (admin can still adjust term)
- Admin retains full approve/reject authority

### Settings Page

New editable rules:
- `max_interest_rate`
- `retrain_threshold`
- `retrain_min_data`
- `default_threshold_days`

**Model Info panel** (read-only):
- Active model version, training date, sample size
- Accuracy, precision, recall
- Coefficient count
- "No model loaded" warning if seed hasn't been run

---

## 9. Files Overview

### New Files

| File | Purpose |
|------|---------|
| `src/lib/risk-model.ts` | TS inference engine (load model, extract features, compute score, calculate rate) |
| `src/lib/platform-risk.ts` | Gig platform risk factor lookup table |
| `scripts/train_risk_model.py` | Python training script (seed + retrain modes) |
| `scripts/requirements.txt` | Python dependencies (scikit-learn, numpy, pandas) |
| `risk-model.json` | Exported model coefficients (file backup) |

### Modified Files

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Add `RiskModel` table, `bankBalance` column on Application, DEFAULTED status |
| `prisma/seed.mts` | Add new LoanRules (max_interest_rate, retrain_threshold, etc.) |
| `src/lib/rules-engine.ts` | Call `scoreApplication()` for rate instead of hardcoding min_interest_rate |
| `src/actions/applications.ts` | Remove duplicate SSN block, store riskScore on evaluation, auto-set rate on approve |
| `src/actions/plaid.ts` | Add balance fetch after token exchange and during income refresh |
| `src/app/admin/applications/[id]/detail-client.tsx` | Replace ad-hoc risk display with model-driven UI, remove rate input |
| `src/app/admin/settings/settings-client.tsx` | Add model info panel |
| `src/app/api/cron/payment-status/route.ts` | Create RiskProfile on PAID_OFF, check retrain threshold |
| `src/app/api/cron/collections/route.ts` | Add DEFAULTED escalation, create RiskProfile, check retrain threshold |
