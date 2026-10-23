import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Briefcase,
  Star,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Video,
  FileText,
  User,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Badge, Button, Modal, Spinner } from '../../components/ui';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdvocateDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    activeCases: 0,
    rating: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [activeCases, setActiveCases] = useState([]);

  // Action modal for Accept / Reject
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState('confirm'); // 'confirm' or 'reject'
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/lex-adv-chamber');
  const [rejectionReason, setRejectionReason] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, casesRes] = await Promise.all([
        api.get('/advocates/me/dashboard'),
        api.get('/cases/my?status=active&limit=3'),
      ]);

      if (dashRes.data.success) {
        setProfile(dashRes.data.data.profile);
        setStats(dashRes.data.data.stats || {});
        setRecentBookings(dashRes.data.data.recentBookings || []);
      }
      if (casesRes.data.success) {
        setActiveCases(casesRes.data.data.cases || []);
      }
    } catch (err) {
      console.error('Error fetching advocate dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleOpenAction = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
    if (type === 'confirm') {
      setMeetingLink(`https://meet.google.com/lex-${Math.random().toString(36).substr(2, 6)}`);
    } else {
      setRejectionReason('');
    }
    setActionModalOpen(true);
  };

  const handleUpdateBookingStatus = async () => {
    setUpdatingStatus(true);
    try {
      const status = actionType === 'confirm' ? 'confirmed' : 'rejected';
      const payload = {
        status,
        ...(actionType === 'confirm' ? { meetingLink } : { rejectionReason }),
      };

      const { data } = await api.patch(`/bookings/${selectedBooking._id}/status`, payload);
      if (data.success) {
        toast.success(`Booking ${status} successfully`);
        setActionModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      toast.error('Failed to update booking status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-3">Loading practice overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-red-50/70 via-white to-surface p-6 sm:p-8 rounded-3xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Advocate Chambers Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
            Chambers of {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {profile?.designation || 'Senior Advocate'} • Bar Enrollment: {profile?.barCouncilNumber || 'Under Verification'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <span className="badge bg-green-100 text-success text-xs font-semibold">
              Verified Legal Counsel
            </span>
            <span className="text-xs text-text-muted">
              Standard Fee: {formatCurrency(profile?.consultationFee || 500)} / 30m
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/advocate/availability" className="btn-secondary text-xs py-2 px-3.5">
            Manage Hours & Fee
          </Link>
          <Link to="/advocate/profile" className="btn-primary text-xs py-2 px-4">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Pending Requests</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">{stats.pendingBookings}</p>
          <span className="text-[11px] text-text-muted mt-0.5 block">Requires action</span>
        </div>

        <div className="card p-5 bg-white border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Total Consultations</span>
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">{stats.totalBookings}</p>
          <span className="text-[11px] text-text-muted mt-0.5 block">Lifetime bookings</span>
        </div>

        <div className="card p-5 bg-white border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Active Court Cases</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">{stats.activeCases}</p>
          <span className="text-[11px] text-text-muted mt-0.5 block">Litigation matters</span>
        </div>

        <div className="card p-5 bg-white border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Chamber Rating</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">{stats.rating?.toFixed(1) || '5.0'}</p>
          <span className="text-[11px] text-text-muted mt-0.5 block">From verified clients</span>
        </div>
      </div>

      {/* 3. Consultation Requests Management */}
      <div className="card bg-white p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Recent Consultation Requests
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Review and confirm meeting links for client legal consultations
            </p>
          </div>
          <Link to="/advocate/bookings" className="text-xs font-semibold text-primary hover:underline">
            View All ({recentBookings.length})
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-2xl border border-border hover:border-gray-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <Avatar name={b.client?.name} size="md" className="shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-text-primary">{b.client?.name}</span>
                      <span className="text-[10px] font-mono text-primary bg-primary-50 px-2 py-0.5 rounded">
                        {b.bookingReference}
                      </span>
                      <span className={`badge ${getStatusColor(b.status)} text-[10px]`}>
                        {b.status}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary mt-1">
                      Scheduled: {formatDate(b.consultationDate)} • {b.timeSlot} • Mode: <span className="capitalize">{b.consultationType}</span>
                    </p>

                    {b.issueDescription && (
                      <p className="text-xs text-text-muted mt-1.5 italic line-clamp-1">
                        "{b.issueDescription}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {b.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleOpenAction(b, 'confirm')}
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Accept Slot
                      </button>
                      <button
                        onClick={() => handleOpenAction(b, 'reject')}
                        className="btn-ghost text-xs py-1.5 px-2.5 text-red-600 hover:bg-red-50 border border-red-200"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-text-muted font-medium">
                      Status: <span className="capitalize text-text-primary">{b.status}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-text-muted">
            No consultation requests pending at this time.
          </div>
        )}
      </div>

      {/* 4. Active Cases Overview */}
      <div className="card bg-white p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Active Case Files Under Litigation
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Client briefs and next hearing calendar schedules
            </p>
          </div>
          <Link to="/advocate/cases" className="btn-secondary text-xs py-1.5 px-3">
            Manage All Cases
          </Link>
        </div>

        {activeCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeCases.map((c) => (
              <div
                key={c._id}
                className="p-4 rounded-xl border border-border bg-surface/30 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-primary">{c.caseReference}</span>
                  <h4 className="text-xs font-bold text-text-primary mt-1 line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">{c.courtName || 'Court Assigned'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-text-muted">Next Hearing:</span>
                  <span className="font-bold text-primary">
                    {c.nextHearingDate ? formatDate(c.nextHearingDate) : 'Not fixed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-text-muted">
            No active case files registered yet. You can create cases from the Case Management page.
          </div>
        )}
      </div>

      {/* Action Modal (Accept with Meeting Link OR Reject with Reason) */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={actionType === 'confirm' ? 'Accept Consultation Request' : 'Decline Consultation'}
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'confirm' ? 'primary' : 'danger'}
              size="sm"
              loading={updatingStatus}
              onClick={handleUpdateBookingStatus}
            >
              {actionType === 'confirm' ? 'Confirm & Send Link' : 'Confirm Decline'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            Client: <strong className="text-text-primary">{selectedBooking?.client?.name}</strong> •{' '}
            {formatDate(selectedBooking?.consultationDate)} ({selectedBooking?.timeSlot})
          </p>

          {actionType === 'confirm' ? (
            <div>
              <label className="label text-xs">Video Meeting Link (Google Meet / Zoom)</label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="input-field text-xs"
                placeholder="https://meet.google.com/..."
                required
              />
              <span className="text-[11px] text-text-muted mt-1 block">
                The client will receive this meeting link on their dashboard and notification center.
              </span>
            </div>
          ) : (
            <div>
              <label className="label text-xs">Reason for Declining</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Schedule conflict with court appearance, out of jurisdiction..."
                className="input-field text-xs resize-none"
                required
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdvocateDashboardPage;
