const TermsPage = () => {
  return (
    <div className="bg-surface min-h-[calc(100vh-64px)] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-border shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Legal Agreement
            </span>
            <h1 className="text-3xl font-extrabold text-text-primary mt-1">
              Terms & Conditions
            </h1>
            <p className="text-xs text-text-muted mt-2">
              Last updated: October 2026 • Effective immediately
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-text-secondary space-y-6 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">1. Platform Nature</h3>
              <p>
                LexAdvocate is a legal communication and practice management technology platform. LexAdvocate does not act as a law firm and does not solicit legal representation or advertise legal services under the Advocates Act, 1961 and Bar Council of India rules.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">2. Advocate-Client Relationship</h3>
              <p>
                Transmission of information via LexAdvocate or scheduling an online consultation creates an attorney-client relationship strictly between the user and the participating advocate. LexAdvocate does not control or guarantee the outcome of any judicial matter.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">3. Consultation Bookings & Cancellations</h3>
              <p>
                Clients may cancel confirmed bookings up to 2 hours prior to scheduled consultation times for a full refund. Cancellations made within 2 hours or no-shows are non-refundable unless agreed otherwise by the advocate.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">4. Document Privacy & Confidentiality</h3>
              <p>
                Case records and documents uploaded through our vault are restricted exclusively to authorized participating users. We enforce end-to-end access authorization and do not inspect legal documents.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-text-primary">5. Governing Law & Jurisdiction</h3>
              <p>
                These terms shall be governed by and construed in accordance with the substantive laws of the Republic of India. Any disputes arising out of the use of this service shall be subject to the exclusive jurisdiction of the competent courts in New Delhi.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
