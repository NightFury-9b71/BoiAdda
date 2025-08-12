import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Card from '../components/ui/Card.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await authService.forgotPassword(email);
            setIsEmailSent(true);
            toast.success('Password reset email sent!');
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Failed to send reset email';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Card>
                        <Card.Content className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Check your email
                            </h2>
                            
                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            
                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => {
                                        setIsEmailSent(false);
                                        setEmail('');
                                    }}
                                >
                                    Send another email
                                </Button>
                                
                                <Link
                                    to="/login"
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        বই আড্ডা
                    </h1>
                    <p className="text-gray-600">
                        Reset your password
                    </p>
                </div>

                <Card>
                    <Card.Content className="p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Forgot your password?
                            </h2>
                            <p className="text-sm text-gray-600">
                                No worries! Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                error={error}
                                required
                                autoComplete="email"
                                placeholder="Enter your email address"
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to login
                            </Link>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
