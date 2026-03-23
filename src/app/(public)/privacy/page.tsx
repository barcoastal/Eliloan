export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-gray">
        <p className="text-gray-600">Last updated: March 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect: personal information (name, email, phone, SSN), financial information (income, bank account details via Plaid), and uploaded documents (pay stubs, identification).</p>

        <h2>2. How We Use Your Information</h2>
        <p>Your information is used to: process your loan application, verify your identity and income, determine loan eligibility and terms, collect loan payments, and communicate with you about your account.</p>

        <h2>3. Data Security</h2>
        <p>Sensitive data including SSN and bank credentials are encrypted at rest using AES-256 encryption. We use Plaid for secure bank connections — your banking credentials are never stored on our servers.</p>

        <h2>4. Third-Party Services</h2>
        <p>We use Plaid for bank account verification and income data. Plaid&apos;s privacy practices are governed by their own privacy policy.</p>

        <h2>5. Data Retention</h2>
        <p>We retain your data for as long as your loan is active plus 7 years for regulatory compliance.</p>

        <h2>6. Your Rights</h2>
        <p>You may request access to or deletion of your personal data by contacting us at privacy@1099loanportal.com.</p>
      </div>
    </div>
  );
}
