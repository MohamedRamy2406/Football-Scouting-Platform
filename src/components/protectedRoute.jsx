
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({
  children,
  allowedRole
}) {
  const { user, loading } = useAuth();

  // Wait until we know whether the user has a session
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but doesn't have the required role
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // Authenticated + correct role
  return children;
}

