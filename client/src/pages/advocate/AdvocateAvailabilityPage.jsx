import { useState, useEffect } from 'react';
import { Clock, Calendar, DollarSign, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button, Spinner } from '../../components/ui';
import api from '../../services/api';
import toast from 'react-hot-toast';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdvocateAvailabilityPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [consultationFee, setConsultationFee] = useState(1500);
  const [consultationTypes, setConsultationTypes] = useState(['video', 'audio']);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/advocates/me/dashboard');
        if (data.success && data.data.profile) {
          const p = data.data.profile;
          setConsultationFee(p.consultationFee || 1500);
          setConsultationTypes(p.consultationTypes?.length > 0 ? p.consultationTypes : ['video', 'audio']);

          if (p.availability?.length > 0) {
            setAvailability(p.availability);
          } else {
            // Default Monday - Friday 10 AM to 6 PM
            setAvailability(
              daysOfWeek.map((day) => ({
                day,
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: day !== 'Sunday',
              }))
            );
          }
        }
      } catch (err) {
        toast.error('Failed to load availability settings');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleToggleDay = (index) => {
    setAvailability((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const handleTimeChange = (index, field, value) => {
    setAvailability((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleToggleType = (type) => {
    setConsultationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        consultationFee: Number(consultationFee),
        consultationTypes,
        availability,
      };

      const { data } = await api.put('/advocates/profile', payload);
      if (data.success) {
        toast.success('Availability and consultation rates updated!');
      }
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-3">Loading availability settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Chamber Schedule & Rates
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Consultation Fee & Availability
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Set your standard 30-minute consultation rates and working days
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Fee & Modes Card */}
        <div className="card bg-white p-6 sm:p-8 space-y-5">
          <h2 className="text-sm font-bold text-text-primary">
            Standard Consultation Rates
          </h2>

          <div className="max-w-xs">
            <label className="label text-xs">Standard Consultation Fee (₹ INR / 30 Minutes)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="input-field pl-8 text-xs font-bold"
                required
              />
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              Displayed transparently to clients before booking.
            </span>
          </div>

          <div className="pt-4 border-t border-border">
            <label className="label text-xs">Supported Consultation Formats</label>
            <div className="flex flex-wrap gap-3 mt-1.5">
              {[
                { id: 'video', label: 'Video Call (Meet / Zoom)' },
                { id: 'audio', label: 'Phone Call (Voice)' },
                { id: 'in-person', label: 'Chambers (In-Person Office)' },
              ].map((opt) => {
                const checked = consultationTypes.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => handleToggleType(opt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                      checked
                        ? 'border-primary bg-primary-50 text-primary'
                        : 'border-border bg-white text-text-secondary hover:border-primary-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Weekly Working Hours Table */}
        <div className="card bg-white p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">
            Weekly Working Hours & Days
          </h2>
          <p className="text-xs text-text-secondary">
            Slots within these windows will be made selectable for client bookings.
          </p>

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
            {availability.map((slot, idx) => (
              <div
                key={slot.day}
                className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  slot.isAvailable ? 'bg-white' : 'bg-surface/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`day-${idx}`}
                    checked={slot.isAvailable}
                    onChange={() => handleToggleDay(idx)}
                    className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
                  />
                  <label htmlFor={`day-${idx}`} className="text-xs font-bold text-text-primary cursor-pointer w-24">
                    {slot.day}
                  </label>
                </div>

                {slot.isAvailable ? (
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                      className="px-2.5 py-1 border border-border rounded-lg text-xs"
                    />
                    <span className="text-text-muted">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                      className="px-2.5 py-1 border border-border rounded-lg text-xs"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-text-muted font-medium">Chambers Closed</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="md" loading={saving}>
              <Save className="w-4 h-4" /> Save Schedule & Rates
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdvocateAvailabilityPage;
