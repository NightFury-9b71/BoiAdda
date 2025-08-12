import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';

const PublicRoute = ({ children, redirectTo = "/" }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect to dashboard if user is already logged in
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default PublicRoute;
