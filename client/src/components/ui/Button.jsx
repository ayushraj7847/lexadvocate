import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-subtle hover:shadow',
    secondary: 'bg-white text-navy border border-border hover:border-primary hover:text-primary hover:bg-blue-50/50 focus:ring-primary shadow-subtle',
    navy: 'bg-navy text-white hover:bg-navy-dark focus:ring-navy shadow-subtle hover:shadow',
    ghost: 'text-text-secondary hover:bg-slate-100 hover:text-text-primary focus:ring-slate-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-subtle',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-subtle',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-9 py-4 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

export default Button;
