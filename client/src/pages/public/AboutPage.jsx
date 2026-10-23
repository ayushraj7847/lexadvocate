import { Link } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  Award,
  Users,
  Target,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-[calc(100vh-64px)]">
      {/* Hero Header */}
      <section className="bg-surface py-16 lg:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Our Mission & Vision
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary mt-2 tracking-tight">
            Democratizing Legal Access Through Trust & Technology
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-4 leading-relaxed">
            LexAdvocate was founded to modernize citizen and corporate access to legal chambers in India. We combine Bar Council verification, transparent consultation rates, and intuitive case tracking.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Guiding Principles
            </span>
            <h2 className="text-3xl font-bold text-text-primary mt-1">
              Built on Pillars of Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Absolute Transparency</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Clear upfront consultation fees, verified Bar Council enrollment credentials, and zero surprise surcharges.
              </p>
            </div>

            <div className="card p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Attorney-Client Privilege</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Encrypted document repositories and restricted communication channels preserve strict confidentiality.
              </p>
            </div>

            <div className="card p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Courtroom Excellence</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Connecting clients with seasoned advocates possessing direct High Court, Supreme Court, and tribunal experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Experience the LexAdvocate Difference
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
            Schedule a legal consultation or manage your ongoing cases with complete clarity.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/advocates" className="btn-primary text-xs px-6 py-2.5">
              Browse Advocates
            </Link>
            <Link to="/contact" className="btn-secondary text-xs px-6 py-2.5">
              Contact Chambers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
