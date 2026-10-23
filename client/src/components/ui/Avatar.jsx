import { getInitials } from '../../utils/formatters';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-28 h-28 text-2xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={`${sizes[size]} rounded-full object-cover shadow-subtle ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-navy text-white font-semibold flex items-center justify-center flex-shrink-0 shadow-subtle ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
