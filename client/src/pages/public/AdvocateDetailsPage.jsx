import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Star,
  Clock,
  Calendar,
  GraduationCap,
  Languages,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Video,
  PhoneCall,
  Users,
  Building,
  ArrowLeft,
} from 'lucide-react';
import { Avatar, Badge, Button, StarRating, Spinner } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdvocateDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [advocate, setAdvocate] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchAdvocateAndReviews = async () => {
      setLoading(true);
      try {
        const [advRes, revRes] = await Promise.all([
          api.get(`/advocates/${id}`),
          api.get(`/reviews/${id}`).catch(() => ({ data: { data: { reviews: [] } } })),
        ]);

        if (advRes.data.success) {
          setAdvocate(advRes.data.data.advocate);
        }
        if (revRes.data.success) {
          setReviews(revRes.data.data.reviews || []);
        }

        // Check if saved
        if (user && user.role === 'client') {
          const savedRes = await api.get('/advocates/saved').catch(() => null);
          if (savedRes?.data?.success) {
            const hasSaved = savedRes.data.data.saved.some(
              (s) => (s.advocateProfile?._id || s.advocateProfile) === id
            );
            setIsSaved(hasSaved);
          }
        }
      } catch (err) {
        toast.error('Failed to load advocate details');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvocateAndReviews();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.error('Please log in to save advocates');
      return;
    }
    if (user.role !== 'client') {
      toast.error('Only clients can save advocates');
      return;
    }

    try {
      const { data } = await api.post(`/advocates/${id}/save`);
      if (data.success) {
        setIsSaved(!isSaved);
        toast.success(isSaved ? 'Removed from saved advocates' : 'Advocate saved successfully');
      }
    } catch (err) {
      toast.error('Failed to update saved status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-surface">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-3">Loading advocate profile...</p>
      </div>
    );
  }

  if (!advocate) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-text-primary">Advocate Not Found</h2>
        <p className="text-sm text-text-secondary mt-2">
          The requested profile may be inactive or does not exist.
        </p>
        <div className="mt-6">
          <Link to="/advocates" className="btn-primary">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const {
    user: advocateUser,
    designation,
    bio,
    practiceAreas = [],
    experience = 0,
    education = [],
    languages = [],
    location,
    consultationFee = 500,
    rating = 0,
    totalReviews = 0,
    totalCases = 0,
    court,
    barCouncilNumber,
    availability = [],
    consultationTypes = ['video', 'audio', 'in-person'],
  } = advocate;

  return (
    <div className="bg-surface min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-border shadow-card p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar
                src={advocate.profilePhoto || advocateUser?.avatar}
                name={advocateUser?.name}
                size="2xl"
                className="ring-4 ring-red-50 shadow-sm shrink-0"
              />

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                    {advocateUser?.name}
                  </h1>
                  <span className="badge bg-green-100 text-success text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Bar Verified
                  </span>
                </div>

                <p className="text-sm font-semibold text-primary">
                  {designation || 'Advocate'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>
                      {location?.city ? `${location.city}, ${location.state || 'India'}` : 'New Delhi, India'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-text-muted" />
                    <span>{experience} Years Experience</span>
                  </div>
                  {court && (
                    <div className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-text-muted" />
                      <span>{court}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <StarRating rating={rating} size="md" />
                  <span className="text-sm font-bold text-text-primary">{rating.toFixed(1)}</span>
                  <span className="text-xs text-text-muted">({totalReviews} verified reviews)</span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="text-xs text-text-muted">{totalCases}+ cases handled</span>
                </div>
              </div>
            </div>

            {/* Actions & Pricing Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 p-5 rounded-2xl bg-surface/80 border border-border">
              <div className="text-left lg:text-right">
                <span className="text-xs text-text-muted uppercase tracking-wider block">
                  Consultation Fee
                </span>
                <span className="text-2xl font-black text-primary">
                  {formatCurrency(consultationFee)}
                </span>
                <span className="text-[11px] text-text-muted block">per 30-min consultation</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleToggleSave}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isSaved
                      ? 'bg-primary-50 border-primary-200 text-primary'
                      : 'border-border bg-white text-text-secondary hover:text-primary hover:border-primary-200'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save advocate'}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-primary' : ''}`} />
                </button>

                <Link
                  to={`/client/book/${advocateUser?._id || advocate._id}`}
                  className="btn-primary py-2.5 px-6 text-sm font-semibold shadow-sm flex-1 sm:flex-none"
                >
                  <Calendar className="w-4 h-4" /> Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Cols: Bio, Experience, Education, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <div className="card bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Professional Background & Practice
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {bio || 'Experienced advocate with profound expertise in courtroom litigation, legal advisory, and case strategy.'}
              </p>

              {/* Practice Areas */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                  Areas of Specialization
                </h3>
                <div className="flex flex-wrap gap-2">
                  {practiceAreas.map((area) => (
                    <Badge key={area} variant="red" className="py-1 px-3 text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Qualifications & Bar Enrollment */}
            <div className="card bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" /> Qualifications & Credentials
              </h2>

              <div className="space-y-4">
                {barCouncilNumber && (
                  <div className="p-3.5 bg-surface rounded-xl border border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted">Bar Council Enrollment</p>
                      <p className="text-sm font-bold text-text-primary mt-0.5">{barCouncilNumber}</p>
                    </div>
                    <span className="badge bg-green-100 text-success text-xs font-semibold">Verified</span>
                  </div>
                )}

                {education.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Academic Background
                    </p>
                    {education.map((edu, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {edu.degree}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {edu.institution} {edu.year ? `(${edu.year})` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="card bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" /> Verified Client Reviews
                  </h2>
                  <p className="text-xs text-text-secondary mt-1">
                    Authentic feedback from clients who consulted this advocate
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-text-primary">{rating.toFixed(1)}</span>
                  <span className="text-xs text-text-muted block">out of 5.0</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4 divide-y divide-border">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="pt-4 first:pt-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={rev.client?.name} size="sm" />
                          <div>
                            <p className="text-xs font-semibold text-text-primary">
                              {rev.client?.name || 'Verified Client'}
                            </p>
                            <span className="text-[10px] text-text-muted">
                              {formatDate(rev.createdAt)}
                            </span>
                          </div>
                        </div>
                        <StarRating rating={rev.rating} size="sm" />
                      </div>
                      <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-surface rounded-xl border border-dashed border-border">
                  <p className="text-xs text-text-muted">
                    No public reviews available yet for this advocate.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar 1 Col: Quick Facts, Availability, Modes */}
          <div className="space-y-6">
            {/* Consultation Formats */}
            <div className="card bg-white p-6">
              <h3 className="text-sm font-bold text-text-primary mb-3">
                Available Consultation Modes
              </h3>
              <div className="space-y-2.5">
                <div className="p-3 bg-surface rounded-xl border border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Video Consultation</p>
                    <p className="text-[11px] text-text-muted">High-definition Google Meet / WebRTC</p>
                  </div>
                </div>

                <div className="p-3 bg-surface rounded-xl border border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Phone Consultation</p>
                    <p className="text-[11px] text-text-muted">Direct telephonic discussion</p>
                  </div>
                </div>

                <div className="p-3 bg-surface rounded-xl border border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-primary flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">In-Person Chambers</p>
                    <p className="text-[11px] text-text-muted">At advocate's chamber office</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border">
                <Link
                  to={`/client/book/${advocateUser?._id || advocate._id}`}
                  className="btn-primary w-full text-xs py-2.5"
                >
                  Book Consultation Slot
                </Link>
              </div>
            </div>

            {/* Languages Spoken */}
            <div className="card bg-white p-6">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary" /> Spoken Languages
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {languages.length > 0 ? (
                  languages.map((lang) => (
                    <span key={lang} className="badge bg-surface text-text-primary text-xs border border-border">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-text-secondary">English, Hindi</span>
                )}
              </div>
            </div>

            {/* Regular Working Hours */}
            <div className="card bg-white p-6">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Practice Working Hours
              </h3>
              <div className="space-y-2 text-xs">
                {availability.length > 0 ? (
                  availability.map((slot, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-border/50">
                      <span className="font-medium text-text-primary">{slot.day}</span>
                      <span className="text-text-secondary">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted">Monday to Friday: 10:00 AM - 06:00 PM</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateDetailsPage;
