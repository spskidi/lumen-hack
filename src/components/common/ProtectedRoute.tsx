import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'user')[];
  redirectTo?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['user', 'admin'],
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = user && allowedRoles.includes(user.role as 'admin' | 'user');

  if (!hasRequiredRole) {
    // Redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['user']}>
    {children}
  </ProtectedRoute>
);
