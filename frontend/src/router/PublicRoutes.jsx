import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoutes = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/main" />; // or your main route
  }

  return children;
};

export default PublicRoutes;
