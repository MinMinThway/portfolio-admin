import React, { useState } from 'react';

interface LoginViewProps {
    onLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await onLogin(email, password);
        setIsLoading(false);
        if (!result.success) {
            setError(result.message || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="flex items-center justify-center mb-8">
                     <svg className="h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
                    </svg>
                    <h1 className="text-3xl font-bold ml-3 text-text-primary">Admin Dashboard Pro</h1>
                </div>
                <div className="bg-card shadow-lg rounded-xl p-8 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-center text-text-primary mb-1">Welcome Back!</h2>
                    <p className="text-sm text-text-secondary text-center mb-6">Sign in to continue</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="password"
                                />
                            </div>
                        </div>
                        
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md" role="alert">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
