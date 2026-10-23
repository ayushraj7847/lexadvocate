import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  ArrowLeft,
  FileText,
  Plus,
  CheckCircle2,
  Edit,
  Save,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { Avatar, Badge, Button, Modal, Spinner } from '../../components/ui';
import { formatDate, formatFileSize, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const standardStages = [
  'Case Filed',
  'Documents Verified',
  'Hearing Scheduled',
  'Hearing Completed',
  'Case Closed',
];

const AdvocateCaseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Progress Modal
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(standardStages[0]);
  const [stageDescription, setStageDescription] = useState('');
  const [addingProgress, setAddingProgress] = useState(false);

  // Edit details state
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editHearingDate, setEditHearingDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchCase = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cases/${id}`);
      if (data.success) {
        const c = data.data.case;
        setCaseData(c);
        setEditStatus(c.status);
        setEditHearingDate(c.nextHearingDate ? c.nextHearingDate.split('T')[0] : '');
        setEditNotes(c.notes || '');
      }
    } catch (err) {
      toast.error('Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  const handleAddProgress = async (e) => {
    e.preventDefault();
    setAddingProgress(true);
    try {
      const { data } = await api.post(`/cases/${id}/progress`, {
        stage: selectedStage,
        description: stageDescription,
      });
      if (data.success) {
        toast.success(`Milestone "${selectedStage}" recorded and client notified!`);
        setProgressModalOpen(false);
        setStageDescription('');
        fetchCase();
      }
    } catch (err) {
      toast.error('Failed to update progress');
    } finally {
      setAddingProgress(false);
    }
  };

  const handleSaveCaseEdits = async () => {
    setSavingEdit(true);
    try {
      const payload = {
        status: editStatus,
        nextHearingDate: editHearingDate || undefined,
        notes: editNotes,
      };

      const { data } = await api.patch(`/cases/${id}`, payload);
      if (data.success) {
        toast.success('Case records updated');
        setIsEditing(false);
        fetchCase();
      }
    } catch (err) {
      toast.error('Failed to update case');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDownloadDoc = (docId) => {
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
        <h2 className="text-lg font-bold text-text-primary">Case Not Found</h2>
        <Link to="/advocate/cases" className="btn-primary text-xs mt-4 inline-flex">
          Back to Cases
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/advocate/cases')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Registry
        </button>
      </div>

      {/* Main Case Summary Header */}
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
              {caseData.courtName}, {caseData.courtLocation}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-3.5 h-3.5" /> {isEditing ? 'Cancel Edit' : 'Edit Hearing & Status'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setProgressModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" /> Add Progress Milestone
            </Button>
          </div>
        </div>

        {/* Quick Edit Bar */}
        {isEditing && (
          <div className="p-5 bg-surface rounded-2xl border border-border space-y-4">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Update Case Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label text-xs">Litigation Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="active">Active Litigation</option>
                  <option value="pending">Pending Hearing / Documents</option>
                  <option value="on_hold">On Hold</option>
                  <option value="won">Disposed — In Favor (Won)</option>
                  <option value="lost">Disposed — Dismissed (Lost)</option>
                  <option value="closed">Matter Closed</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Next Hearing Date</label>
                <input
                  type="date"
                  value={editHearingDate}
                  onChange={(e) => setEditHearingDate(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs">Counsel Court Notes</label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Internal or client-facing hearing notes..."
                className="input-field text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                loading={savingEdit}
                onClick={handleSaveCaseEdits}
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Client & Court Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-surface rounded-xl border border-border">
            <span className="text-text-muted block">Client on Record</span>
            <span className="font-bold text-text-primary mt-0.5 block">{caseData.client?.name}</span>
            <span className="text-text-secondary">{caseData.client?.email}</span>
          </div>

          <div className="p-3.5 bg-surface rounded-xl border border-border">
            <span className="text-text-muted block">Court & Location</span>
            <span className="font-bold text-text-primary mt-0.5 block">{caseData.courtName}</span>
            <span className="text-text-secondary">{caseData.courtLocation}</span>
          </div>

          <div className="p-3.5 bg-surface rounded-xl border border-border">
            <span className="text-text-muted block">Next Hearing Date</span>
            <span className="font-bold text-primary mt-0.5 block">
              {caseData.nextHearingDate ? formatDate(caseData.nextHearingDate) : 'Not scheduled'}
            </span>
            <span className="text-text-secondary">Official Bench Notice</span>
          </div>
        </div>

        {/* Progress Timeline Feed */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-primary">
              Procedural Milestones & Progression
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setProgressModalOpen(true)}
              className="text-primary text-xs"
            >
              + Update Stage
            </Button>
          </div>

          {caseData.progressTimeline?.length > 0 ? (
            <div className="space-y-3 p-4 bg-surface rounded-2xl border border-border">
              {caseData.progressTimeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary">{item.stage}</span>
                      <span className="text-[10px] text-text-muted">{formatDate(item.date)}</span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-text-secondary mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted p-4 bg-surface rounded-xl">No progress milestones recorded yet.</p>
          )}
        </div>

        {/* Associated Documents */}
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
            Associated Case Documents ({caseData.documents?.length || 0})
          </h3>
          {caseData.documents?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseData.documents.map((doc) => (
                <div
                  key={doc._id}
                  className="p-3.5 bg-surface rounded-xl border border-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">{doc.originalName}</p>
                      <span className="text-[10px] text-text-muted">{formatFileSize(doc.size)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDoc(doc._id)}
                    className="p-1.5 text-primary hover:bg-white rounded-lg shrink-0"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-surface rounded-xl border border-dashed border-border text-center text-xs text-text-muted">
              No files attached to this case.
            </div>
          )}
        </div>
      </div>

      {/* Progress Milestone Modal */}
      <Modal
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        title="Add Case Progress Milestone"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setProgressModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={addingProgress}
              onClick={handleAddProgress}
            >
              Record Milestone
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAddProgress} className="space-y-4">
          <div>
            <label className="label text-xs">Standard Milestone Stage</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="input-field text-xs font-medium"
            >
              {standardStages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-xs">Progress Summary / Court Order Note</label>
            <textarea
              rows={3}
              value={stageDescription}
              onChange={(e) => setStageDescription(e.target.value)}
              placeholder="e.g. Notice issued to respondents, next hearing scheduled before bench..."
              className="input-field text-xs resize-none"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdvocateCaseDetailsPage;
