const PrivacyPage = () => {
  return (
    <div className="bg-surface min-h-[calc(100vh-64px)] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-border shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Data Protection & Privacy
            </span>
            <h1 className="text-3xl font-extrabold text-text-primary mt-1">
              Privacy Policy
            </h1>
            <p className="text-xs text-text-muted mt-2">
              Last updated: October 2026 • Compliant with Digital Personal Data Protection Act
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">1. Information We Collect</h3>
              <p>
                We collect personal registration details (name, email address, phone number), Bar Council enrollment credentials from advocates, consultation scheduling requests, and legal documents explicitly uploaded to active case files.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">2. How We Protect Your Data</h3>
              <p>
                All sensitive legal briefs, contracts, and court petitions uploaded through LexAdvocate are stored securely. Document downloads are gated behind authentication tokens verifying that the requester is the case client or assigned counsel.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">3. No Sale of User Data</h3>
              <p>
                LexAdvocate does not sell, rent, or trade your personal or case information to data brokers or advertising third parties. Your details are used solely to facilitate your consultations and legal practice.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">4. Cookies & Session Storage</h3>
              <p>
                We use secure tokens to maintain your login session. You may clear your session and cookies anytime by logging out of your account.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
