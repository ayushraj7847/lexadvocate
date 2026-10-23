import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Scale,
  Star,
  DollarSign,
  Briefcase,
  X,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import AdvocateCard from '../../components/shared/AdvocateCard';
import { Spinner, EmptyState, Pagination, Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const practiceAreaOptions = [
  'All',
  'Criminal Law',
  'Family Law',
  'Property Law',
  'Corporate Law',
  'Civil Law',
  'Consumer Law',
  'Labour Law',
  'Constitutional Law',
  'Tax Law',
  'Intellectual Property',
];

const AdvocatesDirectoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [advocates, setAdvocates] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [practiceArea, setPracticeArea] = useState(searchParams.get('practiceArea') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [minExperience, setMinExperience] = useState(searchParams.get('minExperience') || '');
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Fetch saved advocates if client is logged in
  useEffect(() => {
    if (user && user.role === 'client') {
      api.get('/advocates/saved')
        .then(({ data }) => {
          if (data.success && data.data.saved) {
            const ids = new Set(data.data.saved.map((s) => s.advocateProfile?._id || s.advocateProfile));
            setSavedIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Fetch advocates
  const fetchAdvocates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (practiceArea && practiceArea !== 'All') params.append('practiceArea', practiceArea);
      if (city) params.append('city', city);
      if (minRating) params.append('minRating', minRating);
      if (minExperience) params.append('minExperience', minExperience);
      if (maxFee) params.append('maxFee', maxFee);
      if (sortBy) params.append('sortBy', sortBy);
      params.append('page', page);
      params.append('limit', 9);

      setSearchParams(params, { replace: true });

      const { data } = await api.get(`/advocates?${params.toString()}`);
      if (data.success) {
        setAdvocates(data.data.advocates || []);
        setPagination(data.data.pagination || { page: 1, limit: 9, total: 0, pages: 1 });
      }
    } catch (err) {
      toast.error('Failed to load advocates');
    } finally {
      setLoading(false);
    }
  }, [search, practiceArea, city, minRating, minExperience, maxFee, sortBy, page, setSearchParams]);

  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  const handleToggleSave = async (advocateProfileId) => {
    if (!user) {
      toast.error('Please log in to save advocates');
      return;
    }
    if (user.role !== 'client') {
      toast.error('Only clients can save advocates');
      return;
    }

    try {
      const { data } = await api.post(`/advocates/${advocateProfileId}/save`);
      if (data.success) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (next.has(advocateProfileId)) {
            next.delete(advocateProfileId);
            toast.success('Removed from saved advocates');
          } else {
            next.add(advocateProfileId);
            toast.success('Advocate saved');
          }
          return next;
        });
      }
    } catch (err) {
      toast.error('Failed to update saved advocates');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setPracticeArea('All');
    setCity('');
    setMinRating('');
    setMinExperience('');
    setMaxFee('');
    setSortBy('rating');
    setPage(1);
  };

  return (
    <div className="bg-surface min-h-[calc(100vh-64px)] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Verified Legal Practitioners
          </span>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1">
            Find Your Legal Advocate
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Filter through verified counsel across High Courts and Supreme Court by specialization, experience, and courtroom expertise.
          </p>
        </div>

        {/* Top Controls: Search Input + Sorting + Mobile Filter Toggle */}
        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by advocate name or keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field pl-10"
            />
          </div>

          <div className="w-full md:w-auto flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface text-sm font-semibold text-text-primary"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted hidden sm:inline whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="input-field py-2 text-xs font-medium w-auto"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="fee_asc">Fee: Low to High</option>
                <option value="fee_desc">Fee: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filter & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> Filter Counsel
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Practice Area */}
              <div>
                <label className="label text-xs">Practice Area</label>
                <select
                  value={practiceArea}
                  onChange={(e) => {
                    setPracticeArea(e.target.value);
                    setPage(1);
                  }}
                  className="input-field text-xs"
                >
                  {practiceAreaOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'All' ? 'All Practice Areas' : opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* City / Location */}
              <div>
                <label className="label text-xs">City or Court State</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Delhi, Mumbai"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setPage(1);
                    }}
                    className="input-field pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Minimum Experience */}
              <div>
                <label className="label text-xs">Minimum Experience</label>
                <select
                  value={minExperience}
                  onChange={(e) => {
                    setMinExperience(e.target.value);
                    setPage(1);
                  }}
                  className="input-field text-xs"
                >
                  <option value="">Any Experience</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                  <option value="15">15+ Years</option>
                </select>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="label text-xs">Minimum Client Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(e.target.value);
                    setPage(1);
                  }}
                  className="input-field text-xs"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars ⭐⭐⭐⭐⭐</option>
                  <option value="4.0">4.0+ Stars ⭐⭐⭐⭐</option>
                  <option value="3.5">3.5+ Stars ⭐⭐⭐</option>
                </select>
              </div>

              {/* Max Consultation Fee */}
              <div>
                <label className="label text-xs">Maximum Consultation Fee (₹)</label>
                <select
                  value={maxFee}
                  onChange={(e) => {
                    setMaxFee(e.target.value);
                    setPage(1);
                  }}
                  className="input-field text-xs"
                >
                  <option value="">Any Budget</option>
                  <option value="1000">Up to ₹1,000</option>
                  <option value="1500">Up to ₹1,500</option>
                  <option value="2500">Up to ₹2,500</option>
                  <option value="5000">Up to ₹5,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advocate Cards Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-text-secondary font-medium">
                Showing{' '}
                <span className="font-bold text-text-primary">{advocates.length}</span> of{' '}
                <span className="font-bold text-text-primary">{pagination.total}</span> advocates
              </p>
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="text-xs text-text-secondary mt-3">Loading advocates directory...</p>
              </div>
            ) : advocates.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advocates.map((adv) => (
                    <AdvocateCard
                      key={adv._id}
                      advocate={adv}
                      isSaved={savedIds.has(adv._id)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>

                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-border p-12 text-center">
                <EmptyState
                  icon={Scale}
                  title="No Advocates Matched Your Filter"
                  description="Try broadening your search query, selecting another practice area, or clearing location filters."
                  action={
                    <Button variant="secondary" size="sm" onClick={resetFilters}>
                      Reset All Filters
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h3 className="font-bold text-base text-text-primary">Filter Advocates</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-lg hover:bg-surface">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label text-xs">Practice Area</label>
                  <select
                    value={practiceArea}
                    onChange={(e) => setPracticeArea(e.target.value)}
                    className="input-field text-xs"
                  >
                    {practiceAreaOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-xs">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City name"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="label text-xs">Minimum Experience</label>
                  <select
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="">Any</option>
                    <option value="5">5+ Years</option>
                    <option value="10">10+ Years</option>
                    <option value="15">15+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="label text-xs">Maximum Fee</label>
                  <select
                    value={maxFee}
                    onChange={(e) => setMaxFee(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="">Any</option>
                    <option value="1000">Up to ₹1,000</option>
                    <option value="2000">Up to ₹2,000</option>
                    <option value="3000">Up to ₹3,000</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      resetFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="btn-ghost flex-1 text-xs"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="btn-primary flex-1 text-xs"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvocatesDirectoryPage;
