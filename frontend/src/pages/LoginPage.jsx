import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Input, Card, LoadingSpinner } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';
import DemoHelper from '../components/DemoHelper.jsx';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect path from location state or default to dashboard
    const from = location.state?.from?.pathname || '/';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'ইমেইল প্রয়োজন';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'সঠিক ইমেইল ঠিকানা দিন';
        }

        if (!formData.password) {
            newErrors.password = 'পাসওয়ার্ড প্রয়োজন';
        } else if (formData.password.length < 6) {
            newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const u = await login(formData); // sets token + user in context/localStorage
            // Route by role or fallback
            if (u.role_name === "admin") navigate("/admin");
            else navigate("/books");
        } catch (err) {
            setErrors({ form: err?.response?.data?.detail || "লগইন ব্যর্থ" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoFill = (demoData) => {
        setFormData(demoData);
        setErrors({});
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className={colorClasses.text.secondary}>লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${colorClasses.bg.secondary} py-12 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className={`text-3xl font-bold ${colorClasses.text.accent} mb-2`}>
                        বই আড্ডা
                    </h1>
                    <p className={colorClasses.text.secondary}>
                        আপনার অ্যাকাউন্টে সাইন ইন করুন
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="ইমেইল ঠিকানা"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            icon={Mail}
                            required
                            autoComplete="email"
                            placeholder="আপনার ইমেইল দিন"
                        />

                        <div className="relative">
                            <Input
                                label="পাসওয়ার্ড"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                error={errors.password}
                                icon={Lock}
                                required
                                autoComplete="current-password"
                                placeholder="আপনার পাসওয়ার্ড দিন"
                            />
                            <button
                                type="button"
                                className={`absolute right-3 top-8 ${colorClasses.text.tertiary} hover:text-gray-600`}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {errors.form && (
                            <div className={`p-3 rounded-md ${colorClasses.bg.error}`}>
                                <p className={`text-sm ${colorClasses.text.error}`}>{errors.form}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className={`h-4 w-4 ${colorClasses.text.accent} ${colorClasses.ring.accent} ${colorClasses.border.primary} rounded`}
                                />
                                <label htmlFor="remember-me" className={`ml-2 block text-sm ${colorClasses.text.secondary}`}>
                                    আমাকে মনে রাখুন
                                </label>
                            </div>

                            <Link
                                to="/forgot-password"
                                className={`text-sm ${colorClasses.text.accent} ${colorClasses.text.accentHover} transition-colors`}
                            >
                                পাসওয়ার্ড ভুলে গেছেন?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            {isSubmitting ? 'সাইন ইন হচ্ছে...' : 'সাইন ইন'}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${colorClasses.border.primary}`} />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-2 ${colorClasses.bg.primary} ${colorClasses.text.tertiary}`}>
                                    অ্যাকাউন্ট নেই?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/register"
                                className={`w-full flex justify-center py-2 px-4 border ${colorClasses.border.primary} rounded-lg text-sm font-medium ${colorClasses.text.secondary} ${colorClasses.bg.primary} hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorClasses.ring.accent} transition-colors`}
                            >
                                নতুন অ্যাকাউন্ট তৈরি করুন
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Demo Helper */}
            <DemoHelper 
                currentPage="login"
                onFillLogin={handleDemoFill}
            />
        </div>
    );
};

export default LoginPage;
