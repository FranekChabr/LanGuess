'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { SidebarBackground } from '@/components/SidebarBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleGuestPlay = async () => {
        if (session) {
            await signOut({ redirect: false });
        }
        router.push('/home');
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar with animated letters */}
            <div className="hidden lg:block w-1/5 bg-[#4F6F2F] relative">
                <SidebarBackground />
            </div>

            {/* Center Content with gradient */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-white via-[#f0fdf4] to-[#e8f5e9]">
                {/* Main Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md flex flex-col items-center gap-8"
                >
                    {/* Logo Section with floating animation */}
                    <motion.div
                        className="mb-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Logo size="lg" />
                    </motion.div>

                    {/* Tagline */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-center mb-4"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-[#2d3e1b] mb-2">
                            Ćwicz języki
                        </h1>
                        <p className="text-lg text-[#4F6F2F] font-medium">
                            Ucz się języków, baw się i rozwijaj swoje umiejętności!
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        className="w-full space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <Link href="/login" className="block">
                            <Button
                                variant="primary"
                                fullWidth
                                className="bg-[#2d3e1b] text-white text-xl py-5 shadow-lg hover:shadow-xl hover:bg-[#1f2a14] transform hover:scale-105 transition-all"
                            >
                                Zaloguj się / Zarejestruj
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            fullWidth
                            onClick={handleGuestPlay}
                            className="bg-white text-[#3A5220] border-4 border-[#3A5220] text-xl py-5 hover:bg-gray-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            Graj jako gość
                        </Button>
                    </motion.div>

                    {/* Feature highlights */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="flex gap-8 mt-8 text-center"
                    >
                        <div className="flex-1">
                            <div className="w-12 h-12 mx-auto mb-2 bg-[#8BC34A] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <p className="text-xs text-[#4F6F2F] font-semibold">Wiele <br /> języków</p>
                        </div>
                        <div className="flex-1">
                            <div className="w-12 h-12 mx-auto mb-2 bg-[#8BC34A] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">⚡</span>
                            </div>
                            <p className="text-xs text-[#4F6F2F] font-semibold">Szybka rozgrywka</p>
                        </div>
                        <div className="flex-1">
                            <div className="w-12 h-12 mx-auto mb-2 bg-[#8BC34A] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">★</span>
                            </div>
                            <p className="text-xs text-[#4F6F2F] font-semibold">Śledzenie postępów</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Right Sidebar with animated letters */}
            <div className="hidden lg:block w-1/5 bg-[#4F6F2F] relative">
                <SidebarBackground />
            </div>
        </div>
    );
}
