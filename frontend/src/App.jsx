import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BooksPage from './pages/BooksPage.jsx';
import DonatePage from './pages/DonatePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyBooksPage from './pages/MyBooksPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import SearchBooks from './pages/Theme.jsx'; // Import the search books page

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
        },
        mutations: {
            retry: 1,
        },
    },
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <div className="min-h-screen bg-gray-50">
                        <Routes>
                            {/* Public Routes */}
                            <Route 
                                path="/login" 
                                element={
                                    <PublicRoute>
                                        <LoginPage />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/register" 
                                element={
                                    <PublicRoute>
                                        <RegisterPage />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/forgot-password" 
                                element={
                                    <PublicRoute>
                                        <ForgotPasswordPage />
                                    </PublicRoute>
                                } 
                            />

                            {/* Protected Routes */}
                            <Route 
                                path="/" 
                                element={
                                    <ProtectedRoute>
                                        <Layout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Dashboard />} />
                                <Route path="/books" element={<BooksPage />} />
                                <Route path="/search" element={<SearchBooks />} />
                                <Route path="/donate" element={<DonatePage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/my-books" element={<MyBooksPage />} />
                                <Route path="/admin" element={
                                    <AdminRoute>
                                        <AdminDashboard />
                                    </AdminRoute>
                                } />
                                <Route path="/settings" element={<SettingsPage />} />
                            </Route>
                        </Routes>
                    </div>
                    <Toaster position="top-right" richColors />
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;