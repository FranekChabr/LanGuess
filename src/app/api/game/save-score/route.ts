import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
    users,
    gameSessions,
    gameRounds,
    userAchievements,
    achievements,
    type NewGameSession,
    type NewGameRound,
} from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

// Round schema for validation
const RoundSchema = z.object({
    targetLanguage: z.string(),
    sentence: z.string(),
    userAnswer: z.string().optional(),
    isCorrect: z.boolean().optional(),
    timeTaken: z.number().optional(),
});

// Request body validation
const SaveScoreSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    totalScore: z.number().min(0),
    questionsCount: z.number().min(1),
    rounds: z.array(RoundSchema).optional(),
});

// Achievement conditions configuration
interface AchievementCondition {
    id: string;
    check: (stats: UserStats) => boolean;
}

interface UserStats {
    gamesPlayed: number;
    totalXp: number;
    playerLevel: number;
    currentScore: number;
    correctAnswers: number;
    totalQuestions: number;
}

// Define achievement conditions
const ACHIEVEMENT_CONDITIONS: AchievementCondition[] = [
    {
        id: 'first_game',
        check: (stats) => stats.gamesPlayed === 1,
    },
    {
        id: 'perfect_game',
        check: (stats) => stats.correctAnswers === stats.totalQuestions && stats.totalQuestions >= 5,
    },
    {
        id: 'level_5',
        check: (stats) => stats.playerLevel >= 5,
    },
    {
        id: 'level_10',
        check: (stats) => stats.playerLevel >= 10,
    },
    {
        id: 'xp_1000',
        check: (stats) => stats.totalXp >= 1000,
    },
    {
        id: 'xp_5000',
        check: (stats) => stats.totalXp >= 5000,
    },
    {
        id: 'games_10',
        check: (stats) => stats.gamesPlayed >= 10,
    },
    {
        id: 'games_50',
        check: (stats) => stats.gamesPlayed >= 50,
    },
];

/**
 * Calculate player level based on total XP
 * Level formula: level = floor(sqrt(totalXp / 100)) + 1
 */
function calculateLevel(totalXp: number): number {
    return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

/**
 * POST /api/game/save-score
 * 
 * Saves game session and updates user stats.
 * Uses a transaction for data consistency.
 * 
 * Request body:
 *   - userId: string
 *   - difficulty: 'easy' | 'medium' | 'hard'
 *   - totalScore: number (XP earned this game)
 *   - questionsCount: number
 *   - rounds: array of round data (optional)
 * 
 * Response:
 *   - success: boolean
 *   - gameSessionId: string
 *   - newAchievements: string[] (IDs of newly unlocked achievements)
 *   - updatedStats: { totalXp, playerLevel, gamesPlayed }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const parsed = SaveScoreSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { userId, difficulty, totalScore, questionsCount, rounds } = parsed.data;

        // Calculate correct answers from rounds
        const correctAnswers = rounds?.filter((r) => r.isCorrect).length ?? 0;

        // Use transaction for all database operations
        const result = await db.transaction(async (tx) => {
            // 1. Create game session
            const sessionData: NewGameSession = {
                userId,
                difficulty,
                totalScore,
                questionsCount,
            };

            const [newSession] = await tx
                .insert(gameSessions)
                .values(sessionData)
                .returning();

            // 2. Insert rounds if provided
            if (rounds && rounds.length > 0) {
                const roundsData: NewGameRound[] = rounds.map((round) => ({
                    gameId: newSession.id,
                    targetLanguage: round.targetLanguage,
                    sentence: round.sentence,
                    userAnswer: round.userAnswer ?? null,
                    isCorrect: round.isCorrect ?? null,
                    timeTaken: round.timeTaken ?? null,
                }));

                await tx.insert(gameRounds).values(roundsData);
            }

            // 3. Get current user stats
            const [currentUser] = await tx
                .select({
                    totalXp: users.totalXp,
                    gamesPlayed: users.gamesPlayed,
                    playerLevel: users.playerLevel,
                })
                .from(users)
                .where(eq(users.id, userId));

            if (!currentUser) {
                throw new Error('User not found');
            }

            // 4. Calculate new stats
            const newTotalXp = currentUser.totalXp + totalScore;
            const newGamesPlayed = currentUser.gamesPlayed + 1;
            const newPlayerLevel = calculateLevel(newTotalXp);

            // 5. Update user stats
            await tx
                .update(users)
                .set({
                    totalXp: newTotalXp,
                    gamesPlayed: newGamesPlayed,
                    playerLevel: newPlayerLevel,
                })
                .where(eq(users.id, userId));

            // 6. Check and unlock achievements
            const userStats: UserStats = {
                gamesPlayed: newGamesPlayed,
                totalXp: newTotalXp,
                playerLevel: newPlayerLevel,
                currentScore: totalScore,
                correctAnswers,
                totalQuestions: questionsCount,
            };

            // Get user's existing achievements
            const existingAchievements = await tx
                .select({ achievementId: userAchievements.achievementId })
                .from(userAchievements)
                .where(eq(userAchievements.userId, userId));

            const existingIds = new Set(existingAchievements.map((a) => a.achievementId));

            // Check which achievements should be unlocked
            const newlyUnlocked: string[] = [];

            for (const condition of ACHIEVEMENT_CONDITIONS) {
                if (!existingIds.has(condition.id) && condition.check(userStats)) {
                    // Verify the achievement exists in the database
                    const [achievement] = await tx
                        .select({ id: achievements.id, xpReward: achievements.xpReward })
                        .from(achievements)
                        .where(eq(achievements.id, condition.id));

                    if (achievement) {
                        // Unlock the achievement
                        await tx.insert(userAchievements).values({
                            userId,
                            achievementId: condition.id,
                        });

                        // Add XP reward if any
                        if (achievement.xpReward > 0) {
                            await tx
                                .update(users)
                                .set({
                                    totalXp: sql`${users.totalXp} + ${achievement.xpReward}`,
                                })
                                .where(eq(users.id, userId));
                        }

                        newlyUnlocked.push(condition.id);
                    }
                }
            }

            return {
                gameSessionId: newSession.id,
                newAchievements: newlyUnlocked,
                updatedStats: {
                    totalXp: newTotalXp,
                    playerLevel: newPlayerLevel,
                    gamesPlayed: newGamesPlayed,
                },
            };
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Error saving score:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        if (error instanceof Error && error.message === 'User not found') {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred while saving score' },
            { status: 500 }
        );
    }
}
