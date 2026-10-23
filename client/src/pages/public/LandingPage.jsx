import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  Search,
  ShieldCheck,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  Star,
  Users,
  Award,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Building,
  HeartHandshake,
  Briefcase,
  FileCheck2,
} from 'lucide-react';
import AdvocateCard from '../../components/shared/AdvocateCard';
import { Button, Spinner } from '../../components/ui';
import api from '../../services/api';

const practiceAreas = [
  {
    id: 'criminal',
    title: 'Criminal Law',
    desc: 'Bail applications, criminal defense, white-collar crimes & appeals.',
    icon: ShieldCheck,
    count: '140+ Advocates',
  },
  {
    id: 'family',
    title: 'Family Law',
    desc: 'Divorce proceedings, child custody, alimony & domestic settlements.',
    icon: HeartHandshake,
    count: '95+ Advocates',
  },
  {
    id: 'property',
    title: 'Property Law',
    desc: 'RERA disputes, title verification, land litigation & tenant conflicts.',
    icon: Building,
    count: '110+ Advocates',
  },
  {
    id: 'corporate',
    title: 'Corporate Law',
    desc: 'Startup advisory, contracts, mergers, IPR & NCLT proceedings.',
    icon: Briefcase,
    count: '80+ Advocates',
  },
  {
    id: 'civil',
    title: 'Civil Law',
    desc: 'Contract enforcement, recovery suits, injunctions & writ petitions.',
    icon: Scale,
    count: '160+ Advocates',
  },
  {
    id: 'consumer',
    title: 'Consumer Law',
    desc: 'Product liability, builder fraud, medical negligence & banking claims.',
    icon: FileCheck2,
    count: '75+ Advocates',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Search & Compare',
    desc: 'Filter verified advocates by specialization, city, court, rating, and consultation fees.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Book a Slot',
    desc: 'Select audio, video, or in-person consultation and pick a convenient date & time slot.',
    icon: Calendar,
  },
  {
    step: '03',
    title: 'Consult & Track',
    desc: 'Meet your advocate, securely share case files, and track case hearing dates online.',
    icon: FileText,
  },
];

