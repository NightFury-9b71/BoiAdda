import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { EmptyState } from './ui/ThemeComponents.jsx';
import { Shield } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role_name !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <EmptyState
          icon={Shield}
          title="অ্যাক্সেস নিষেধ"
          description="এই পৃষ্ঠাটি শুধুমাত্র অ্যাডমিনদের জন্য। আপনার কাছে এই পৃষ্ঠায় অ্যাক্সেসের অনুমতি নেই।"
        />
      </div>
    );
  }

  return children;
};

export default AdminRoute;
