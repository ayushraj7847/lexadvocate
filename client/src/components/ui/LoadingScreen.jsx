import Spinner from './Spinner';

const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 bg-navy text-white rounded-xl flex items-center justify-center shadow-card">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      </div>
      <Spinner size="lg" />
      <p className="text-text-secondary text-sm font-medium">{message}</p>
    </div>
  </div>
);

export default LoadingScreen;
