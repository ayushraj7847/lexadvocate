import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Star, Heart, Calendar, Video, PhoneCall, Users } from 'lucide-react';
import { Avatar, StarRating, Badge, Button } from '../ui';
import { formatCurrency } from '../../utils/formatters';

const AdvocateCard = ({ advocate, isSaved = false, onToggleSave }) => {
  const {
    _id,
    user,
    designation,
    practiceAreas = [],
    experience = 0,
    rating = 0,
    totalReviews = 0,
    location,
    consultationFee = 500,
    court,
    bio,
    consultationTypes = ['video', 'audio'],
  } = advocate;

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between border border-border group">
      <div>
        {/* Header: Photo, Name, Rating & Save button */}
        <div className="flex items-start gap-3.5">
          <Avatar
            src={advocate.profilePhoto || user?.avatar}
            name={user?.name}
            size="lg"
            className="ring-2 ring-red-50 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div>
                <h3 className="font-semibold text-text-primary text-base leading-tight truncate group-hover:text-primary transition-colors">
                  {user?.name}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5 truncate">
                  {designation || 'Advocate'}
                </p>
              </div>
              {onToggleSave && (
                <button
                  type="button"
                  onClick={() => onToggleSave(_id)}
                  className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                    isSaved
                      ? 'bg-primary-50 border-primary-200 text-primary'
                      : 'border-border text-text-muted hover:text-primary hover:border-primary-200'
                  }`}
                  aria-label="Save advocate"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-primary' : ''}`} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1.5">
              <StarRating rating={rating} size="sm" />
              <span className="text-xs font-semibold text-text-primary">{rating.toFixed(1)}</span>
              <span className="text-xs text-text-muted">({totalReviews})</span>
            </div>
          </div>
        </div>

        {/* Practice Area Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {practiceAreas.slice(0, 3).map((area) => (
            <Badge key={area} variant="red">
              {area}
            </Badge>
          ))}
          {practiceAreas.length > 3 && (
            <Badge variant="gray">+{practiceAreas.length - 3} more</Badge>
          )}
        </div>

        {/* Key Info: Location, Court & Experience */}
        <div className="mt-3.5 space-y-1.5 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">
              {location?.city ? `${location.city}, ${location.state || 'India'}` : 'New Delhi, India'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span>{experience} Years of Active Experience</span>
          </div>
          {court && (
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <span className="truncate">{court}</span>
            </div>
          )}
        </div>

        {/* Bio snippet */}
        {bio && (
          <p className="mt-3 text-xs text-text-secondary line-clamp-2 leading-relaxed">
            {bio}
          </p>
        )}
      </div>

      {/* Footer: Fee & Book Consultation Action */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-text-muted uppercase tracking-wider block">
            Consultation Fee
          </span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(consultationFee)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/advocates/${_id}`}
            className="btn-ghost text-xs px-3 py-2 border border-border"
          >
            Profile
          </Link>
          <Link
            to={`/client/book/${_id}`}
            className="btn-primary text-xs px-3.5 py-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdvocateCard;
