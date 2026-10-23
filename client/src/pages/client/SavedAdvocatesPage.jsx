import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Briefcase, Calendar, Trash2 } from 'lucide-react';
import { Avatar, Badge, StarRating, Spinner, EmptyState } from '../../components/ui';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SavedAdvocatesPage = () => {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/advocates/saved');
      if (data.success) {
        setSavedList(data.data.saved || []);
      }
    } catch (err) {
      toast.error('Failed to load saved advocates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (advocateProfileId) => {
    try {
      const { data } = await api.post(`/advocates/${advocateProfileId}/save`);
      if (data.success) {
        toast.success('Advocate removed from saved list');
        fetchSaved();
      }
    } catch (err) {
      toast.error('Failed to remove advocate');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Bookmarked Counsel
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Saved Advocates
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Quickly access your shortlisted legal advocates for upcoming legal requirements
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="text-xs text-text-secondary mt-3">Loading saved advocates...</p>
        </div>
      ) : savedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((item) => {
            const profile = item.advocateProfile;
            const advUser = profile?.user;
            if (!profile) return null;

            return (
              <div
                key={item._id}
                className="card bg-white p-5 hover:shadow-card-hover transition-all duration-200 border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={advUser?.name} size="md" />
                      <div>
                        <h3 className="text-sm font-bold text-text-primary truncate">
                          {advUser?.name}
                        </h3>
                        <p className="text-xs text-text-secondary">
                          {profile.designation || 'Advocate'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(profile._id)}
                      className="p-1.5 text-text-muted hover:text-red-600 rounded-lg transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-xs">
                    <StarRating rating={profile.rating} size="sm" />
                    <span className="font-bold text-xs text-text-primary">{profile.rating?.toFixed(1)}</span>
                    <span className="text-[10px] text-text-muted">({profile.totalReviews})</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {(profile.practiceAreas || []).slice(0, 3).map((area) => (
                      <Badge key={area} variant="red" className="text-[10px]">
                        {area}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-text-muted space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {profile.location?.city ? `${profile.location.city}, ${profile.location.state}` : 'Delhi'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {profile.experience} Years Experience
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(profile.consultationFee)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/advocates/${profile._id}`}
                      className="btn-ghost text-xs py-1.5 px-3 border border-border"
                    >
                      Profile
                    </Link>
                    <Link
                      to={`/client/book/${advUser?._id || profile._id}`}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Book Slot
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center">
          <EmptyState
            icon={Heart}
            title="No Saved Advocates Yet"
            description="Browse our verified advocate directory and click the heart icon on any profile to bookmark them."
            action={
              <Link to="/advocates" className="btn-primary text-xs">
                Browse Advocates Directory
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
};

export default SavedAdvocatesPage;
