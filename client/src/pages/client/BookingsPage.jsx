import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  PhoneCall,
  Users,
  Search,
  Filter,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  XCircle,
} from 'lucide-react';
import { Avatar, Badge, Button, Modal, Spinner, EmptyState } from '../../components/ui';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancellationReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please enter a cancellation reason');
      return;
    }

    setCancelling(true);
    try {
      const { data } = await api.patch(`/bookings/${selectedBooking._id}/cancel`, {
        cancellationReason,
      });
      if (data.success) {
        toast.success('Consultation cancelled successfully');
        setCancelModalOpen(false);
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Consultation Schedules
          </span>
          <h1 className="text-2xl font-bold text-text-primary mt-0.5">
            My Consultations
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Track, join, or manage upcoming legal consultation appointments
          </p>
        </div>

        <Link to="/advocates" className="btn-primary text-xs self-start sm:self-auto">
          <Calendar className="w-4 h-4" /> Book New Consultation
        </Link>
      </div>

      {/* Tabs / Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs">
        {[
          { label: 'All Bookings', value: '' },
          { label: 'Pending', value: 'pending' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
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

      {/* Bookings List */}
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
                {/* Left: Advocate & Reference */}
                <div className="flex items-start gap-4">
                  <Avatar name={booking.advocate?.name} size="lg" className="shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                        {booking.bookingReference}
                      </span>
                      <span className={`badge ${getStatusColor(booking.status)} text-[10px]`}>
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-text-primary mt-1">
                      {booking.advocate?.name}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {booking.advocateProfile?.designation || 'Advocate'} • {booking.practiceArea || 'General Law'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {formatDate(booking.consultationDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.timeSlot}
                      </span>
                      <span className="capitalize font-medium text-text-primary">
                        Mode: {booking.consultationType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Fees & Action Buttons */}
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

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Meeting Link button if confirmed */}
                    {booking.status === 'confirmed' && booking.meetingLink && (
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" /> Join Consultation
                      </a>
                    )}

                    <Link
                      to={`/client/bookings/${booking._id}`}
                      className="btn-ghost text-xs py-1.5 px-3 border border-border"
                    >
                      Details
                    </Link>

                    {/* Cancellation eligible */}
                    {['pending', 'confirmed'].includes(booking.status) && (
                      <button
                        onClick={() => handleCancelClick(booking)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold"
                        title="Cancel appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {booking.issueDescription && (
                <div className="mt-3.5 pt-3 border-t border-border/60 text-xs text-text-secondary bg-surface/40 p-2.5 rounded-lg">
                  <span className="font-semibold text-text-primary">Legal Issue Stated: </span>
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
            title="No Consultations Found"
            description="You don't have any bookings matching this filter. Schedule a new consultation with verified legal counsel."
            action={
              <Link to="/advocates" className="btn-primary text-xs">
                Browse Advocates Directory
              </Link>
            }
          />
        </div>
      )}

      {/* Cancellation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Consultation Booking"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={cancelling}
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            Are you sure you want to cancel your consultation with{' '}
            <strong className="text-text-primary">{selectedBooking?.advocate?.name}</strong> on{' '}
            {formatDate(selectedBooking?.consultationDate)}?
          </p>

          <div>
            <label className="label text-xs">Reason for Cancellation</label>
            <textarea
              rows={3}
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="e.g. Schedule conflict, matter settled, urgent travel..."
              className="input-field text-xs resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingsPage;
