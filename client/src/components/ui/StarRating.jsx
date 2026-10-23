import { Star } from 'lucide-react';

const StarRating = ({ rating, maxStars = 5, size = 'sm', showValue = false, interactive = false, onChange }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={`${sizes[size]} ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer' : ''}`}
          onClick={() => interactive && onChange && onChange(i + 1)}
        />
      ))}
      {showValue && <span className="text-sm text-text-secondary ml-1">{rating?.toFixed(1)}</span>}
    </div>
  );
};
export default StarRating;
