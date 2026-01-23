'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { SidebarBackground } from '@/components/SidebarBackground';
import Link from 'next/link';

interface UserStats {
    totalXp: number;
    level: number;
    currentXp: number;
    xpForNextLevel: number;
    gamesPlayed: number;
}

export default function HomePage() {
    const { data: session, status } = useSession();
    const isLoggedIn = status === 'authenticated' && session?.user;
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetch('/api/user/stats')
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setStats(data);
                    }
                })
                .catch(console.error);
        }
    }, [isLoggedIn]);

    const userLevel = stats?.level ?? 1;
    const currentXP = stats?.currentXp ?? 0;
    const xpForNextLevel = stats?.xpForNextLevel ?? 100;
    const progressPercentage = xpForNextLevel > 0 ? (currentXP / xpForNextLevel) * 100 : 0;

    return (
        <div className="flex min-h-screen bg-white flex-col">
            <div className="flex flex-1">
                {/* Left Sidebar (Green with animated letters) */}
                <div className="hidden lg:flex w-1/5 bg-[#4F6F2F] relative flex-col items-center py-12">
                    <SidebarBackground />
                    <div className="relative z-10 mb-auto">
                        <Logo size="md" />
                    </div>

                    {/* User Profile in Sidebar */}
                    <div className="relative z-10 w-full px-6 pb-4">
                        <div className="bg-white/95 backdrop-blur-sm border-4 border-white rounded-3xl p-4 flex flex-col items-center gap-3 shadow-xl">
                            {isLoggedIn ? (
                                <>
                                    {/* Logged-in user avatar */}
                                    <div className="w-20 h-20 bg-white rounded-full border-4 border-[#8BC34A] overflow-hidden shadow-lg">
                                        {session.user.image ? (
                                            <img
                                                src={session.user.image}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#8BC34A] flex items-center justify-center">
                                                <span className="text-3xl font-bold text-white">
                                                    {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center w-full">
                                        <span className="font-bold text-[#2d3e1b] text-lg">
                                            {session.user.name || session.user.email?.split('@')[0] || 'User'}
                                        </span>
                                        <span className="text-sm text-[#4F6F2F] font-semibold mb-2">
                                            Level {userLevel}
                                        </span>

                                        {/* Progress Bar */}
                                        <div className="w-full mt-2">
                                            <div className="flex justify-between text-xs text-[#4F6F2F] mb-1 font-semibold">
                                                <span>{currentXP} XP</span>
                                                <span>{xpForNextLevel} XP</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border-2 border-[#4F6F2F]">
                                                <div
                                                    className="bg-gradient-to-r from-[#8BC34A] to-[#6B8E23] h-full rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: `${progressPercentage}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-center text-[#4F6F2F] mt-1 font-medium">
                                                {xpForNextLevel - currentXP} XP to Level {userLevel + 1}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Guest avatar */}
                                    <div className="w-20 h-20 bg-gray-200 rounded-full border-4 border-gray-300 flex items-center justify-center shadow-lg overflow-hidden">
                                        <svg className="w-16 h-16 text-gray-400 mt-4" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M12 14c-6 0-8 3-8 6v2h16v-2c0-3-2-6-8-6z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-center w-full">
                                        <span className="font-bold text-[#2d3e1b] text-lg">Guest</span>
                                        <Link
                                            href="/login"
                                            className="text-xs text-center text-[#4F6F2F] mt-2 opacity-80 hover:opacity-100 hover:underline transition-opacity"
                                        >
                                            Zaloguj się żeby odkryć więcej
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Center Content (Clean white area) */}
                <div className="flex-1 flex flex-col p-8 md:p-12 bg-white">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex justify-between items-center mb-12">
                        <div className="flex items-center gap-3">
                            <Logo size="sm" showText={false} />
                            <span className="font-bold text-[#4F6F2F] text-2xl">LanGuess</span>
                        </div>

                        {/* Mobile Profile */}
                        <div className="bg-[#f0fdf4] border-2 border-[#8BC34A] rounded-full p-2 pr-4 flex items-center gap-2">
                            {isLoggedIn && session.user.image ? (
                                <div className="w-10 h-10 bg-white rounded-full border-2 border-[#8BC34A] overflow-hidden">
                                    <img
                                        src={session.user.image}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400 mt-1" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M12 14c-6 0-8 3-8 6v2h16v-2c0-3-2-6-8-6z" />
                                    </svg>
                                </div>
                            )}
                            <span className="font-bold text-[#2d3e1b] text-sm">
                                {isLoggedIn ? (session.user.name || session.user.email?.split('@')[0]) : 'Guest'}
                            </span>
                        </div>
                    </div>

                    {/* Page Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#2d3e1b] mb-3">
                            Choose Your Game Mode
                        </h1>
                        <p className="text-lg text-[#4F6F2F]">Test your language knowledge</p>
                    </div>

                    {/* Game Modes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
                        {/* Classic Mode Card */}
                        <Link
                            href="/game"
                            className="bg-white border-4 border-[#8BC34A] rounded-3xl p-8 flex flex-col items-center gap-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg group"
                        >
                            <div className="w-60 h-60 flex items-center justify-center">
                                <img
                                    src="/cba5a9e1-a9ed-4ab5-b530-a12a2a7511fb.png"
                                    alt="Classic Mode"
                                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-[#8BC34A] font-bold text-2xl group-hover:text-[#6B8E23] transition-colors">
                                Classic
                            </h3>
                        </Link>

                        {/* Coming Soon Mode 1 */}
                        <div className="bg-white border-4 border-gray-300 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-lg opacity-60 cursor-not-allowed">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                                <span className="text-7xl text-gray-400">?</span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-gray-400 font-bold text-2xl mb-1">Coming Soon</h3>
                                <p className="text-sm text-gray-400">New mode in development</p>
                            </div>
                        </div>

                        {/* Coming Soon Mode 2 */}
                        <div className="bg-white border-4 border-gray-300 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-lg opacity-60 cursor-not-allowed">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                                <span className="text-7xl text-gray-400">?</span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-gray-400 font-bold text-2xl mb-1">Coming Soon</h3>
                                <p className="text-sm text-gray-400">New mode in development</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Green with animated letters) */}
                <div className="hidden lg:block w-1/5 bg-[#4F6F2F] relative">
                    <SidebarBackground />
                </div>
            </div>
        </div>
    );
}
