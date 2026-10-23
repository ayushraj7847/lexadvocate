import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  PhoneCall,
  Users,
  MapPin,
  Briefcase,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
} from 'lucide-react';
import { Avatar, Badge, Button, Modal, Spinner } from '../../components/ui';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/bookings/${id}`);
      if (data.success) {
        setBooking(data.data.booking);
      }
    } catch (err) {
      toast.error('Failed to load consultation details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please specify a cancellation reason');
      return;
    }

    setCancelling(true);
    try {
      const { data } = await api.patch(`/bookings/${id}/cancel`, {
        cancellationReason,
      });
      if (data.success) {
        toast.success('Booking cancelled');
        setCancelModalOpen(false);
        fetchBooking();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    setSubmittingReview(true);
    try {
      const { data } = await api.post('/reviews', {
        advocateId: booking.advocate._id,
        bookingId: booking._id,
        rating,
        comment: reviewComment,
      });
      if (data.success) {
        toast.success('Thank you for reviewing your consultation!');
        setReviewModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-3">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-bold text-text-primary">Booking Not Found</h2>
        <Link to="/client/bookings" className="btn-primary text-xs mt-4 inline-flex">
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/client/bookings')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </button>
      </div>

      {/* Main Booking Summary Card */}
      <div className="card bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                {booking.bookingReference}
              </span>
              <span className={`badge ${getStatusColor(booking.status)} text-xs`}>
                {booking.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-1.5">
              Consultation with {booking.advocate?.name}
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Scheduled for {formatDate(booking.consultationDate)} at {booking.timeSlot}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {booking.status === 'confirmed' && booking.meetingLink && (
              <a
                href={booking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
              >
                <Video className="w-4 h-4" /> Join Video Room
              </a>
            )}

            {booking.status === 'completed' && (
              <button
                onClick={() => setReviewModalOpen(true)}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Star className="w-4 h-4" /> Leave Review
              </button>
            )}

            {['pending', 'confirmed'].includes(booking.status) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 border border-red-200"
                onClick={() => setCancelModalOpen(true)}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </div>

        {/* Advocate Profile Details Snippet */}
        <div className="p-4 bg-surface rounded-2xl border border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={booking.advocate?.name} size="md" />
            <div>
              <h3 className="text-sm font-bold text-text-primary">{booking.advocate?.name}</h3>
              <p className="text-xs text-text-secondary">
                {booking.advocateProfile?.designation || 'Advocate'} • {booking.advocateProfile?.location?.city || 'Delhi'}
              </p>
            </div>
          </div>
          <Link
            to={`/advocates/${booking.advocateProfile?._id || booking.advocate?._id}`}
            className="btn-ghost text-xs border border-border py-1.5 px-3"
          >
            View Profile
          </Link>
        </div>

        {/* Schedule & Mode Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-border">
            <p className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Date & Time
            </p>
            <p className="text-xs font-bold text-text-primary">{formatDate(booking.consultationDate)}</p>
            <p className="text-xs text-text-secondary">{booking.timeSlot}</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-border">
            <p className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
              <Video className="w-3.5 h-3.5 text-primary" /> Mode of Meeting
            </p>
            <p className="text-xs font-bold text-text-primary capitalize">{booking.consultationType} Call</p>
            <p className="text-xs text-text-secondary">30-Minute Consultation</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-border">
            <p className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-primary" /> Payment Status
            </p>
            <p className="text-xs font-bold text-success capitalize">{booking.paymentStatus}</p>
            <p className="text-xs text-text-secondary">{formatCurrency(booking.amount)} Paid</p>
          </div>
        </div>

        {/* Issue Description */}
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Brief Legal Issue Description
          </h3>
          <div className="p-4 bg-surface rounded-xl border border-border text-xs sm:text-sm text-text-primary leading-relaxed">
            {booking.issueDescription || 'No specific legal notes submitted during booking.'}
          </div>
        </div>

        {/* Cancellation or Rejection Details */}
        {booking.status === 'cancelled' && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-xs font-bold text-primary flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Consultation Was Cancelled
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Reason: {booking.cancellationReason || 'Cancelled by client'}
            </p>
          </div>
        )}

        {booking.status === 'rejected' && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-xs font-bold text-primary flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> Consultation Request Declined
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Advocate note: {booking.rejectionReason || 'Advocate unavailable during this slot'}
            </p>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Consultation"
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
              onClick={handleCancel}
            >
              Cancel Appointment
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            Please provide a cancellation reason so the advocate can be notified.
          </p>
          <textarea
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            className="input-field text-xs resize-none"
            placeholder="Reason for cancellation..."
          />
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Consultation"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={submittingReview}
              onClick={handleSubmitReview}
            >
              Submit Review
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label text-xs">Rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-1 text-yellow-400 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label text-xs">Your Feedback & Experience</label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="input-field text-xs resize-none"
              placeholder="How helpful was the legal advice and clarity provided?"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetailsPage;
