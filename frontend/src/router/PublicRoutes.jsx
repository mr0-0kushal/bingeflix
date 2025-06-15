import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoutes = ({ children }) => {
  const { user } = useAuth();

  // If user is logged in, redirect to main (dashboard/home) page
  if (user) {
    return <Navigate to="/main" replace />;
  }

  // If no user, render the public route children (login, signup, etc.)
  return children;
};

export default PublicRoutes;
