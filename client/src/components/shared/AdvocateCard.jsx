import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Heart,
  Calendar,
  Users,
} from 'lucide-react';

import { Avatar, StarRating, Badge } from '../ui';
import { formatCurrency } from '../../utils/formatters';

const AdvocateCard = ({
  advocate,
  isSaved = false,
  onToggleSave,
}) => {
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
  } = advocate;

  const advocateName = user?.name || 'Advocate';

  return (
    <div className="card group flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden border border-border transition-all duration-200 hover:shadow-card-hover">

      {/* Advocate details */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <div className="flex min-w-0 items-start gap-3">

          {/* Avatar */}
          <div className="shrink-0">
            <Avatar
              src={advocate.profilePhoto || user?.avatar}
              name={advocateName}
              size="lg"
              className="ring-2 ring-primary-50"
            />
          </div>

          {/* Name and rating */}
          <div className="min-w-0 flex-1">

            <div className="flex min-w-0 items-start justify-between gap-2">

              <div className="min-w-0 flex-1">
                <h3
                  title={advocateName}
                  className="break-words text-sm font-semibold leading-5 text-text-primary transition-colors group-hover:text-primary sm:text-base"
                >
                  {advocateName}
                </h3>

                <p
                  title={designation || 'Advocate'}
                  className="mt-0.5 break-words text-xs leading-4 text-text-secondary"
                >
                  {designation || 'Advocate'}
                </p>
              </div>

              {/* Save button */}
              {onToggleSave && (
                <button
                  type="button"
                  onClick={() => onToggleSave(_id)}
                  className={`shrink-0 rounded-lg border p-1.5 transition-colors ${
                    isSaved
                      ? 'border-primary-200 bg-primary-50 text-primary'
                      : 'border-border text-text-muted hover:border-primary-200 hover:text-primary'
                  }`}
                  aria-label={
                    isSaved ? 'Remove saved advocate' : 'Save advocate'
                  }
                  aria-pressed={isSaved}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isSaved ? 'fill-primary' : ''
                    }`}
                  />
                </button>
              )}

            </div>

            {/* Rating */}
            <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-1.5">
              <StarRating rating={rating} size="sm" />

              <span className="text-xs font-semibold text-text-primary">
                {Number(rating || 0).toFixed(1)}
              </span>

              <span className="text-xs text-text-muted">
                ({totalReviews || 0})
              </span>
            </div>

          </div>
        </div>

        {/* Practice areas */}
        {practiceAreas.length > 0 && (
          <div className="mt-4 flex min-w-0 flex-wrap gap-1.5">
            {practiceAreas.slice(0, 3).map((area, index) => (
              <Badge
                key={`${area}-${index}`}
                variant="red"
              >
                {area}
              </Badge>
            ))}

            {practiceAreas.length > 3 && (
              <Badge variant="gray">
                +{practiceAreas.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Location, experience and court */}
        <div className="mt-3.5 flex min-w-0 flex-col gap-2 text-xs text-text-secondary">

          {/* Location */}
          <div className="flex min-w-0 items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

            <span className="min-w-0 flex-1 break-words leading-4">
              {location?.city
                ? `${location.city}, ${location.state || 'India'}`
                : 'New Delhi, India'}
            </span>
          </div>

          {/* Experience */}
          <div className="flex min-w-0 items-start gap-2">
            <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />

            <span className="min-w-0 flex-1 break-words leading-4">
              {experience} Years of Active Experience
            </span>
          </div>

          {/* Court */}
          {court && (
            <div className="flex min-w-0 items-start gap-2">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />

              <span
                title={court}
                className="min-w-0 flex-1 break-words leading-4"
              >
                {court}
              </span>
            </div>
          )}

        </div>

        {/* Bio */}
        {bio && (
          <p className="mt-3 break-words text-xs leading-5 text-text-secondary [overflow-wrap:anywhere]">
            {bio}
          </p>
        )}

      </div>

      {/* Footer */}
      <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-border pt-4">

        {/* Consultation fee */}
        <div className="min-w-0">
          <span className="block text-[11px] uppercase tracking-wider text-text-muted">
            Consultation Fee
          </span>

          <span className="block break-words text-lg font-bold text-primary">
            {formatCurrency(consultationFee)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex min-w-0 flex-wrap items-center gap-2">

          <Link
            to={`/advocates/${_id}`}
            className="btn-ghost inline-flex min-w-0 max-w-full items-center justify-center rounded-lg border border-border px-3 py-2 text-xs"
          >
            Profile
          </Link>

          <Link
            to={`/client/book/${_id}`}
            className="btn-primary inline-flex min-w-0 max-w-full items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs"
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>Book</span>
          </Link>

        </div>

      </div>

    </div>
  );
};

export default AdvocateCard;