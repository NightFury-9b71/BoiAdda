import { Menu, File, BookOpen, BookCopy } from "lucide-react";
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar.js';

const Sidebar = () => {
    const { isOpen, toggle } = useSidebar();

    const navItems = [
        { label: "Dashboard", path: "/", icon: File },
        { label: "Books", path: "/books", icon: BookOpen },
        { label: "Donate", path: "/donate", icon: BookCopy },
    ];

    return (
        <>
            <button 
                onClick={toggle}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <aside className={`fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        বই আড্ডা
                    </h1>
                    <div className="border-b border-gray-200 mb-6"></div>

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
                                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span className="font-medium">{nav.label}</span>
                                </NavLink>
                            );
                        })}
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
