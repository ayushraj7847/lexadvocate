import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  HeartHandshake,
  Building,
  Briefcase,
  Scale,
  FileCheck2,
  Users,
  Award,
  ArrowRight,
  Gavel,
  Landmark,
  FileText,
} from 'lucide-react';

const allPracticeAreas = [
  {
    title: 'Criminal Law',
    icon: ShieldCheck,
    tagline: 'Defending liberties, bail jurisprudence & trial advocacy',
    desc: 'Expert representation for FIR quashing, regular & anticipatory bails, economic offenses, cybercrimes, and trial defense in Sessions and High Courts.',
    specialties: ['Anticipatory Bail', 'FIR Quashing', 'PMLA & White-Collar', 'NDPS Matters', 'Trial Defense'],
  },
  {
    title: 'Family Law',
    icon: HeartHandshake,
    tagline: 'Compassionate counsel for sensitive family disputes',
    desc: 'Specialized counsel in mutual and contested divorce proceedings, permanent alimony, child custody guardianship, and domestic violence protections.',
    specialties: ['Mutual Consent Divorce', 'Child Custody', 'Maintenance / Alimony', 'Domestic Violence', 'Mediation'],
  },
  {
    title: 'Property Law',
    icon: Building,
    tagline: 'Protecting land ownership and real estate investments',
    desc: 'Due diligence for real estate acquisition, title search verification, RERA complaint adjudication, partition suits, and builder-buyer delay compensation.',
    specialties: ['RERA Complaints', 'Title Due Diligence', 'Partition Suits', 'Tenant Eviction', 'Land Acquisition'],
  },
  {
    title: 'Corporate Law',
    icon: Briefcase,
    tagline: 'Commercial advisory for enterprises and founders',
    desc: 'Company incorporation, shareholder agreements, seed/Series A investment term sheets, employment policies, and NCLT insolvency proceedings.',
    specialties: ['M&A / Investments', 'Founder Agreements', 'NCLT & IBC', 'Commercial Contracts', 'Compliance Audits'],
  },
  {
    title: 'Civil Law',
    icon: Scale,
    tagline: 'Remedies for breach of contracts and civil rights',
    desc: 'Filing and contesting recovery suits, permanent injunctions, declaration of title, execution petitions, and high court writ jurisdiction.',
    specialties: ['Money Recovery Suits', 'Specific Performance', 'Civil Injunctions', 'Writ Petitions', 'Appellate Litigation'],
  },
  {
    title: 'Consumer Law',
    icon: FileCheck2,
    tagline: 'Holding corporations and service providers accountable',
    desc: 'Enforcing consumer rights before District, State, and National Consumer Dispute Redressal Commissions against deficient services and unfair trade.',
    specialties: ['Builder Delay Claims', 'Medical Negligence', 'Insurance Repudiation', 'E-Commerce Fraud', 'Defective Products'],
  },
  {
    title: 'Constitutional Law',
    icon: Landmark,
    tagline: 'Challenging ultra vires state action & rights violations',
    desc: 'Public interest litigations (PIL), fundamental rights enforcement under Article 32 & 226, service matters, and administrative tribunal appeals.',
    specialties: ['Habeas Corpus & Mandamus', 'Service & CAT Matters', 'PIL Litigation', 'Tender Arbitrariness', 'Review Petitions'],
  },
  {
    title: 'Intellectual Property',
    icon: Gavel,
    tagline: 'Guarding patents, copyrights, trademarks and trade secrets',
    desc: 'Trademark search & opposition, copyright infringement cease-and-desist notices, software IP licensing, and design patent litigation.',
    specialties: ['Trademark Registration', 'Copyright Infringement', 'Patent Licensing', 'Trade Secrets', 'Counterfeiting Suits'],
  },
];

const PracticeAreasPage = () => {
  return (
    <div className="bg-surface min-h-[calc(100vh-64px)] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Chambers & Specializations
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-1">
            Comprehensive Legal Practice Areas
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-3 leading-relaxed">
            Every legal challenge demands dedicated subject-matter acumen. Choose your practice area to connect with advocates possessing court-tested mastery.
          </p>
        </div>

        {/* Practice Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allPracticeAreas.map((area, i) => {
            const Icon = area.icon;
            return (
              <div
                key={i}
                className="card bg-white p-6 sm:p-8 hover:shadow-card-hover transition-all duration-200 border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">{area.title}</h3>
                      <p className="text-xs text-primary font-medium">{area.tagline}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                    {area.desc}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      Common Matters Handled:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {area.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="badge bg-surface text-text-primary text-xs border border-border"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-text-muted">Verified State & National Counsel</span>
                  <Link
                    to={`/advocates?practiceArea=${encodeURIComponent(area.title)}`}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    Find {area.title} Advocates <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PracticeAreasPage;
