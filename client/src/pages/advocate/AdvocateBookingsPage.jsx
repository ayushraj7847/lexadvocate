import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  PhoneCall,
  Users,
  CheckCircle,
  XCircle,
  Filter,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Avatar, Badge, Button, Modal, Spinner, EmptyState } from '../../components/ui';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdvocateBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Action Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [modalMode, setModalMode] = useState('confirm'); // 'confirm', 'reject', 'complete'
  const [meetingLink, setMeetingLink] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/bookings/my?status=${statusFilter}` : '/bookings/my';
      const { data } = await api.get(url);
      if (data.success) {
        setBookings(data.data.bookings || []);
      }
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const openActionModal = (booking, mode) => {
    setActiveBooking(booking);
    setModalMode(mode);
    if (mode === 'confirm') {
      setMeetingLink(booking.meetingLink || `https://meet.google.com/lex-${Math.random().toString(36).substr(2, 6)}`);
    } else {
      setRejectionReason('');
    }
    setModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      let newStatus = 'confirmed';
      if (modalMode === 'reject') newStatus = 'rejected';
      if (modalMode === 'complete') newStatus = 'completed';

      const payload = {
        status: newStatus,
        ...(modalMode === 'confirm' ? { meetingLink } : {}),
        ...(modalMode === 'reject' ? { rejectionReason } : {}),
      };

      const { data } = await api.patch(`/bookings/${activeBooking._id}/status`, payload);
      if (data.success) {
        toast.success(`Booking updated to ${newStatus}`);
        setModalOpen(false);
        fetchBookings();
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Practice Schedule
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Consultation Requests & Bookings
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Review, approve, and manage client consultation requests
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs">
        {[
          { label: 'All Requests', value: '' },
          { label: 'Pending Approval', value: 'pending' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled / Rejected', value: 'cancelled' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              statusFilter === tab.value
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Feed */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="text-xs text-text-secondary mt-3">Loading consultations...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="card bg-white p-5 hover:shadow-card-hover transition-all duration-200 border border-border"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar name={booking.client?.name} size="lg" className="shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-text-primary">{booking.client?.name}</span>
                      <span className="text-[10px] font-mono text-primary bg-primary-50 px-2 py-0.5 rounded">
                        {booking.bookingReference}
                      </span>
                      <span className={`badge ${getStatusColor(booking.status)} text-[10px]`}>
                        {booking.status}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary mt-1">
                      {booking.client?.email} • {booking.client?.phone || 'No phone'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-2">
                      <span className="flex items-center gap-1 font-medium text-text-primary">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {formatDate(booking.consultationDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.timeSlot}
                      </span>
                      <span className="capitalize text-primary font-semibold">
                        Mode: {booking.consultationType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-text-muted uppercase">Consultation Fee</span>
                    <p className="text-base font-bold text-text-primary">
                      {formatCurrency(booking.amount)}
                    </p>
                    <span className="text-[10px] text-success font-semibold">
                      Payment {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openActionModal(booking, 'confirm')}
                          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => openActionModal(booking, 'reject')}
                          className="btn-ghost text-xs py-1.5 px-2.5 text-red-600 border border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Decline
                        </button>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <>
                        {booking.meetingLink && (
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" /> Meeting Link
                          </a>
                        )}
                        <button
                          onClick={() => openActionModal(booking, 'complete')}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {booking.issueDescription && (
                <div className="mt-3.5 pt-3 border-t border-border/60 text-xs text-text-secondary bg-surface/40 p-3 rounded-lg">
                  <span className="font-semibold text-text-primary">Client's Case Query: </span>
                  {booking.issueDescription}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center">
          <EmptyState
            icon={Calendar}
            title="No Bookings in This Category"
            description="Consultation appointments will appear here as soon as clients request slots with your chambers."
          />
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalMode === 'confirm'
            ? 'Accept & Provide Video Link'
            : modalMode === 'reject'
            ? 'Decline Request'
            : 'Mark Consultation as Completed'
        }
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={modalMode === 'reject' ? 'danger' : 'primary'}
              size="sm"
              loading={updating}
              onClick={handleStatusUpdate}
            >
              {modalMode === 'confirm' ? 'Confirm Slot' : modalMode === 'reject' ? 'Decline' : 'Confirm Complete'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            Client: <strong className="text-text-primary">{activeBooking?.client?.name}</strong> •{' '}
            {formatDate(activeBooking?.consultationDate)} ({activeBooking?.timeSlot})
          </p>

          {modalMode === 'confirm' && (
            <div>
              <label className="label text-xs">Video Room URL (Google Meet / WebRTC)</label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="input-field text-xs"
                placeholder="https://meet.google.com/..."
                required
              />
            </div>
          )}

          {modalMode === 'reject' && (
            <div>
              <label className="label text-xs">Reason for Declining</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a brief explanation for declining..."
                className="input-field text-xs resize-none"
                required
              />
            </div>
          )}

          {modalMode === 'complete' && (
            <p className="text-xs text-text-secondary">
              Confirm that the 30-minute legal consultation has taken place. The client will be invited to leave an honest review for your practice.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdvocateBookingsPage;
