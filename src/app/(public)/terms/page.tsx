export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-gray">
        <p className="text-gray-600">Last updated: March 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using the 1099 Loan Portal, you agree to be bound by these Terms of Service.</p>

        <h2>2. Loan Products</h2>
        <p>We offer personal loans ranging from $100 to $10,000 with terms up to 18 months. Interest rates are determined based on your risk profile and may vary. All loan terms, including APR and repayment schedule, will be disclosed before you accept the loan.</p>

        <h2>3. Eligibility</h2>
        <p>To apply for a loan, you must be at least 18 years old, a U.S. resident, and have a valid bank account. Approval is subject to income verification and our underwriting criteria.</p>

        <h2>4. Repayment</h2>
        <p>Loan repayments are collected via ACH debit from your linked bank account on a monthly schedule. Late payments may incur fees. Failure to repay may result in collection actions.</p>

        <h2>5. Privacy</h2>
        <p>Your personal information is handled in accordance with our <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>.</p>

        <h2>6. Contact</h2>
        <p>For questions about these terms, contact us at support@1099loanportal.com.</p>
      </div>
    </div>
  );
}
