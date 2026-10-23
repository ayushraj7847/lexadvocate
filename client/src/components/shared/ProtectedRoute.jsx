import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingScreen } from '../ui';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen message="Verifying session..." />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'client' ? '/client/dashboard' : '/advocate/dashboard'} replace />;
  }
  return children;
};

export default ProtectedRoute;
