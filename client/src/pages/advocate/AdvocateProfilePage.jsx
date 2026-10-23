import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Languages,
  Building,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Button, Spinner } from '../../components/ui';
import api from '../../services/api';
import toast from 'react-hot-toast';

const availablePracticeAreas = [
  'Criminal Law',
  'Family Law',
  'Property Law',
  'Corporate Law',
  'Civil Law',
  'Consumer Law',
  'Labour Law',
  'Intellectual Property',
  'Tax Law',
  'Constitutional Law',
];

const AdvocateProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  // Profile fields state
  const [barCouncilNumber, setBarCouncilNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState(0);
  const [court, setCourt] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [languagesStr, setLanguagesStr] = useState('');
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState([]);

  useEffect(() => {
    const fetchAdvocateProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/advocates/me/dashboard');
        if (data.success && data.data.profile) {
          const p = data.data.profile;
          setProfile(p);
          setBarCouncilNumber(p.barCouncilNumber || '');
          setDesignation(p.designation || 'Advocate');
          setBio(p.bio || '');
          setExperience(p.experience || 0);
          setCourt(p.court || '');
          setCity(p.location?.city || '');
          setState(p.location?.state || '');
          setLanguagesStr((p.languages || []).join(', '));
          setSelectedPracticeAreas(p.practiceAreas || []);
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvocateProfile();
  }, []);

  const handleTogglePracticeArea = (area) => {
    setSelectedPracticeAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (selectedPracticeAreas.length === 0) {
      toast.error('Please select at least one practice area');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        barCouncilNumber,
        designation,
        bio,
        experience: Number(experience),
        court,
        location: {
          city,
          state,
          country: 'India',
        },
        languages: languagesStr
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean),
        practiceAreas: selectedPracticeAreas,
      };

      const { data } = await api.put('/advocates/profile', payload);
      if (data.success) {
        toast.success('Professional advocate profile updated!');
        setProfile(data.data.profile);
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary mt-3">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Chamber Credentials
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Professional Advocate Profile
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Your public profile viewed by clients seeking legal counsel
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Verification Status Header Card */}
        <div className="card bg-white p-6 sm:p-8 flex items-center justify-between gap-4 border border-border">
          <div className="flex items-center gap-4">
            <Avatar name={user?.name} size="xl" className="shadow-xs" />
            <div>
              <h3 className="text-base font-bold text-text-primary">{user?.name}</h3>
              <p className="text-xs text-text-secondary">{designation} • {user?.email}</p>
              <span className="badge bg-green-100 text-success text-[10px] mt-1.5 flex items-center gap-1 w-max">
                <ShieldCheck className="w-3.5 h-3.5" /> Bar Council Verified Practitioner
              </span>
            </div>
          </div>
        </div>

        {/* Credentials & Bar Enrollment */}
        <div className="card bg-white p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">
            Official Enrollment & Court Practice
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs">Bar Council Enrollment Number</label>
              <input
                type="text"
                value={barCouncilNumber}
                onChange={(e) => setBarCouncilNumber(e.target.value)}
                placeholder="e.g. D/1428/2012"
                className="input-field text-xs font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="label text-xs">Professional Title / Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior High Court Advocate"
                className="input-field text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label text-xs">Primary Court / Bench</label>
              <input
                type="text"
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                placeholder="e.g. Delhi High Court"
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="label text-xs">Years of Active Experience</label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="label text-xs">Languages Spoken</label>
              <input
                type="text"
                value={languagesStr}
                onChange={(e) => setLanguagesStr(e.target.value)}
                placeholder="English, Hindi, Punjabi"
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs">Chamber City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="label text-xs">State / Union Territory</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Delhi"
                className="input-field text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Practice Areas Selection */}
        <div className="card bg-white p-6 sm:p-8 space-y-3">
          <label className="label text-xs">Practice Area Specializations (Select all that apply)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {availablePracticeAreas.map((area) => {
              const checked = selectedPracticeAreas.includes(area);
              return (
                <button
                  type="button"
                  key={area}
                  onClick={() => handleTogglePracticeArea(area)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between ${
                    checked
                      ? 'border-primary bg-primary-50 text-primary font-bold'
                      : 'border-border bg-white text-text-secondary hover:border-primary-200'
                  }`}
                >
                  <span>{area}</span>
                  {checked && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Professional Biography */}
        <div className="card bg-white p-6 sm:p-8 space-y-3">
          <label className="label text-xs">Detailed Professional Biography</label>
          <textarea
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share your legal qualifications, landmark judgments argued, trial experience, and approach to client consultation..."
            className="input-field text-xs resize-none leading-relaxed"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" loading={saving}>
            <Save className="w-4 h-4" /> Save Profile Credentials
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdvocateProfilePage;
