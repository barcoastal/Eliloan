export default function DisclosuresPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Lending Disclosures</h1>
      <div className="prose prose-gray">
        <p className="text-gray-600">Last updated: March 2026</p>

        <h2>Loan Terms</h2>
        <ul>
          <li><strong>Loan amounts:</strong> $100 – $10,000</li>
          <li><strong>Loan terms:</strong> 3 – 18 months</li>
          <li><strong>APR range:</strong> 30% – 60% (varies by risk profile)</li>
          <li><strong>Late fee:</strong> $25 per missed payment (after 3-day grace period)</li>
        </ul>

        <h2>Example Loan</h2>
        <p>A $5,000 loan at 36% APR over 12 months would have approximate monthly payments of $504.03 and total repayment of $6,048.36.</p>

        <h2>How Interest is Calculated</h2>
        <p>Interest is calculated using standard amortization. Each monthly payment consists of principal and interest. Early payments are interest-heavy, while later payments pay down more principal.</p>

        <h2>Late Payments</h2>
        <p>If a scheduled payment fails, we will retry daily. A $25 late fee is applied after a 3-day grace period. Accounts 30+ days overdue may be sent to collections.</p>

        <h2>Prepayment</h2>
        <p>You may pay off your loan early at any time without prepayment penalties.</p>
      </div>
    </div>
  );
}
