import { 
  Menu, 
  Home, 
  BookOpen, 
  Gift, 
  Search,
  User,
  Book,
  Settings,
  Shield,
  CheckSquare
} from "lucide-react";
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { colorClasses } from '../../styles/colors.js';

const Sidebar = () => {
    const { isOpen, toggle } = useSidebar();
    const { user } = useAuth();

    const navItems = [
        { label: "ড্যাশবোর্ড", path: "/", icon: Home },
        { label: "বই সংগ্রহ", path: "/books", icon: BookOpen },
        { label: "খুঁজুন", path: "/search", icon: Search },
        { label: "বই দান", path: "/donate", icon: Gift },
        { label: "আমার বই", path: "/my-books", icon: Book },
        { label: "প্রোফাইল", path: "/profile", icon: User },
        { label: "সেটিংস", path: "/settings", icon: Settings },
    ];

    const adminNavItems = [
        { label: "অ্যাডমিন ড্যাশবোর্ড", path: "/admin", icon: Shield },
    ];

    // Check if user is admin
    const isAdmin = user?.role_name === 'admin';

    return (
        <>
            <button 
                onClick={toggle}
                className={`fixed top-4 left-4 z-50 p-2 ${colorClasses.bg.primary} rounded-lg shadow-md hover:shadow-lg transition-shadow`}
            >
                <Menu className={`w-6 h-6 ${colorClasses.text.secondary}`} />
            </button>

            <aside className={`fixed top-0 left-0 h-full w-64 ${colorClasses.bg.primary}/95 backdrop-blur-sm border-r ${colorClasses.border.primary} shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-6">
                    <h1 className={`text-2xl font-bold text-center ${colorClasses.text.accent} mb-6`}>
                        বই আড্ডা
                    </h1>
                    <div className={`border-b ${colorClasses.border.primary} mb-6`}></div>

                    <nav className="space-y-2">
                        {navItems.map((nav) => {
                            const IconComponent = nav.icon;
                            return (
                                <NavLink 
                                    key={nav.label} 
                                    to={nav.path} 
                                    onClick={toggle}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 p-3 rounded-lg transition-colors
                                        ${isActive 
                                            ? `${colorClasses.bg.success} ${colorClasses.text.success} border-l-4 border-green-600` 
                                            : `${colorClasses.text.secondary} hover:bg-gray-100`
                                        }
                                    `}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span className="font-medium">{nav.label}</span>
                                </NavLink>
                            );
                        })}

                        {/* Admin Section */}
                        {isAdmin && (
                            <>
                                <div className={`border-t ${colorClasses.border.primary} my-4 pt-4`}>
                                    <h3 className={`text-xs font-semibold ${colorClasses.text.tertiary} mb-2 px-3`}>
                                        অ্যাডমিন প্যানেল
                                    </h3>
                                </div>
                                {adminNavItems.map((nav) => {
                                    const IconComponent = nav.icon;
                                    return (
                                        <NavLink 
                                            key={nav.label} 
                                            to={nav.path} 
                                            onClick={toggle}
                                            className={({ isActive }) => `
                                                flex items-center gap-3 p-3 rounded-lg transition-colors
                                                ${isActive 
                                                    ? `bg-red-100 text-red-700 border-l-4 border-red-600` 
                                                    : `${colorClasses.text.secondary} hover:bg-red-50`
                                                }
                                            `}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="font-medium">{nav.label}</span>
                                        </NavLink>
                                    );
                                })}
                            </>
                        )}
                    </nav>
                </div>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-30"
                    onClick={toggle}
                />
            )}
        </>
    );
};

export default Sidebar;
