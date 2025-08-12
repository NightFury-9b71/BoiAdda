import { useState } from 'react';
import { Bell, User, LogOut, Settings, BookOpen } from "lucide-react";
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

    return (
        <header className="flex justify-between items-center w-full p-4 bg-white shadow-sm border-b">
            <div className="text-xl font-bold text-gray-800">
                বই আড্ডা
            </div>

            {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                        <Bell className="w-5 h-5 text-gray-600" />
                        {/* Notification badge */}
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </span>
                    </button>

                    <div className="relative">
                        <button 
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            {user?.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                            <span className="hidden md:block text-sm font-medium text-gray-700">
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
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                    <div className="p-4 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        
                                        <Link
                                            to="/my-books"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            My Books
                                        </Link>
                                        
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
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
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Sign Up
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
