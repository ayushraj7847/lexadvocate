import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Briefcase,
  FileText,
  Search,
  ArrowRight,
  Clock,
  Video,
  ShieldCheck,
  Star,
  PlusCircle,
  Building,
  HeartHandshake,
  FileCheck2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Badge, Button, StarRating, Spinner } from '../../components/ui';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';

const practiceAreaShortcuts = [
  { name: 'Criminal Law', icon: ShieldCheck, color: 'text-red-600 bg-red-50' },
  { name: 'Family Law', icon: HeartHandshake, color: 'text-pink-600 bg-pink-50' },
  { name: 'Property Law', icon: Building, color: 'text-amber-600 bg-amber-50' },
  { name: 'Corporate Law', icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
  { name: 'Civil Law', icon: FileText, color: 'text-purple-600 bg-purple-50' },
  { name: 'Consumer Law', icon: FileCheck2, color: 'text-emerald-600 bg-emerald-50' },
];

const ClientDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    activeCases: 0,
    totalDocuments: 0,
    savedCount: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [activeCases, setActiveCases] = useState([]);
  const [topAdvocates, setTopAdvocates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, casesRes, docsRes, savedRes, advRes] = await Promise.all([
          api.get('/bookings/my?limit=3'),
          api.get('/cases/my?status=active&limit=3'),
          api.get('/documents/my'),
          api.get('/advocates/saved').catch(() => ({ data: { data: { saved: [] } } })),
          api.get('/advocates?limit=3&sortBy=rating'),
        ]);

        const bookings = bookingsRes.data.data?.bookings || [];
        const cases = casesRes.data.data?.cases || [];
        const docs = docsRes.data.data?.documents || [];
        const saved = savedRes.data.data?.saved || [];
        const advocates = advRes.data.data?.advocates || [];

        setRecentBookings(bookings);
        setActiveCases(cases);
        setTopAdvocates(advocates);

        setStats({
          upcomingBookings: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
          activeCases: cases.length,
          totalDocuments: docs.length,
          savedCount: saved.length,
        });
      } catch (err) {
        console.error('Error fetching client dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/advocates?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-3">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Greeting & Quick Search Bar */}
      <div className="bg-gradient-to-r from-red-50/80 via-white to-surface p-6 sm:p-8 rounded-3xl border border-border shadow-xs">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Client Portal Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
            Good day, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
            Manage your legal consultations, review hearing schedules, and consult with high-rated counsel across all jurisdictions.
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search advocates by name, court, or legal specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 text-xs sm:text-sm py-2.5 bg-white shadow-xs"
              />
            </div>
            <button type="submit" className="btn-primary text-xs py-2.5 px-5">
              Find Advocate
            </button>
          </form>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/client/bookings"
          className="card p-5 hover:border-primary/40 transition-colors group flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-text-muted font-medium">Pending & Upcoming</p>
            <p className="text-2xl font-bold text-text-primary mt-1 group-hover:text-primary transition-colors">
              {stats.upcomingBookings}
            </p>
            <span className="text-[11px] text-text-secondary mt-0.5 block">Consultations</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/client/cases"
          className="card p-5 hover:border-primary/40 transition-colors group flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-text-muted font-medium">Active Cases</p>
            <p className="text-2xl font-bold text-text-primary mt-1 group-hover:text-primary transition-colors">
              {stats.activeCases}
            </p>
            <span className="text-[11px] text-text-secondary mt-0.5 block">Court proceedings</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/client/documents"
          className="card p-5 hover:border-primary/40 transition-colors group flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-text-muted font-medium">Document Vault</p>
            <p className="text-2xl font-bold text-text-primary mt-1 group-hover:text-primary transition-colors">
              {stats.totalDocuments}
            </p>
            <span className="text-[11px] text-text-secondary mt-0.5 block">Stored briefs & files</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/client/saved"
          className="card p-5 hover:border-primary/40 transition-colors group flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-text-muted font-medium">Saved Counsel</p>
            <p className="text-2xl font-bold text-text-primary mt-1 group-hover:text-primary transition-colors">
              {stats.savedCount}
            </p>
            <span className="text-[11px] text-text-secondary mt-0.5 block">Shortlisted advocates</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* 3. Practice Areas Quick Navigation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-text-primary">
            Explore Legal Specialties
          </h2>
          <Link
            to="/advocates"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            All Practice Areas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {practiceAreaShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(`/advocates?practiceArea=${encodeURIComponent(item.name)}`)}
                className="card p-3.5 text-center hover:shadow-card-hover transition-all duration-200 border border-border flex flex-col items-center group bg-white"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Engagements: Upcoming Bookings & Active Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Consultations */}
        <div className="card bg-white p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">My Consultations</h3>
            </div>
            <Link to="/client/bookings" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-3.5 rounded-xl border border-border hover:border-gray-300 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={b.advocate?.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {b.advocate?.name}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {formatDate(b.consultationDate)} • {b.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge ${getStatusColor(b.status)} text-[10px]`}>
                      {b.status}
                    </span>
                    <Link
                      to={`/client/bookings/${b._id}`}
                      className="p-1 text-text-muted hover:text-primary"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-surface/50 rounded-xl border border-dashed border-border">
              <p className="text-xs text-text-muted">No consultations scheduled yet.</p>
              <Link to="/advocates" className="btn-primary text-xs py-1.5 px-3 mt-3 inline-flex">
                Book a Consultation
              </Link>
            </div>
          )}
        </div>

        {/* Active Cases & Court Dates */}
        <div className="card bg-white p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">Active Cases & Hearings</h3>
            </div>
            <Link to="/client/cases" className="text-xs font-semibold text-primary hover:underline">
              View All Cases
            </Link>
          </div>

          {activeCases.length > 0 ? (
            <div className="space-y-3">
              {activeCases.map((c) => (
                <div
                  key={c._id}
                  className="p-3.5 rounded-xl border border-border hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-primary font-mono">
                        {c.caseReference}
                      </span>
                      <h4 className="text-xs font-bold text-text-primary mt-0.5 truncate max-w-xs">
                        {c.title}
                      </h4>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Court: {c.courtName || 'Court Assigned'}
                      </p>
                    </div>
                    <span className={`badge ${getStatusColor(c.status)} text-[10px]`}>
                      {c.status}
                    </span>
                  </div>

                  {c.nextHearingDate && (
                    <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[11px]">
                      <span className="text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" /> Next Hearing:
                      </span>
                      <span className="font-semibold text-text-primary">
                        {formatDate(c.nextHearingDate)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-surface/50 rounded-xl border border-dashed border-border">
              <p className="text-xs text-text-muted">No active court cases found.</p>
              <p className="text-[11px] text-text-secondary mt-1">
                Your assigned advocate will link cases directly to your portal.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Recommended Top Rated Advocates */}
      <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Top Rated Advocates Available for Consultation
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Verified legal practitioners with top ratings in civil, criminal, and corporate matters
            </p>
          </div>
          <Link to="/advocates" className="btn-secondary text-xs py-1.5 px-3">
            Browse All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topAdvocates.map((adv) => (
            <div
              key={adv._id}
              className="p-4 rounded-2xl border border-border bg-surface/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <Avatar name={adv.user?.name} size="md" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-text-primary truncate">
                      {adv.user?.name}
                    </h4>
                    <p className="text-[11px] text-text-secondary truncate">
                      {adv.designation || 'Advocate'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs mb-3">
                  <StarRating rating={adv.rating} size="sm" />
                  <span className="font-bold text-xs text-text-primary">{adv.rating?.toFixed(1)}</span>
                  <span className="text-[10px] text-text-muted">({adv.totalReviews})</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {(adv.practiceAreas || []).slice(0, 2).map((a) => (
                    <Badge key={a} variant="red" className="text-[10px] py-0 px-2">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-primary">
                  {formatCurrency(adv.consultationFee)}
                </span>
                <Link
                  to={`/client/book/${adv.user?._id || adv._id}`}
                  className="btn-primary text-[11px] py-1 px-3"
                >
                  Book Slot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
