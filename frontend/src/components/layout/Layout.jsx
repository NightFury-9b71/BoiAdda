import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
