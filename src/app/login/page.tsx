'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SidebarBackground } from '@/components/SidebarBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const validateForm = (): string | null => {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email jest wymagany';
        }
        if (!emailRegex.test(email)) {
            return 'Nieprawidłowy format email';
        }

        // Password validation
        if (!password) {
            return 'Hasło jest wymagane';
        }
        if (password.length < 6) {
            return 'Hasło musi mieć minimum 6 znaków';
        }

        // Confirm password for registration
        if (isRegister && password !== confirmPassword) {
            return 'Hasła nie są takie same';
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            if (isRegister) {
                // Register new user
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Błąd rejestracji');
                    setIsLoading(false);
                    return;
                }

                // Auto-login after registration
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setError('Konto utworzone, ale błąd logowania. Zaloguj się ręcznie.');
                    setIsRegister(false);
                    setIsLoading(false);
                    return;
                }
            } else {
                // Login
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setError('Nieprawidłowy email lub hasło');
                    setIsLoading(false);
                    return;
                }
            }

            // Success - redirect to home
            router.push('/home');
            router.refresh();
        } catch {
            setError('Wystąpił błąd. Spróbuj ponownie.');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="hidden lg:block w-1/5 bg-[#4F6F2F] relative">
                <SidebarBackground />
            </div>

            {/* Center Content */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-white via-[#f0fdf4] to-[#e8f5e9]">
                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-8 left-8 text-[#4F6F2F] font-bold hover:text-[#2d3e1b] transition-colors flex items-center gap-2"
                >
                    ← Wróć
                </Link>

                {/* Main Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md flex flex-col items-center"
                >
                    {/* Logo Section with floating animation */}
                    <motion.div
                        className="mb-8"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Logo size="lg" />
                    </motion.div>

                    {/* Form Card */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-[2.5rem] p-8 w-full shadow-xl"
                    >
                        {/* Header Text */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-[#2d3e1b]">
                                {isRegister ? 'Stwórz konto' : 'Witaj ponownie!'}
                            </h2>
                            <p className="text-[#4F6F2F] text-sm mt-1">
                                {isRegister ? 'Dołącz do nauki języków' : 'Zaloguj się, aby kontynuować'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl mb-4 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Toggle Login/Register */}
                        <div className="flex bg-[#f0fdf4] p-1 rounded-full mb-6 relative">
                            <div
                                className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${isRegister ? 'left-[calc(50%-4px)] translate-x-1' : 'left-1'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => { setIsRegister(false); setError(''); }}
                                className={`flex-1 py-2 text-sm font-bold text-center z-10 transition-colors ${!isRegister ? 'text-[#2d3e1b]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                Logowanie
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsRegister(true); setError(''); }}
                                className={`flex-1 py-2 text-sm font-bold text-center z-10 transition-colors ${isRegister ? 'text-[#2d3e1b]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                Rejestracja
                            </button>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="Wpisz swój email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Input
                                label="Hasło"
                                type="password"
                                placeholder="Minimum 6 znaków"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            {isRegister && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Input
                                        label="Powtórz hasło"
                                        type="password"
                                        placeholder="Potwierdź hasło"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </motion.div>
                            )}

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    className="bg-[#2d3e1b] hover:bg-[#1f2a14] py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Ładowanie...' : isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Footer Text */}
                    <p className="mt-8 text-center text-[#4F6F2F] text-sm font-medium opacity-80">
                        Master Languages • Test Knowledge
                    </p>
                </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block w-1/5 bg-[#4F6F2F] relative">
                <SidebarBackground />
            </div>
        </div>
    );
}
