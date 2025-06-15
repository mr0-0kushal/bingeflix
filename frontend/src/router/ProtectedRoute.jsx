import ScreenLoader from '../components/ScreenLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, accessToken, loading } = useAuth();

    if (loading) {
        return <ScreenLoader />; // Or use a spinner
    }

    if (!(user && accessToken)) {
        return <Navigate to="/auth/login" replace/>;
    }

    return children;
};

export default ProtectedRoute;
