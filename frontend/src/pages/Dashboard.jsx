import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                    Discover, borrow, and share books with our community
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Available Books
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Browse through our collection of books
                    </p>
                    <Link 
                        to="/books" 
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                        View Books →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Donate a Book
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Share your books with the community
                    </p>
                    <Link 
                        to="/donate" 
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                        Donate Now →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your Library
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Manage your borrowed books
                    </p>
                    <Link 
                        to="/my-books" 
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                        View My Books →
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">150+</div>
                        <div className="text-sm text-blue-800">Available Books</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600">25</div>
                        <div className="text-sm text-green-800">Books Borrowed</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600">12</div>
                        <div className="text-sm text-purple-800">Books Donated</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600">500+</div>
                        <div className="text-sm text-orange-800">Community Members</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
