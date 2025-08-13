import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    Book,
  BookOpen, 
  Gift, 
  Users, 
  TrendingUp,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHeader, Card, LoadingSpinner } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';
import api from '../api.js';

const Dashboard = () => {
    const { user } = useAuth();
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load user's recent activities
            const activities = user ? 
                await api.getUserRecentActivities(user.id, 10, 7) : 
                await api.getRecentActivities(10);
            setRecentActivities(activities);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setRecentActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} মিনিট আগে`;
        } else if (diffHours < 24) {
            return `${diffHours} ঘন্টা আগে`;
        } else {
            return `${diffDays} দিন আগে`;
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'borrow':
                return <BookOpen className={`h-4 w-4 ${colorClasses.text.success}`} />;
            case 'donation':
                return <Gift className={`h-4 w-4 ${colorClasses.text.info}`} />;
            case 'return':
                return <Book className={`h-4 w-4 text-purple-600`} />;
            case 'member':
                return <Users className="h-4 w-4 text-purple-600" />;
            default:
                return <BookOpen className={`h-4 w-4 ${colorClasses.text.success}`} />;
        }
    };

    const getActivityBgColor = (type) => {
        switch (type) {
            case 'borrow':
                return colorClasses.bg.success;
            case 'donation':
                return colorClasses.bg.info;
            case 'return':
                return 'bg-purple-100';
            case 'member':
                return 'bg-purple-100';
            default:
                return colorClasses.bg.success;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title={`স্বাগতম, ${user?.name || 'ব্যবহারকারী'}!`}
                subtitle="আমাদের কমিউনিটির সাথে বই আবিষ্কার, ধার এবং ভাগাভাগি করুন"
            />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg ${colorClasses.bg.success} mr-4`}>
                            <BookOpen className={`h-6 w-6 ${colorClasses.text.success}`} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-1`}>
                                উপলব্ধ বই
                            </h3>
                            <p className={`${colorClasses.text.secondary} text-sm`}>
                                আমাদের বইয়ের সংগ্রহ ব্রাউজ করুন
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/books" 
                        className={`${colorClasses.text.accent} ${colorClasses.text.accentHover} font-medium inline-flex items-center text-sm transition-colors`}
                    >
                        বই দেখুন →
                    </Link>
                </Card>

                <Card>
                    <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg ${colorClasses.bg.info} mr-4`}>
                            <Gift className={`h-6 w-6 ${colorClasses.text.info}`} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-1`}>
                                বই দান করুন
                            </h3>
                            <p className={`${colorClasses.text.secondary} text-sm`}>
                                কমিউনিটির সাথে আপনার বই শেয়ার করুন
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/donate" 
                        className={`${colorClasses.text.accent} ${colorClasses.text.accentHover} font-medium inline-flex items-center text-sm transition-colors`}
                    >
                        এখনই দান করুন →
                    </Link>
                </Card>

                <Card>
                    <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg bg-purple-100 mr-4`}>
                            <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-1`}>
                                আপনার লাইব্রেরি
                            </h3>
                            <p className={`${colorClasses.text.secondary} text-sm`}>
                                আপনার ধার নেওয়া বই পরিচালনা করুন
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/my-books" 
                        className={`${colorClasses.text.accent} ${colorClasses.text.accentHover} font-medium inline-flex items-center text-sm transition-colors`}
                    >
                        আমার বই দেখুন →
                    </Link>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>সাম্প্রতিক কার্যকলাপ</h3>
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex items-center py-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : recentActivities.length === 0 ? (
                    <div className="text-center py-8">
                        <TrendingUp className={`h-8 w-8 ${colorClasses.text.tertiary} mx-auto mb-2`} />
                        <p className={`text-sm ${colorClasses.text.secondary}`}>
                            কোন সাম্প্রতিক কার্যকলাপ নেই
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentActivities.slice(0, 5).map((activity, index) => (
                            <div key={activity.id || index} className={`flex items-center justify-between py-2 ${index < recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-full ${getActivityBgColor(activity.type)} mr-3`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                                            {activity.description}
                                        </p>
                                        <p className={`text-xs ${colorClasses.text.tertiary}`}>
                                            {formatTimestamp(activity.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {recentActivities.length > 5 && (
                            <div className="pt-3 border-t border-gray-100 text-center">
                                <button className={`text-sm ${colorClasses.text.accent} hover:underline`}>
                                    আরো দেখুন
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
