import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  PhoneCall,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';
import { Avatar, Button, Spinner, Badge } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const timeSlots = [
  '10:00 - 10:30 AM',
  '11:00 - 11:30 AM',
  '12:00 - 12:30 PM',
  '02:00 - 02:30 PM',
  '03:30 - 04:00 PM',
  '04:30 - 05:00 PM',
  '05:30 - 06:00 PM',
];

const BookConsultationPage = () => {
  const { id: advocateIdParam } = useParams();
  const navigate = useNavigate();

  // Wizard state: 1: Details & Slot, 2: Review & Payment, 3: Confirmation
  const [step, setStep] = useState(1);
  const [advocate, setAdvocate] = useState(null);
  const [allAdvocates, setAllAdvocates] = useState([]);
  const [selectedAdvocateId, setSelectedAdvocateId] = useState(advocateIdParam || '');
  const [loadingAdvocate, setLoadingAdvocate] = useState(true);

  // Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [consultationDate, setConsultationDate] = useState(minDateStr);
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [consultationType, setConsultationType] = useState('video');
  const [practiceArea, setPracticeArea] = useState('Criminal Law');
  const [issueDescription, setIssueDescription] = useState('');

  // Payment mock state
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Load advocate details
  useEffect(() => {
    const loadAdvocate = async () => {
      setLoadingAdvocate(true);
      try {
        if (selectedAdvocateId) {
          // Could be advocate user ID or advocate profile ID
          const res = await api.get(`/advocates/${selectedAdvocateId}`).catch(async () => {
            // Fallback: search by query
            const listRes = await api.get('/advocates');
            const found = listRes.data.data.advocates.find(
              (a) => a._id === selectedAdvocateId || a.user?._id === selectedAdvocateId
            );
            return { data: { data: { advocate: found } } };
          });
          if (res?.data?.data?.advocate) {
            setAdvocate(res.data.data.advocate);
            if (res.data.data.advocate.practiceAreas?.length > 0) {
              setPracticeArea(res.data.data.advocate.practiceAreas[0]);
            }
          }
        }

        // Also fetch advocate list if user wants to change advocate
        const { data } = await api.get('/advocates');
        if (data.success) {
          setAllAdvocates(data.data.advocates || []);
          if (!selectedAdvocateId && data.data.advocates.length > 0) {
            setAdvocate(data.data.advocates[0]);
            setSelectedAdvocateId(data.data.advocates[0].user?._id || data.data.advocates[0]._id);
          }
        }
      } catch (err) {
        toast.error('Failed to load advocate details');
      } finally {
        setLoadingAdvocate(false);
      }
    };
    loadAdvocate();
  }, [selectedAdvocateId]);

  const handleSelectAdvocateChange = (e) => {
    setSelectedAdvocateId(e.target.value);
  };

  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!consultationDate) {
      toast.error('Please pick a consultation date');
      return;
    }
    if (!timeSlot) {
      toast.error('Please select an available time slot');
      return;
    }
    if (!issueDescription.trim()) {
      toast.error('Please provide a brief summary of your legal matter');
      return;
    }
    setStep(2);
  };

  const handleCompletePaymentAndBooking = async () => {
    setPaymentProcessing(true);
    try {
      const advocateUserId = advocate.user?._id || advocate._id;

      const payload = {
        advocateId: advocateUserId,
        consultationDate,
        timeSlot,
        consultationType,
        practiceArea,
        issueDescription,
      };

      const { data } = await api.post('/bookings', payload);
      if (data.success) {
        setConfirmedBooking(data.data.booking);
        setPaymentSuccess(true);
        setStep(3);
        toast.success('Consultation booked successfully!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Slot may already be taken.';
      toast.error(msg);
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loadingAdvocate) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-3">Loading consultation portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Wizard Step Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
              1
            </span>
            <span>Date & Details</span>
          </div>

          <div className="h-0.5 flex-1 mx-3 bg-border">
            <div className={`h-full bg-primary transition-all duration-300 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`}></div>
          </div>

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
              2
            </span>
            <span>Review & Mock Pay</span>
          </div>

          <div className="h-0.5 flex-1 mx-3 bg-border">
            <div className={`h-full bg-primary transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
          </div>

          <div className={`flex items-center gap-2 ${step === 3 ? 'text-primary' : 'text-text-muted'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
              3
            </span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {/* STEP 1: SELECT ADVOCATE & SCHEDULE SLOTS */}
      {step === 1 && (
        <form onSubmit={handleProceedToReview} className="card bg-white p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 1 of 3</span>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
              Select Legal Advocate & Consultation Slot
            </h1>
          </div>

          {/* Advocate Picker */}
          <div>
            <label className="label text-xs">Consulting Advocate</label>
            <select
              value={selectedAdvocateId}
              onChange={handleSelectAdvocateChange}
              className="input-field text-xs font-medium"
            >
              {allAdvocates.map((adv) => (
                <option key={adv._id} value={adv.user?._id || adv._id}>
                  {adv.user?.name} — {adv.practiceAreas?.[0] || 'Advocate'} (Fee: {formatCurrency(adv.consultationFee)})
                </option>
              ))}
            </select>
          </div>

          {/* Advocate Preview Card */}
          {advocate && (
            <div className="p-4 bg-surface rounded-2xl border border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={advocate.user?.name} size="md" />
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{advocate.user?.name}</h3>
                  <p className="text-xs text-text-secondary">{advocate.designation || 'Advocate'} • {advocate.experience} Years Exp</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-muted">Fee:</span>
                <p className="text-base font-bold text-primary">{formatCurrency(advocate.consultationFee)}</p>
              </div>
            </div>
          )}

          {/* Consultation Type Radio buttons */}
          <div>
            <label className="label text-xs">Consultation Format</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'video', label: 'Video Call', desc: 'Google Meet HD', icon: Video },
                { type: 'audio', label: 'Audio Call', desc: 'Direct Phone', icon: PhoneCall },
                { type: 'in-person', label: 'Chambers', desc: 'At Chamber Office', icon: Users },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = consultationType === opt.type;
                return (
                  <button
                    type="button"
                    key={opt.type}
                    onClick={() => setConsultationType(opt.type)}
                    className={`p-3.5 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-50/50 text-text-primary'
                        : 'border-border bg-white text-text-secondary hover:border-primary-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-primary' : 'text-text-muted'}`} />
                    <div>
                      <p className="text-xs font-bold leading-tight">{opt.label}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs">Consultation Date</label>
              <input
                type="date"
                min={minDateStr}
                value={consultationDate}
                onChange={(e) => setConsultationDate(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="label text-xs">Available Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="input-field text-xs font-medium"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Legal Issue Description */}
          <div>
            <label className="label text-xs">Brief Description of Legal Matter</label>
            <textarea
              rows={4}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="State the background facts, relevant parties, and questions you want addressed during your consultation..."
              className="input-field text-xs resize-none"
              required
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button type="submit" variant="primary" size="md">
              Review Booking Details <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: REVIEW & TEST MOCK PAYMENT */}
      {step === 2 && (
        <div className="card bg-white p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 2 of 3</span>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
              Review Consultation & Complete Test Payment
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Verify your booking details before authorizing consultation fees
            </p>
          </div>

          {/* Summary Box */}
          <div className="p-5 bg-surface rounded-2xl border border-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <p className="text-xs text-text-muted">Selected Advocate</p>
                <p className="text-sm font-bold text-text-primary">{advocate?.user?.name}</p>
                <p className="text-xs text-text-secondary">{advocate?.designation || 'Advocate'}</p>
              </div>
              <Avatar name={advocate?.user?.name} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-muted block">Scheduled Date</span>
                <span className="font-semibold text-text-primary">{formatDate(consultationDate)}</span>
              </div>
              <div>
                <span className="text-text-muted block">Time Slot</span>
                <span className="font-semibold text-text-primary">{timeSlot}</span>
              </div>
              <div>
                <span className="text-text-muted block">Consultation Format</span>
                <span className="font-semibold text-text-primary capitalize">{consultationType} Call</span>
              </div>
              <div>
                <span className="text-text-muted block">Practice Area</span>
                <span className="font-semibold text-text-primary">{practiceArea}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border text-xs">
              <span className="text-text-muted block mb-1">Issue Overview:</span>
              <p className="text-text-primary italic bg-white p-3 rounded-lg border border-border/60">
                "{issueDescription}"
              </p>
            </div>
          </div>

          {/* Clearly Labeled Mock Payment Adapter */}
          <div className="p-5 bg-primary-50/60 rounded-2xl border border-primary-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-text-primary">
                  LexAdvocate Secure Payment Adapter (Test Mode)
                </h3>
              </div>
              <span className="badge bg-green-100 text-success text-[10px] font-bold">
                Test Sandbox
              </span>
            </div>

            <p className="text-xs text-text-secondary">
              This application operates in development test payment mode. No real credit card will be charged. Clicking below will instantly record a confirmed booking in the MongoDB database.
            </p>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-red-200">
              <span className="text-xs font-semibold text-text-primary">Consultation Amount Due:</span>
              <span className="text-lg font-black text-primary">
                {formatCurrency(advocate?.consultationFee || 500)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              <ArrowLeft className="w-3.5 h-3.5" /> Edit Details
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={paymentProcessing}
              onClick={handleCompletePaymentAndBooking}
            >
              Authorize & Confirm Booking ({formatCurrency(advocate?.consultationFee || 500)})
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: BOOKING CONFIRMATION */}
      {step === 3 && confirmedBooking && (
        <div className="card bg-white p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-100 text-success flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-success uppercase tracking-wider">
              Booking Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
              Consultation Successfully Scheduled!
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Your appointment has been registered and confirmed with the advocate.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-muted">Booking Reference:</span>
              <span className="font-mono font-bold text-primary">{confirmedBooking.bookingReference}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-muted">Advocate:</span>
              <span className="font-semibold text-text-primary">{advocate?.user?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-muted">Date & Time:</span>
              <span className="font-semibold text-text-primary">{formatDate(consultationDate)} • {timeSlot}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Format:</span>
              <span className="font-semibold text-text-primary capitalize">{consultationType} Consultation</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link to={`/client/bookings/${confirmedBooking._id}`} className="btn-primary text-xs py-2.5 px-5">
              View Booking Details
            </Link>
            <Link to="/client/dashboard" className="btn-secondary text-xs py-2.5 px-5">
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookConsultationPage;
