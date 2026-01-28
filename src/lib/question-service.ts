import { db } from '@/db';
import { sentences, type Difficulty } from '@/db/schema';
import { eq, sql, inArray } from 'drizzle-orm';
import { z } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

export type GameLevel = 'easy' | 'medium' | 'hard' | 'intermediate' | 'expert';

export interface Question {
    sentence: string;
    correctLanguage: string;
}

const N8nResponseSchema = z.object({
    sentence: z.string(),
    correctLanguage: z.string(),
});

// Game level to difficulty mapping
const GAME_LEVEL_DIFFICULTIES: Record<GameLevel, Difficulty[]> = {
    easy: ['easy'],
    medium: ['medium'],
    hard: ['hard'],
    intermediate: ['easy', 'medium'],  // Mix of easy and medium
    expert: ['easy', 'medium', 'hard'], // All difficulties
};

// ============================================================================
// QUESTION SERVICE
// ============================================================================

export class QuestionService {
    // Cache for sentence counts per difficulty (reduces COUNT queries)
    private static sentenceCountCache: Map<Difficulty, { count: number; timestamp: number }> =
        new Map();
    private static CACHE_TTL = 60000; // 1 minute cache

    /**
     * Get a question based on game level (supports mixed difficulties)
     * @param gameLevel - The game level (easy, medium, hard, intermediate, expert)
     * @param excludedLanguages - Array of language codes to exclude
     */
    static async getQuestionByGameLevel(gameLevel: GameLevel, excludedLanguages: string[] = []): Promise<Question> {
        const source = process.env.QUESTION_SOURCE || 'local';
        const difficulties = GAME_LEVEL_DIFFICULTIES[gameLevel];

        if (source === 'n8n') {
            // For n8n, pick a random difficulty from the allowed ones
            const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            return this.fetchFromN8n(randomDifficulty);
        }

        return this.fetchFromLocalMultiDifficulty(difficulties, excludedLanguages);
    }

    /**
     * Get a question based on the configured source (local DB or n8n webhook)
     * @param difficulty - The difficulty level
     * @param excludedLanguages - Array of language codes to exclude (already used in session)
     */
    static async getQuestion(difficulty: Difficulty, excludedLanguages: string[] = []): Promise<Question> {
        const source = process.env.QUESTION_SOURCE || 'local';

        if (source === 'n8n') {
            return this.fetchFromN8n(difficulty);
        }

        return this.fetchFromLocal(difficulty, excludedLanguages);
    }

    /**
     * Fetch a random sentence from local database matching multiple difficulties
     * @param difficulties - Array of difficulty levels to include
     * @param excludedLanguages - Array of language codes to exclude
     */
    private static async fetchFromLocalMultiDifficulty(difficulties: Difficulty[], excludedLanguages: string[] = []): Promise<Question> {
        // Fetch all sentences matching any of the difficulties
        const availableSentences = await db
            .select({
                content: sentences.content,
                languageCode: sentences.languageCode,
            })
            .from(sentences)
            .where(inArray(sentences.difficulty, difficulties));

        if (availableSentences.length === 0) {
            throw new Error(
                `No sentences found for difficulties: ${difficulties.join(', ')}. Please add sentences to the database.`
            );
        }

        // Filter out excluded languages
        let filteredSentences = excludedLanguages.length > 0
            ? availableSentences.filter((s) => !excludedLanguages.includes(s.languageCode))
            : availableSentences;

        // If all languages used, reset and pick from full pool
        if (filteredSentences.length === 0) {
            console.log('All languages used, resetting exclusions');
            filteredSentences = availableSentences;
        }

        // Pick random sentence
        const randomIndex = Math.floor(Math.random() * filteredSentences.length);
        const selected = filteredSentences[randomIndex];

        return {
            sentence: selected.content,
            correctLanguage: selected.languageCode,
        };
    }

    /**
     * Fetch a random sentence from local database matching difficulty
     * Excludes languages that have already been used in the current session
     * @param difficulty - The difficulty level
     * @param excludedLanguages - Array of language codes to exclude
     */
    private static async fetchFromLocal(difficulty: Difficulty, excludedLanguages: string[] = []): Promise<Question> {
        // Build query with exclusions
        let query = db
            .select({
                content: sentences.content,
                languageCode: sentences.languageCode,
            })
            .from(sentences)
            .where(eq(sentences.difficulty, difficulty));

        // If we have excluded languages, filter them out
        if (excludedLanguages.length > 0) {
            const availableSentences = await db
                .select({
                    content: sentences.content,
                    languageCode: sentences.languageCode,
                })
                .from(sentences)
                .where(eq(sentences.difficulty, difficulty));

            // Filter out excluded languages
            const filteredSentences = availableSentences.filter(
                (s) => !excludedLanguages.includes(s.languageCode)
            );

            if (filteredSentences.length === 0) {
                // All languages used - reset and pick any
                console.log('All languages used, resetting exclusions');
                const randomIndex = Math.floor(Math.random() * availableSentences.length);
                const selected = availableSentences[randomIndex];
                
                if (!selected) {
                    throw new Error(`No sentences found for difficulty: ${difficulty}.`);
                }

                return {
                    sentence: selected.content,
                    correctLanguage: selected.languageCode,
                };
            }

            // Pick random from filtered
            const randomIndex = Math.floor(Math.random() * filteredSentences.length);
            const selected = filteredSentences[randomIndex];

            return {
                sentence: selected.content,
                correctLanguage: selected.languageCode,
            };
        }

        // No exclusions - use optimized offset-based selection
        const count = await this.getSentenceCount(difficulty);

        if (count === 0) {
            throw new Error(
                `No sentences found for difficulty: ${difficulty}. Please add sentences to the database.`
            );
        }

        const randomOffset = Math.floor(Math.random() * count);

        const result = await db
            .select({
                content: sentences.content,
                languageCode: sentences.languageCode,
            })
            .from(sentences)
            .where(eq(sentences.difficulty, difficulty))
            .limit(1)
            .offset(randomOffset);

        if (result.length === 0) {
            this.sentenceCountCache.delete(difficulty);
            throw new Error(`No sentences found for difficulty: ${difficulty}.`);
        }

        return {
            sentence: result[0].content,
            correctLanguage: result[0].languageCode,
        };
    }

    /**
     * Get sentence count with caching
     */
    private static async getSentenceCount(difficulty: Difficulty): Promise<number> {
        const cached = this.sentenceCountCache.get(difficulty);
        const now = Date.now();

        if (cached && now - cached.timestamp < this.CACHE_TTL) {
            return cached.count;
        }

        const [result] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(sentences)
            .where(eq(sentences.difficulty, difficulty));

        const count = result?.count ?? 0;
        this.sentenceCountCache.set(difficulty, { count, timestamp: now });

        return count;
    }

    /**
     * Fetch a question from n8n webhook
     */
    private static async fetchFromN8n(difficulty: Difficulty): Promise<Question> {
        const webhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!webhookUrl) {
            throw new Error(
                'N8N_WEBHOOK_URL environment variable is required when QUESTION_SOURCE=n8n'
            );
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level: difficulty }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`n8n webhook returned status ${response.status}`);
            }

            const data = await response.json();
            const parsed = N8nResponseSchema.safeParse(data);

            if (!parsed.success) {
                throw new Error(`Invalid response from n8n webhook`);
            }

            return parsed.data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('n8n webhook request timed out');
            }
            throw error;
        }
    }
}

// Helper function
export async function getQuestion(difficulty: Difficulty): Promise<Question> {
    return QuestionService.getQuestion(difficulty);
}
