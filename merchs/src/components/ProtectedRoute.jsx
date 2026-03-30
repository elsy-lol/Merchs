import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireSeller = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loader"><div className="loader-spinner"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireSeller && user?.role !== 'seller' && user?.role !== 'both') return <Navigate to="/profile" replace />;

  return children;
};

export default ProtectedRoute;