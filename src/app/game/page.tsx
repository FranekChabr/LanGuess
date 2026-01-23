'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { SidebarBackground } from '@/components/SidebarBackground';
import { Button } from '@/components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Language {
    code: string;
    name: string;
    nameEn: string;
}

interface QuestionData {
    sentence: string;
    options: Language[];
    correctLanguageCode: string;
    correctLanguageName: string;
}

interface GameState {
    currentQuestion: number;
    totalQuestions: number;
    score: number;
    difficulty: 'easy' | 'medium' | 'hard';
    correctAnswers: number;
    rounds: RoundData[];
}

interface RoundData {
    targetLanguage: string;
    sentence: string;
    userAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
}

type GamePhase = 'playing' | 'transition' | 'summary';

// Question count based on difficulty
const QUESTIONS_PER_DIFFICULTY = {
    easy: 8,
    medium: 12,
    hard: 15,
};

export default function GamePage() {
    const router = useRouter();
    const [gamePhase, setGamePhase] = useState<GamePhase>('playing');
    const [gameState, setGameState] = useState<GameState>({
        currentQuestion: 1,
        totalQuestions: QUESTIONS_PER_DIFFICULTY.easy,
        score: 0,
        difficulty: 'easy',
        correctAnswers: 0,
        rounds: [],
    });

    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [questionKey, setQuestionKey] = useState(0);

    const [timeLeft, setTimeLeft] = useState(12);
    const totalTime = 12;
    const [startTime, setStartTime] = useState<number>(Date.now());

    // Fetch question from API
    const fetchQuestion = useCallback(async () => {
        setLoading(true);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(12);
        setStartTime(Date.now());
        setQuestionKey((prev) => prev + 1);

        try {
            const response = await fetch(`/api/game/question?level=${gameState.difficulty}`);
            if (!response.ok) {
                throw new Error('Failed to fetch question');
            }
            const data = await response.json();
            setQuestion(data);
        } catch (error) {
            console.error('Error fetching question:', error);
            setQuestion({
                sentence: 'Error loading question. Please try again.',
                options: [],
                correctLanguageCode: '',
                correctLanguageName: '',
            });
        } finally {
            setLoading(false);
        }
    }, [gameState.difficulty]);

    // Load first question on mount
    useEffect(() => {
        fetchQuestion();
    }, []);

    // Timer countdown
    useEffect(() => {
        if (loading || showResult || gamePhase !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeout();
                    return 12;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, showResult, gamePhase]);

    const handleTimeout = () => {
        if (!question) return;

        const timeTaken = (Date.now() - startTime) / 1000;

        setShowResult(true);
        setIsCorrect(false);

        // Record round
        setGameState((prev) => ({
            ...prev,
            rounds: [
                ...prev.rounds,
                {
                    targetLanguage: question.correctLanguageCode,
                    sentence: question.sentence,
                    userAnswer: '',
                    isCorrect: false,
                    timeTaken,
                },
            ],
        }));

        setTimeout(() => {
            moveToNextQuestion();
        }, 1500);
    };

    const handleAnswerClick = async (languageCode: string) => {
        if (showResult || !question) return;

        const timeTaken = (Date.now() - startTime) / 1000;
        setSelectedAnswer(languageCode);
        setShowResult(true);

        const correct = languageCode === question.correctLanguageCode;
        setIsCorrect(correct);

        // Calculate score based on time left
        const timeBonus = correct ? Math.floor(timeLeft * 10) : 0;
        const baseScore = correct ? 100 : 0;

        setGameState((prev) => ({
            ...prev,
            score: prev.score + baseScore + timeBonus,
            correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
            rounds: [
                ...prev.rounds,
                {
                    targetLanguage: question.correctLanguageCode,
                    sentence: question.sentence,
                    userAnswer: languageCode,
                    isCorrect: correct,
                    timeTaken,
                },
            ],
        }));

        setTimeout(() => {
            moveToNextQuestion();
        }, 1500);
    };

    const moveToNextQuestion = () => {
        if (gameState.currentQuestion >= gameState.totalQuestions) {
            // Game over - show summary
            setGamePhase('summary');
            saveScore();
            return;
        }

        // Transition animation
        setGamePhase('transition');

        setTimeout(() => {
            setGameState((prev) => ({
                ...prev,
                currentQuestion: prev.currentQuestion + 1,
            }));
            setGamePhase('playing');
            fetchQuestion();
        }, 600);
    };

    const saveScore = async () => {
        try {
            await fetch('/api/game/save-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'guest',
                    difficulty: gameState.difficulty,
                    totalScore: gameState.score,
                    questionsCount: gameState.totalQuestions,
                    rounds: gameState.rounds,
                }),
            });
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    const timeColor = timeLeft > 7 ? '#8BC34A' : timeLeft > 3 ? '#FCD34D' : '#EF4444';
    const timePercentage = (timeLeft / totalTime) * 100;
    const accuracy = gameState.rounds.length > 0
        ? Math.round((gameState.correctAnswers / gameState.rounds.length) * 100)
        : 0;

    const Sidebar = useMemo(
        () => (
            <div className="hidden lg:block w-1/5 bg-[#4F6F2F] relative z-0">
                <SidebarBackground />
            </div>
        ),
        []
    );

    const getButtonStyle = (optionCode: string) => {
        if (!showResult) {
            return 'bg-white border-2 border-transparent hover:border-[#8BC34A]';
        }
        if (optionCode === question?.correctLanguageCode) {
            return 'bg-green-100 border-2 border-green-500';
        }
        if (optionCode === selectedAnswer && !isCorrect) {
            return 'bg-red-100 border-2 border-red-500';
        }
        return 'bg-white border-2 border-transparent opacity-50';
    };

    // Summary Screen
    if (gamePhase === 'summary') {
        return (
            <div className="flex min-h-screen overflow-hidden">
                {Sidebar}
                <div className="flex-1 relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-[#f0fdf4] to-[#e8f5e9]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-2xl border-2 border-white/50"
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-center mb-8"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#8BC34A] to-[#4F6F2F] flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#2d3e1b] mb-2">
                                Gra zakończona
                            </h1>
                            <p className="text-[#4F6F2F] text-lg">
                                {accuracy >= 80 ? 'Doskonały wynik!' : accuracy >= 50 ? 'Dobry wynik!' : 'Spróbuj ponownie!'}
                            </p>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
                        >
                            <div className="bg-[#f0fdf4] rounded-2xl p-6 text-center border border-[#8BC34A]/20">
                                <div className="text-4xl font-black text-[#2d3e1b]">{gameState.score}</div>
                                <div className="text-sm text-[#4F6F2F] font-semibold">Punkty</div>
                            </div>
                            <div className="bg-[#f0fdf4] rounded-2xl p-6 text-center border border-[#8BC34A]/20">
                                <div className="text-4xl font-black text-[#2d3e1b]">{accuracy}%</div>
                                <div className="text-sm text-[#4F6F2F] font-semibold">Trafność</div>
                            </div>
                            <div className="bg-[#f0fdf4] rounded-2xl p-6 text-center border border-[#8BC34A]/20 col-span-2 md:col-span-1">
                                <div className="text-4xl font-black text-[#2d3e1b]">
                                    {gameState.correctAnswers}/{gameState.totalQuestions}
                                </div>
                                <div className="text-sm text-[#4F6F2F] font-semibold">Poprawne</div>
                            </div>
                        </motion.div>

                        {/* Accuracy Bar */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                            className="mb-8"
                        >
                            <div className="flex justify-between text-sm text-[#4F6F2F] mb-2 font-semibold">
                                <span>Trafność</span>
                                <span>{accuracy}%</span>
                            </div>
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${accuracy}%` }}
                                    transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${accuracy >= 80
                                        ? 'bg-gradient-to-r from-[#8BC34A] to-[#4CAF50]'
                                        : accuracy >= 50
                                            ? 'bg-gradient-to-r from-[#FCD34D] to-[#F59E0B]'
                                            : 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]'
                                        }`}
                                />
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button
                                onClick={() => {
                                    setGameState({
                                        currentQuestion: 1,
                                        totalQuestions: QUESTIONS_PER_DIFFICULTY.easy,
                                        score: 0,
                                        difficulty: 'easy',
                                        correctAnswers: 0,
                                        rounds: [],
                                    });
                                    setGamePhase('playing');
                                    fetchQuestion();
                                }}
                                variant="primary"
                                fullWidth
                                className="bg-[#2d3e1b] hover:bg-[#1f2a14] py-4 text-lg"
                            >
                                Zagraj ponownie
                            </Button>
                            <Link href="/home" className="block flex-1">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    className="py-4 text-lg border-[#4F6F2F] text-[#4F6F2F]"
                                >
                                    Menu główne
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
                {Sidebar}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen overflow-hidden">
            {Sidebar}

            <div className="flex-1 relative flex flex-col p-4 bg-gradient-to-br from-white via-[#f0fdf4] to-[#e8f5e9]">
                {/* Top Navigation */}
                <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-6 pt-4 relative z-10">
                    <Link
                        href="/home"
                        className="flex items-center gap-2 text-[#4F6F2F] font-bold hover:text-[#2d3e1b] transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/80"
                    >
                        <span>✕</span> Wyjdź
                    </Link>
                    <div className="text-[#2d3e1b] font-bold text-lg bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                        Zdanie {gameState.currentQuestion} / {gameState.totalQuestions}
                    </div>
                </div>

                {/* Main Game Container */}
                <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl mx-auto relative z-10">
                    <AnimatePresence mode="wait">
                        {gamePhase === 'transition' ? (
                            <motion.div
                                key="transition"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                                    className="w-16 h-16 border-4 border-[#8BC34A] border-t-transparent rounded-full"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={questionKey}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="w-full bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-[3rem] p-6 md:p-10 shadow-2xl flex flex-col gap-8"
                            >
                                {/* Stats Bar */}
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="bg-[#f0fdf4] border border-[#8BC34A]/30 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm w-full md:w-auto justify-center">
                                        <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-[#4F6F2F] font-bold uppercase tracking-wider">
                                                Wynik
                                            </span>
                                            <span className="text-xl font-black text-[#2d3e1b]">{gameState.score}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full bg-gray-100 rounded-2xl h-14 relative overflow-hidden shadow-inner border border-gray-200">
                                        <div
                                            className="absolute top-0 left-0 h-full transition-all duration-1000 ease-linear"
                                            style={{
                                                backgroundColor: timeColor,
                                                width: `${timePercentage}%`
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-bold text-[#2d3e1b] text-lg z-10">{timeLeft} s</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Question Display */}
                                <div className="py-10 md:py-16 text-center relative">
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-bold text-[#8BC34A] uppercase tracking-[0.2em] select-none">
                                        Jaki to język?
                                    </span>

                                    {loading ? (
                                        <motion.div
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="text-2xl text-gray-400"
                                        >
                                            Ładowanie...
                                        </motion.div>
                                    ) : (
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="text-4xl md:text-6xl font-black text-[#2d3e1b] leading-tight select-none cursor-default"
                                        >
                                            {question?.sentence}
                                        </motion.h2>
                                    )}
                                </div>

                                {/* Answers Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {question?.options.map((option, index) => (
                                        <motion.button
                                            key={option.code}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={!showResult ? { scale: 1.02 } : {}}
                                            whileTap={!showResult ? { scale: 0.98 } : {}}
                                            onClick={() => handleAnswerClick(option.code)}
                                            disabled={showResult}
                                            className={`group relative ${getButtonStyle(option.code)} rounded-[1.5rem] p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <motion.div
                                                    animate={
                                                        showResult && option.code === question?.correctLanguageCode
                                                            ? { scale: [1, 1.2, 1] }
                                                            : {}
                                                    }
                                                    transition={{ duration: 0.3 }}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showResult && option.code === question?.correctLanguageCode
                                                        ? 'bg-green-500 text-white'
                                                        : showResult && option.code === selectedAnswer && !isCorrect
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-[#e8f5e9] text-[#4F6F2F] group-hover:bg-[#8BC34A] group-hover:text-white'
                                                        }`}
                                                >
                                                    {showResult && option.code === question?.correctLanguageCode ? (
                                                        '✓'
                                                    ) : showResult && option.code === selectedAnswer && !isCorrect ? (
                                                        '✗'
                                                    ) : (
                                                        String.fromCharCode(65 + index)
                                                    )}
                                                </motion.div>
                                                <span className="text-lg md:text-xl font-bold text-[#2d3e1b]">
                                                    {option.nameEn}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {Sidebar}
        </div>
    );
}
