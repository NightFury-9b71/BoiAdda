import { useState, useEffect } from 'react';
import { Bell, User, LogOut, Settings, BookOpen } from "lucide-react";
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { colorClasses } from '../../styles/colors.js';
import NotificationPanel from '../NotificationPanel.jsx';
import api from '../../api.js';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            loadUnreadCount();
        }
    }, [isAuthenticated, user?.id]);

    const loadUnreadCount = async () => {
        try {
            const notifications = await api.getNotifications(user.id);
            const unread = notifications.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error loading notification count:', error);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

    return (
        <header className={`flex justify-between items-center w-full p-4 ${colorClasses.bg.primary} shadow-sm border-b ${colorClasses.border.primary}`}>
            <div className={`text-xl font-bold ${colorClasses.text.accent} ml-12`}>
                বই আড্ডা
            </div>

            {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button 
                            className={`p-2 hover:bg-gray-100 rounded-full transition-colors relative`}
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false); // Close user menu when opening notifications
                            }}
                        >
                            <Bell className={`w-5 h-5 ${colorClasses.text.secondary}`} />
                            {/* Notification badge */}
                            {unreadCount > 0 && (
                                <span className={`absolute -top-1 -right-1 bg-red-500 ${colorClasses.text.white} text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1`}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <NotificationPanel 
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                        />
                    </div>

                    <div className="relative">
                        <button 
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false); // Close notifications when opening user menu
                            }}
                        >
                            {user?.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className={`w-8 h-8 ${colorClasses.bg.accent} rounded-full flex items-center justify-center`}>
                                    <span className={`${colorClasses.text.white} text-sm font-medium`}>
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                            <span className={`hidden md:block text-sm font-medium ${colorClasses.text.secondary}`}>
                                {user?.name}
                            </span>
                        </button>

                        {showUserMenu && (
                            <>
                                {/* Overlay */}
                                <div 
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                
                                {/* Dropdown Menu */}
                                <div className={`absolute right-0 mt-2 w-56 ${colorClasses.bg.primary} rounded-lg shadow-lg border ${colorClasses.border.primary} z-20`}>
                                    <div className={`p-4 border-b ${colorClasses.border.primary}`}>
                                        <p className={`text-sm font-medium ${colorClasses.text.primary}`}>{user?.name}</p>
                                        <p className={`text-xs ${colorClasses.text.tertiary}`}>{user?.email}</p>
                                    </div>
                                    
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            className={`flex items-center gap-3 px-4 py-2 text-sm ${colorClasses.text.secondary} hover:bg-gray-100 transition-colors`}
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            প্রোফাইল
                                        </Link>
                                        
                                        <Link
                                            to="/my-books"
                                            className={`flex items-center gap-3 px-4 py-2 text-sm ${colorClasses.text.secondary} hover:bg-gray-100 transition-colors`}
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            আমার বই
                                        </Link>
                                        
                                        <Link
                                            to="/settings"
                                            className={`flex items-center gap-3 px-4 py-2 text-sm ${colorClasses.text.secondary} hover:bg-gray-100 transition-colors`}
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            সেটিংস
                                        </Link>
                                    </div>
                                    
                                    <div className={`border-t ${colorClasses.border.primary} py-2`}>
                                        <button
                                            onClick={handleLogout}
                                            className={`flex items-center gap-3 px-4 py-2 text-sm ${colorClasses.text.error} hover:bg-red-50 transition-colors w-full text-left`}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            সাইন আউট
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Link
                        to="/login"
                        className={`px-4 py-2 text-sm font-medium ${colorClasses.text.secondary} hover:text-gray-900 transition-colors`}
                    >
                        সাইন ইন
                    </Link>
                    <Link
                        to="/register"
                        className={`px-4 py-2 text-sm font-medium ${colorClasses.text.white} ${colorClasses.bg.accent} ${colorClasses.bg.accentHover} rounded-lg transition-colors`}
                    >
                        সাইন আপ
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
