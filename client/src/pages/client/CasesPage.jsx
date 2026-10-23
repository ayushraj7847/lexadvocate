import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  Building,
  ChevronRight,
  Filter,
  FileText,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Avatar, Badge, Spinner, EmptyState } from '../../components/ui';
import { formatDate, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCases = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/cases/my?status=${statusFilter}` : '/cases/my';
      const { data } = await api.get(url);
      if (data.success) {
        setCases(data.data.cases || []);
      }
    } catch (err) {
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const filteredCases = cases.filter((c) =>
    searchQuery
      ? c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseReference?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Court Litigation Vault
          </span>
          <h1 className="text-2xl font-bold text-text-primary mt-0.5">
            My Legal Cases
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Track active court filings, procedural timelines, and upcoming hearing dates
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by case title or reference ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { label: 'All Cases', value: '' },
            { label: 'Active', value: 'active' },
            { label: 'Pending', value: 'pending' },
            { label: 'Closed', value: 'closed' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                statusFilter === tab.value
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="text-xs text-text-secondary mt-3">Loading court case files...</p>
        </div>
      ) : filteredCases.length > 0 ? (
        <div className="space-y-4">
          {filteredCases.map((c) => (
            <div
              key={c._id}
              className="card bg-white p-6 hover:shadow-card-hover transition-all duration-200 border border-border"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                      {c.caseReference}
                    </span>
                    <span className={`badge ${getStatusColor(c.status)} text-[10px]`}>
                      {c.status}
                    </span>
                    <span className="badge bg-surface text-text-secondary text-[10px]">
                      {c.caseType}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary">
                    {c.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-primary" />
                      {c.courtName || 'Court Assigned'}, {c.courtLocation || 'India'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-text-muted" />
                      Filing Date: {formatDate(c.filingDate)}
                    </span>
                    <span className="text-text-primary font-medium">
                      Advocate: {c.advocate?.name}
                    </span>
                  </div>
                </div>

                {/* Right Side: Next Hearing & Link */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                  {c.nextHearingDate ? (
                    <div className="text-left lg:text-right p-2.5 bg-primary-50/60 rounded-xl border border-primary-100">
                      <span className="text-[10px] text-text-muted uppercase font-bold flex items-center gap-1 lg:justify-end">
                        <Clock className="w-3 h-3 text-primary" /> Next Hearing Date
                      </span>
                      <p className="text-xs font-bold text-primary mt-0.5">
                        {formatDate(c.nextHearingDate)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-text-muted">No hearing scheduled</span>
                  )}

                  <Link
                    to={`/client/cases/${c._id}`}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    View Case Timeline & Briefs <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Progress Timeline preview */}
              {c.progressTimeline?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-text-secondary">
                  <span className="font-semibold text-text-primary">Latest Stage:</span>
                  <span className="bg-surface px-2 py-0.5 rounded text-text-primary font-medium">
                    {c.progressTimeline[c.progressTimeline.length - 1].stage}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    ({formatDate(c.progressTimeline[c.progressTimeline.length - 1].date)})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center">
          <EmptyState
            icon={Briefcase}
            title="No Case Files Found"
            description="You currently have no legal matters under this view. Case records created by your assigned advocate will be listed here automatically."
          />
        </div>
      )}
    </div>
  );
};

export default CasesPage;
