import ScreenLoader from '../components/ScreenLoader';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <ScreenLoader />;

    if (!user) return <Navigate to="/auth/login" replace />;

    if (user.role !== "admin")
        return <Navigate to="/main" replace />;

    return children;
};

export default AdminRoute;