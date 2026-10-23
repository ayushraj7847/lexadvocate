import { Link } from 'react-router-dom';
import { Scale, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-6 shadow-sm">
        <Scale className="w-8 h-8" />
      </div>
      <span className="text-sm font-bold text-primary tracking-widest uppercase">
        404 — Record Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-2">
        Page Does Not Exist
      </h1>
      <p className="text-xs sm:text-sm text-text-secondary mt-3 max-w-md leading-relaxed">
        The legal brief or dashboard URL you were navigating to has been moved, archived, or is currently unavailable.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn-primary text-xs py-2.5 px-5">
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
        <Link to="/advocates" className="btn-secondary text-xs py-2.5 px-5">
          Browse Advocate Directory
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