const testimonials = [
  {
    quote:
      'Finding a specialized criminal defense advocate in Delhi was overwhelming until I used LexAdvocate. We booked an urgent consultation and got anticipatory bail granted in record time.',
    author: 'Rajiv Malhotra',
    location: 'New Delhi',
    caseType: 'Criminal Defense Consultation',
    rating: 5,
  },
  {
    quote:
      'The real-time case timeline and document vault kept our entire founding team informed throughout an arbitration process. Absolute transparency and top-tier legal advice.',
    author: 'Pooja Kulkarni',
    location: 'Bengaluru',
    caseType: 'Corporate Shareholder Dispute',
    rating: 5,
  },
  {
    quote:
      'Advocate Meenakshi handled our family dispute with immense sensitivity and clarity. The transparent consultation fee structure was a breath of fresh air.',
    author: 'Devendra Nair',
    location: 'Chennai',
    caseType: 'Family & Custody Matter',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'How does consultation booking work on LexAdvocate?',
    a: 'You can browse verified advocates, view their fees and available slots, and book a consultation instantly. Once booked, you receive calendar invites and video meeting links directly on your dashboard.',
  },
  {
    q: 'Are all advocates on LexAdvocate verified?',
    a: 'Yes. Every advocate registers with their official State Bar Council enrollment number, credentials, and identity verification before their profile is published.',
  },
  {
    q: 'Can I track ongoing legal cases and court hearing dates?',
    a: 'Yes! When an advocate creates your case record, you can log in anytime to view your case timeline, hearing schedules, legal documents, and attorney case notes.',
  },
  {
    q: 'What consultation formats are available?',
    a: 'Advocates offer High-Definition Video Consultations, Phone Consultations, and In-Chambers In-Person Consultations depending on your preference.',
  },
  {
    q: 'Is my confidential legal information secure?',
    a: 'LexAdvocate implements strict role-based access control, encrypted document storage, and private communication channels ensuring attorney-client privilege.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [featuredAdvocates, setFeaturedAdvocates] = useState([]);
  const [loadingAdvocates, setLoadingAdvocates] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/advocates?limit=3&sortBy=rating');
        if (data.success && data.data.advocates.length > 0) {
          setFeaturedAdvocates(data.data.advocates);
        }
      } catch (err) {
        console.error('Failed to load featured advocates');
      } finally {
        setLoadingAdvocates(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchName) params.append('search', searchName);
    if (searchCity) params.append('city', searchCity);
    if (selectedPracticeArea) params.append('practiceArea', selectedPracticeArea);
    navigate(`/advocates?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-white py-16 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 text-primary text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" />
              Verified Bar Council Advocates Across India
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
              Trusted Legal Support,{' '}
              <span className="text-primary underline decoration-red-200 decoration-wavy decoration-2">
                Just a Click Away.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Consult top-rated High Court and Supreme Court advocates online. Track case proceedings, review legal documents, and schedule consultations with complete fee transparency.
            </p>

            {/* Quick Hero CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/advocates" className="btn-primary text-base px-7 py-3 shadow-md hover:shadow-lg">
                Find an Advocate
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/practice-areas" className="btn-secondary text-base px-6 py-3">
                Explore Practice Areas
              </Link>
            </div>
          </div>

          {/* Search Bar Card */}
          <div className="mt-12 max-w-4xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-border flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 border border-border rounded-xl bg-surface/50">
                <Search className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Advocate name or keyword..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-text-muted text-text-primary"
                />
              </div>

              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 border border-border rounded-xl bg-surface/50">
                <Scale className="w-4 h-4 text-primary shrink-0" />
                <select
                  value={selectedPracticeArea}
                  onChange={(e) => setSelectedPracticeArea(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none text-text-primary"
                >
                  <option value="">All Practice Areas</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Property Law">Property Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Civil Law">Civil Law</option>
                  <option value="Consumer Law">Consumer Law</option>
                </select>
              </div>

              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 border border-border rounded-xl bg-surface/50">
                <Building className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Delhi, Mumbai)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-text-muted text-text-primary"
                />
              </div>

              <button
                type="submit"
                className="btn-primary md:px-8 py-3 rounded-xl shadow-sm text-sm"
              >
                Search
              </button>
            </form>

            {/* Quick stats banner below search */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-surface rounded-xl border border-border">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-xs text-text-secondary mt-0.5">Verified Advocates</p>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border">
                <p className="text-2xl font-bold text-primary">12,000+</p>
                <p className="text-xs text-text-secondary mt-0.5">Consultations Held</p>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border">
                <p className="text-2xl font-bold text-primary">4.9 / 5</p>
                <p className="text-xs text-text-secondary mt-0.5">Client Satisfaction</p>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border">
                <p className="text-2xl font-bold text-primary">28+</p>
                <p className="text-xs text-text-secondary mt-0.5">Indian States Covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRACTICE AREAS SECTION */}
      <section className="py-20 bg-surface/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Specialized Legal Chambers
              </span>
              <h2 className="text-3xl font-bold text-text-primary mt-1">
                Explore Legal Practice Areas
              </h2>
              <p className="text-sm text-text-secondary mt-2 max-w-xl">
                Get specialized counsel tailored specifically to your legal issue from seasoned legal practitioners.
              </p>
            </div>
            <Link
              to="/practice-areas"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View all practice areas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.id}
                  onClick={() => navigate(`/advocates?practiceArea=${encodeURIComponent(area.title)}`)}
                  className="card hover:shadow-card-hover transition-all duration-200 cursor-pointer group hover:border-primary/40 bg-white"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                    {area.desc}
                  </p>
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-medium text-text-secondary">
                    <span>{area.count}</span>
                    <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Browse <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED ADVOCATES SECTION */}
      <section className="py-20 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Distinguished Advocates
              </span>
              <h2 className="text-3xl font-bold text-text-primary mt-1">
                Featured Legal Counsel
              </h2>
              <p className="text-sm text-text-secondary mt-2">
                Consult with verified advocates with proven track records in state high courts and tribunals.
              </p>
            </div>
            <Link
              to="/advocates"
              className="mt-4 md:mt-0 btn-secondary text-xs"
            >
              Browse Complete Directory
            </Link>
          </div>

          {loadingAdvocates ? (
            <div className="py-16 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : featuredAdvocates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAdvocates.map((adv) => (
                <AdvocateCard key={adv._id} advocate={adv} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary py-12">
              No advocates found. Please run the seed command.
            </p>
          )}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-bold text-text-primary mt-1">
              How LexAdvocate Works
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              From initial consultation to hearing schedules, managing legal matters has never been this straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative card bg-white p-8 text-center flex flex-col items-center"
                >
                  <span className="absolute top-4 right-4 text-3xl font-black text-gray-200">
                    {step.step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BENEFITS / TRUST METRICS */}
      <section className="py-20 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Why Choose LexAdvocate
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight">
                Modern Legal Practice Designed for Trust & Efficiency
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Traditional legal processes are opaque, geographically constrained, and unpredictable. LexAdvocate bridges the gap between citizens, businesses, and certified advocates with clarity.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: '100% Bar Council Verified Advocates',
                    desc: 'Every advocate profile undergoes strict credential and enrollment verification.',
                  },
                  {
                    title: 'Transparent, Upfront Fixed Fees',
                    desc: 'No hidden consultation surcharges. Pay securely via card, UPI, or test mode.',
                  },
                  {
                    title: 'Private Document Vault & Real-Time Case Timelines',
                    desc: 'Upload court briefs securely and stay informed with visual hearing progression.',
                  },
                  {
                    title: 'Direct Advocate Communication',
                    desc: 'Real-time messaging with your counsel for instant clarifications and filing updates.',
                  },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-success flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Trust Card */}
            <div className="bg-gradient-to-tr from-red-50 to-surface rounded-3xl p-8 border border-border shadow-md space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">LexAdvocate Guarantee</h4>
                    <p className="text-xs text-text-secondary">Official Legal Technology Standards</p>
                  </div>
                </div>
                <span className="badge bg-green-100 text-success text-xs font-semibold">Active</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-border">
                  <p className="text-xs text-text-muted">Average Response Time</p>
                  <p className="text-xl font-bold text-primary mt-1">&lt; 30 Mins</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-border">
                  <p className="text-xs text-text-muted">Client Rating</p>
                  <p className="text-xl font-bold text-text-primary mt-1">4.9 / 5.0 ⭐</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-border">
                  <p className="text-xs text-text-muted">High Courts Covered</p>
                  <p className="text-xl font-bold text-text-primary mt-1">25 Courts</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-border">
                  <p className="text-xs text-text-muted">Client Privacy</p>
                  <p className="text-xl font-bold text-success mt-1">Encrypted</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-border text-center">
                <p className="text-xs font-semibold text-text-primary mb-2">
                  Need Immediate Legal Guidance?
                </p>
                <Link to="/advocates" className="btn-primary w-full text-xs">
                  Schedule Consultation Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (Clearly labeled demo content as requested) */}
      <section className="py-20 bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Client Testimonials (Demo Content)
            </span>
            <h2 className="text-3xl font-bold text-text-primary mt-1">
              What Clients Say About LexAdvocate
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Real feedback from individuals and startup founders who consulted through our network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card bg-white p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {Array.from({ length: t.rating }).map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm text-text-primary">{t.author}</h4>
                  <p className="text-xs text-text-secondary">{t.location}</p>
                  <span className="inline-block mt-2 text-[11px] font-medium text-primary bg-primary-50 px-2.5 py-0.5 rounded-full">
                    {t.caseType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Common Inquiries
            </span>
            <h2 className="text-3xl font-bold text-text-primary mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Everything you need to know about booking, court tracking, and consultation policies.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-border rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 bg-white hover:bg-surface/50"
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-secondary transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-secondary bg-surface/30 border-t border-border/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CALL TO ACTION */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Resolve Your Legal Query?
          </h2>
          <p className="text-base text-red-100 max-w-xl mx-auto">
            Book a confidential consultation with a qualified advocate today. Clear counsel, secure documents, and full peace of mind.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/advocates"
              className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-md text-sm"
            >
              Find an Advocate
            </Link>
            <Link
              to="/register?role=advocate"
              className="px-8 py-3.5 bg-primary-dark text-white font-bold rounded-xl hover:bg-black/30 border border-white/20 transition-colors text-sm"
            >
              Join as an Advocate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
