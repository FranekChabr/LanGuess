import { db } from '@/db';
import { sentences, type Difficulty } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

export interface Question {
    sentence: string;
    correctLanguage: string;
}

const N8nResponseSchema = z.object({
    sentence: z.string(),
    correctLanguage: z.string(),
});

// ============================================================================
// QUESTION SERVICE
// ============================================================================

export class QuestionService {
    // Cache for sentence counts per difficulty (reduces COUNT queries)
    private static sentenceCountCache: Map<Difficulty, { count: number; timestamp: number }> =
        new Map();
    private static CACHE_TTL = 60000; // 1 minute cache

    /**
     * Get a question based on the configured source (local DB or n8n webhook)
     */
    static async getQuestion(difficulty: Difficulty): Promise<Question> {
        const source = process.env.QUESTION_SOURCE || 'local';

        if (source === 'n8n') {
            return this.fetchFromN8n(difficulty);
        }

        return this.fetchFromLocal(difficulty);
    }

    /**
     * Fetch a random sentence from local database matching difficulty
     * Optimized: Uses offset-based random selection instead of ORDER BY RANDOM()
     */
    private static async fetchFromLocal(difficulty: Difficulty): Promise<Question> {
        // Get count (cached)
        const count = await this.getSentenceCount(difficulty);

        if (count === 0) {
            throw new Error(
                `No sentences found for difficulty: ${difficulty}. Please add sentences to the database.`
            );
        }

        // Generate random offset - much faster than ORDER BY RANDOM()
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
            // Fallback: cache might be stale
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
