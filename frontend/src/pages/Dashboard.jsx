import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Gift, 
  Users, 
  TrendingUp,
  Book,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHeader, Card, StatsCard } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';

const Dashboard = () => {
    const { user } = useAuth();

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

            {/* Quick Stats */}
            <div>
                <h2 className={`text-xl font-semibold ${colorClasses.text.primary} mb-6`}>দ্রুত পরিসংখ্যান</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        value="১৫০+"
                        label="উপলব্ধ বই"
                        icon={BookOpen}
                        color="green"
                    />
                    <StatsCard
                        value="২৫"
                        label="ধার নেওয়া বই"
                        icon={Book}
                        color="blue"
                    />
                    <StatsCard
                        value="১২"
                        label="দান করা বই"
                        icon={Gift}
                        color="purple"
                    />
                    <StatsCard
                        value="৫০০+"
                        label="কমিউনিটি সদস্য"
                        icon={Users}
                        color="orange"
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <Card>
                <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>সাম্প্রতিক কার্যকলাপ</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-full ${colorClasses.bg.success} mr-3`}>
                                <BookOpen className={`h-4 w-4 ${colorClasses.text.success}`} />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                                    "বাংলা সাহিত্যের ইতিহাস" বই ধার নেওয়া হয়েছে
                                </p>
                                <p className={`text-xs ${colorClasses.text.tertiary}`}>২ ঘন্টা আগে</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-full ${colorClasses.bg.info} mr-3`}>
                                <Gift className={`h-4 w-4 ${colorClasses.text.info}`} />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                                    নতুন বই দান করা হয়েছে
                                </p>
                                <p className={`text-xs ${colorClasses.text.tertiary}`}>১ দিন আগে</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <div className="p-2 rounded-full bg-purple-100 mr-3">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                                    নতুন সদস্য যোগ দিয়েছেন
                                </p>
                                <p className={`text-xs ${colorClasses.text.tertiary}`}>৩ দিন আগে</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
