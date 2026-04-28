'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SidebarBackground } from '@/components/SidebarBackground';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

interface Achievement {
    id: string;
    name: string;
    description: string;
    xpReward: number;
    unlockedAt: string;
}

// Preset avatar seeds for DiceBear API
const AVATAR_SEEDS = [
    'Felix', 'Aneka', 'Zack', 'Midnight', 'Sam', 
    'Luna', 'Jack', 'Molly', 'Bear', 'Bandit'
];

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    
    // State
    const [name, setName] = useState(session?.user?.name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(session?.user?.image || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<{
        totalXp: number;
        level: number;
        currentXp: number;
        xpForNextLevel: number;
        gamesPlayed: number;
    } | null>(null);

    // Fetch achievements and stats on mount
    useEffect(() => {
        if (session?.user?.id) {
            fetch('/api/user/stats')
                .then(res => res.json())
                .then(data => {
                    if (data.achievements) {
                        setAchievements(data.achievements);
                    }
                    if (!data.error) {
                        setStats({
                            totalXp: data.totalXp,
                            level: data.level,
                            currentXp: data.currentXp,
                            xpForNextLevel: data.xpForNextLevel,
                            gamesPlayed: data.gamesPlayed,
                        });
                    }
                })
                .catch(err => console.error('Failed to load stats:', err));
        }
    }, [session?.user?.id]);

    // Update local state when session loads
    const getAvatarUrl = (seed: string) => 
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`;

    // Only update state from session if user hasn't typed anything yet (init)
    // or if the session update confirmed our saved changes
    const [isInitialized, setIsInitialized] = useState(false);
    
    if (session?.user && !isInitialized) {
        if (session.user.name) setName(session.user.name);
        if (session.user.image) setSelectedAvatar(session.user.image);
        setIsInitialized(true);
    }

    const handleSave = async () => {
        try {
            setIsLoading(true);
            setError('');
            setSuccess('');

            const response = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    image: selectedAvatar,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Update session locally so UI reflects changes immediately
            // This triggers the 'jwt' callback with 'update' trigger in auth.ts
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name,
                    image: selectedAvatar,
                },
            });

            setSuccess('Profil został zaktualizowany!');
            router.refresh();
            
        } catch (err) {
            console.error(err);
            setError('Nie udało się zapisać zmian.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Left Sidebar - Consistent with Home */}
            <div className="hidden lg:flex w-1/5 bg-[#4F6F2F] relative flex-col items-center py-12">
                <SidebarBackground />
                <div className="relative z-10 mb-auto">
                    <Link href="/home">
                        <Logo size="md" />
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full">
                    
                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/home"
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#4F6F2F]"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="text-3xl font-bold text-[#2d3e1b]">
                                Edytuj Profil
                            </h1>
                        </div>
                        <Button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            variant="outline"
                            className="!border-red-500 !text-red-500 hover:!bg-red-50 !py-2 !px-6 !text-base"
                        >
                            Wyloguj się
                        </Button>
                    </div>

                    <div className="bg-white border-2 border-[#e5e7eb] rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row gap-8 items-start">
                        
                        {/* Left Side: Current Profile & Edit */}
                        <div className="flex-1 w-full flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                            <div className="w-32 h-32 rounded-full border-4 border-[#8BC34A] overflow-hidden bg-gray-100 mb-4 shadow-md transition-all hover:scale-105">
                                <img 
                                    src={selectedAvatar || getAvatarUrl('placeholder')} 
                                    alt="Current Avatar" 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* XP Progress Bar */}
                            {stats && (
                                <div className="w-full mb-6 px-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-[#4F6F2F]">Poziom {stats.level}</span>
                                        <span className="text-xs text-[#4F6F2F]">{stats.totalXp} XP</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border-2 border-[#4F6F2F]/30">
                                        <div
                                            className="bg-gradient-to-r from-[#8BC34A] to-[#6B8E23] h-full rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${stats.xpForNextLevel > 0 ? (stats.currentXp / stats.xpForNextLevel) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-center text-[#4F6F2F] mt-1 font-medium">
                                        {stats.currentXp} / {stats.xpForNextLevel} XP do poziomu {stats.level + 1}
                                    </p>
                                </div>
                            )}

                            <div className="w-full mb-6">
                                <Input
                                    label="Twój Nickname"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={20}
                                    placeholder="Wpisz swój nick..."
                                    className="bg-gray-50 text-center font-bold text-lg"
                                />
                            </div>

                            <Button 
                                onClick={handleSave} 
                                disabled={isLoading} 
                                fullWidth
                                variant="primary"
                            >
                                {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                            </Button>

                            {/* Status Messages */}
                            <div className="mt-4 h-6 text-center">
                                {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
                                {success && <span className="text-green-600 text-sm font-medium">{success}</span>}
                            </div>
                        </div>

                        {/* Right Side: Avatar Selection */}
                        <div className="flex-1 w-full">
                            <label className="block text-[#3A5220] font-bold text-sm mb-4">
                                Wybierz nowy awatar
                            </label>
                            
                            <div className="grid grid-cols-4 lg:grid-cols-5 gap-3">
                                {AVATAR_SEEDS.map((seed) => {
                                    const url = getAvatarUrl(seed);
                                    return (
                                        <button
                                            key={seed}
                                            onClick={() => setSelectedAvatar(url)}
                                            className={`
                                                relative w-full aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-110 active:scale-95
                                                ${selectedAvatar === url ? 'border-[#8BC34A] ring-2 ring-[#8BC34A] ring-offset-2' : 'border-gray-100 hover:border-[#8BC34A]/50'}
                                            `}
                                            title={seed}
                                        >
                                            <img src={url} alt={seed} className="w-full h-full object-cover" />
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-400 mt-4 text-center">
                                Kliknij aby wybrać awatar z kolekcji.
                            </p>
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-[#2d3e1b] mb-4">Twoje Osiągnięcia</h2>
                        
                        {achievements.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {achievements.map((achievement) => (
                                    <div 
                                        key={achievement.id} 
                                        className="bg-[#f0fdf4] border border-[#8BC34A]/30 rounded-2xl p-4 shadow-sm flex items-start gap-4"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#8BC34A] to-[#4F6F2F] rounded-full flex items-center justify-center shrink-0 text-white text-xl shadow-md">
                                            🏆
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[#2d3e1b]">{achievement.name}</h3>
                                            <p className="text-sm text-[#4F6F2F] mb-1">{achievement.description}</p>
                                            <span className="inline-block bg-[#8BC34A]/20 text-[#2d3e1b] text-xs font-bold px-2 py-1 rounded-full">
                                                +{achievement.xpReward} XP
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
                                <div className="text-4xl mb-2">🌱</div>
                                <h3 className="text-gray-500 font-bold mb-1">Brak osiągnięć</h3>
                                <p className="text-gray-400 text-sm">Graj w gry, aby zdobywać odznaki i punkty XP!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

             {/* Right Sidebar - Consistent with Home */}
             <div className="hidden lg:block w-1/5 bg-[#4F6F2F] relative">
                <SidebarBackground />
            </div>
        </div>
    );
}
