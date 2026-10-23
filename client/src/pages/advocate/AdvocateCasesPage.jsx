import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Clock,
  Calendar,
  Building,
  ChevronRight,
  Filter,
  Search,
  User,
} from 'lucide-react';
import { Avatar, Badge, Button, Modal, Spinner, EmptyState } from '../../components/ui';
import { formatDate, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdvocateCasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [creatingCase, setCreatingCase] = useState(false);
  const [clientsList, setClientsList] = useState([]);

  // Form State
  const [title, setTitle] = useState('');
  const [caseType, setCaseType] = useState('Criminal Law');
  const [clientId, setClientId] = useState('');
  const [courtName, setCourtName] = useState('');
  const [courtLocation, setCourtLocation] = useState('');
  const [nextHearingDate, setNextHearingDate] = useState('');
  const [description, setDescription] = useState('');

  const fetchCasesAndClients = async () => {
    setLoading(true);
    try {
      const [casesRes, bookingsRes] = await Promise.all([
        api.get('/cases/my'),
        api.get('/bookings/my'),
      ]);

      if (casesRes.data.success) {
        setCases(casesRes.data.data.cases || []);
      }

      // Extract distinct clients who have booked with advocate
      if (bookingsRes.data.success) {
        const clientsMap = new Map();
        (bookingsRes.data.data.bookings || []).forEach((b) => {
          if (b.client?._id) {
            clientsMap.set(b.client._id, b.client);
          }
        });
        const clientArr = Array.from(clientsMap.values());
        setClientsList(clientArr);
        if (clientArr.length > 0 && !clientId) {
          setClientId(clientArr[0]._id);
        }
      }
    } catch (err) {
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasesAndClients();
  }, []);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!clientId) {
      toast.error('Please assign a client to this case');
      return;
    }

    setCreatingCase(true);
    try {
      const payload = {
        title,
        caseType,
        clientId,
        courtName,
        courtLocation,
        nextHearingDate: nextHearingDate || undefined,
        description,
      };

      const { data } = await api.post('/cases', payload);
      if (data.success) {
        toast.success('Case record created successfully');
        setNewCaseModalOpen(false);
        // Reset form
        setTitle('');
        setCourtName('');
        setCourtLocation('');
        setNextHearingDate('');
        setDescription('');
        fetchCasesAndClients();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create case');
    } finally {
      setCreatingCase(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Litigation Registry
          </span>
          <h1 className="text-2xl font-bold text-text-primary mt-0.5">
            Case Management
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            File new court briefs, update procedural milestones, and notify clients
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setNewCaseModalOpen(true)}
          className="self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Register New Case
        </Button>
      </div>

      {/* Cases List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="text-xs text-text-secondary mt-3">Loading case files...</p>
        </div>
      ) : cases.length > 0 ? (
        <div className="space-y-4">
          {cases.map((c) => (
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

                  <h3 className="text-base font-bold text-text-primary">{c.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
                    <span className="flex items-center gap-1.5 font-medium text-text-primary">
                      <User className="w-3.5 h-3.5 text-primary" />
                      Client: {c.client?.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      {c.courtName || 'Court Assigned'}, {c.courtLocation || 'India'}
                    </span>
                    <span>Filed: {formatDate(c.filingDate)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                  {c.nextHearingDate ? (
                    <div className="text-left lg:text-right p-2 bg-primary-50/60 rounded-xl border border-primary-100">
                      <span className="text-[10px] text-text-muted uppercase font-bold flex items-center gap-1 lg:justify-end">
                        <Clock className="w-3 h-3 text-primary" /> Next Hearing
                      </span>
                      <p className="text-xs font-bold text-primary">{formatDate(c.nextHearingDate)}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-text-muted">No hearing fixed</span>
                  )}

                  <Link
                    to={`/advocate/cases/${c._id}`}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    Manage Timeline & Notes <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {c.progressTimeline?.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-border flex items-center gap-2 text-xs text-text-secondary">
                  <span className="font-semibold text-text-primary">Current Milestone:</span>
                  <span className="bg-surface px-2 py-0.5 rounded font-medium text-text-primary">
                    {c.progressTimeline[c.progressTimeline.length - 1].stage}
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
            title="No Case Files in Registry"
            description="Create your first litigation matter file and assign it to a client to start tracking progress."
            action={
              <Button variant="primary" size="sm" onClick={() => setNewCaseModalOpen(true)}>
                <Plus className="w-4 h-4" /> Register First Case
              </Button>
            }
          />
        </div>
      )}

      {/* New Case Creation Modal */}
      <Modal
        isOpen={newCaseModalOpen}
        onClose={() => setNewCaseModalOpen(false)}
        title="Register New Court Case Matter"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setNewCaseModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={creatingCase}
              onClick={handleCreateCase}
            >
              Create Case File
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateCase} className="space-y-4">
          <div>
            <label className="label text-xs">Case Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Verma vs. State of NCT Delhi"
              className="input-field text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs">Legal Category</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="input-field text-xs"
              >
                <option value="Criminal Law">Criminal Law</option>
                <option value="Family Law">Family Law</option>
                <option value="Property Law">Property Law</option>
                <option value="Corporate Law">Corporate Law</option>
                <option value="Civil Law">Civil Law</option>
                <option value="Consumer Law">Consumer Law</option>
              </select>
            </div>

            <div>
              <label className="label text-xs">Assign Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="input-field text-xs"
                required
              >
                {clientsList.length > 0 ? (
                  clientsList.map((cl) => (
                    <option key={cl._id} value={cl._id}>
                      {cl.name} ({cl.email})
                    </option>
                  ))
                ) : (
                  <option value="">No clients found from bookings</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs">Court Bench / Tribunal</label>
              <input
                type="text"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="e.g. Delhi High Court, Courtroom 12"
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="label text-xs">Location / Jurisdiction</label>
              <input
                type="text"
                value={courtLocation}
                onChange={(e) => setCourtLocation(e.target.value)}
                placeholder="e.g. New Delhi"
                className="input-field text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="label text-xs">Next Hearing Date (Optional)</label>
            <input
              type="date"
              value={nextHearingDate}
              onChange={(e) => setNextHearingDate(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="label text-xs">Brief Description / Prayer</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the core issues and initial filing prayers..."
              className="input-field text-xs resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdvocateCasesPage;
