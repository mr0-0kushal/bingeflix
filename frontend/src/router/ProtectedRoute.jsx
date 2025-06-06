import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user , accessToken } = useAuth();
    
    if (!(user || accessToken)) {
        return <Navigate to='/auth/login' />;
    }
    return children;
};

export default ProtectedRoute;