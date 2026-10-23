const Badge = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
    navy: 'bg-navy/10 text-navy border border-navy/20',
    blue: 'bg-blue-50 text-primary border border-blue-200',
    red: 'bg-blue-50 text-primary border border-blue-200', // Harmonized with navy/blue palette
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
    purple: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    orange: 'bg-orange-50 text-orange-700 border border-orange-200',
  };
  return (
    <span className={`badge ${variants[variant] || variants.gray} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
