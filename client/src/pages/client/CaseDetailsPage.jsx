import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  Circle,
  AlertCircle,
  User,
  ShieldAlert,
} from 'lucide-react';
import { Avatar, Badge, Spinner } from '../../components/ui';
import { formatDate, formatFileSize, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const standardStages = [
  { key: 'Case Filed', label: 'Case Filed' },
  { key: 'Documents Verified', label: 'Documents Verified' },
  { key: 'Hearing Scheduled', label: 'Hearing Scheduled' },
  { key: 'Hearing Completed', label: 'Hearing Completed' },
  { key: 'Case Closed', label: 'Case Closed' },
];

const CaseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/cases/${id}`);
        if (data.success) {
          setCaseData(data.data.case);
        }
      } catch (err) {
        toast.error('Failed to load case details');
      } finally {
        setLoading(false);
      }
    };
    fetchCaseDetails();
  }, [id]);

  const handleDownloadDoc = (docId, fileName) => {
    const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/documents/${docId}/download`;
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-3">Loading case records...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-bold text-text-primary">Case Record Not Found</h2>
        <Link to="/client/cases" className="btn-primary text-xs mt-4 inline-flex">
          Back to Cases
        </Link>
      </div>
    );
  }

  // Determine stage completion for visual timeline
  const completedStages = new Set((caseData.progressTimeline || []).map((p) => p.stage));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/client/cases')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Cases
        </button>
      </div>

      {/* Case Header Card */}
      <div className="card bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-primary bg-primary-50 px-2.5 py-0.5 rounded">
                {caseData.caseReference}
              </span>
              <span className={`badge ${getStatusColor(caseData.status)} text-xs`}>
                {caseData.status}
              </span>
              <span className="badge bg-surface text-text-secondary text-xs">
                {caseData.caseType}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
              {caseData.title}
            </h1>

            <p className="text-xs text-text-secondary flex items-center gap-2 pt-1">
              <Building className="w-4 h-4 text-primary" />
              {caseData.courtName || 'Court Assigned'}, {caseData.courtLocation || 'India'}
            </p>
          </div>

          {/* Hearing Alert */}
          {caseData.nextHearingDate && (
            <div className="p-4 bg-primary-50/80 rounded-2xl border border-primary-200 text-left md:text-right shrink-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1 md:justify-end">
                <Clock className="w-3.5 h-3.5" /> Next Hearing Date
              </span>
              <p className="text-base font-extrabold text-text-primary mt-0.5">
                {formatDate(caseData.nextHearingDate)}
              </p>
              <span className="text-[11px] text-text-secondary">Appearing before Judge</span>
            </div>
          )}
        </div>

        {/* Advocate & Filing Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-surface rounded-xl border border-border">
            <span className="text-text-muted block">Assigned Legal Counsel</span>
            <span className="font-bold text-text-primary mt-0.5 block">{caseData.advocate?.name}</span>
            <span className="text-text-secondary">{caseData.advocate?.email}</span>
          </div>

          <div className="p-3.5 bg-surface rounded-xl border border-border">
            <span className="text-text-muted block">Formal Filing Date</span>
            <span className="font-bold text-text-primary mt-0.5 block">{formatDate(caseData.filingDate)}</span>
            <span className="text-text-secondary">Official Registry Entry</span>
          </div>

          <div className="p-3.5 bg-surface rounded-xl border border-border">
            <span className="text-text-muted block">Client On Record</span>
            <span className="font-bold text-text-primary mt-0.5 block">{caseData.client?.name}</span>
            <span className="text-text-secondary">Petitioner / Applicant</span>
          </div>
        </div>

        {/* Visual Progress Timeline (Section 8 Requirement) */}
        <div>
          <h2 className="text-sm font-bold text-text-primary mb-4">
            Procedural Case Timeline
          </h2>

          <div className="p-5 bg-surface/50 rounded-2xl border border-border">
            {/* Visual step progress bar */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {standardStages.map((st, idx) => {
                const isDone = completedStages.has(st.key);
                return (
                  <div key={st.key} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isDone
                          ? 'bg-success text-white ring-4 ring-green-100'
                          : 'bg-white border-2 border-border text-text-muted'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isDone ? 'text-text-primary' : 'text-text-muted'}`}>
                        {st.label}
                      </p>
                      <span className="text-[10px] text-text-secondary">
                        {isDone ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Timeline Events Feed */}
            {caseData.progressTimeline?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Timeline Log History
                </h3>
                <div className="space-y-3">
                  {caseData.progressTimeline.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-border">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-text-primary">{item.stage}</h4>
                          <span className="text-[10px] text-text-muted">{formatDate(item.date)}</span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-text-secondary mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Case Notes & Brief Overview */}
        {caseData.description && (
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Case Summary & Facts
            </h3>
            <div className="p-4 bg-surface rounded-xl border border-border text-xs sm:text-sm text-text-secondary leading-relaxed">
              {caseData.description}
            </div>
          </div>
        )}

        {caseData.notes && (
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Attorney Notes for Next Hearing
            </h3>
            <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-200 text-xs text-text-primary leading-relaxed">
              {caseData.notes}
            </div>
          </div>
        )}

        {/* Associated Case Documents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Associated Case Documents ({caseData.documents?.length || 0})
            </h3>
            <Link to="/client/documents" className="text-xs font-semibold text-primary hover:underline">
              Upload New Document
            </Link>
          </div>

          {caseData.documents?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseData.documents.map((doc) => (
                <div
                  key={doc._id}
                  className="p-3.5 bg-white rounded-xl border border-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">{doc.originalName}</p>
                      <span className="text-[10px] text-text-muted">{formatFileSize(doc.size)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDoc(doc._id, doc.originalName)}
                    className="p-1.5 text-primary hover:bg-primary-50 rounded-lg shrink-0"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-surface rounded-xl border border-dashed border-border text-center text-xs text-text-muted">
              No files attached to this case yet. You can upload relevant court briefs in the Documents tab.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsPage;
