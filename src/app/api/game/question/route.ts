import { NextRequest, NextResponse } from 'next/server';
import { QuestionService } from '@/lib/question-service';
import { generateOptions, getLanguageNameEn } from '@/lib/languages';
import { z } from 'zod';
import type { Difficulty } from '@/db/schema';

// Query params validation - created once, reused
const QuerySchema = z.object({
    level: z.enum(['easy', 'medium', 'hard']).default('easy'),
});

// Response headers for caching
const CACHE_HEADERS = {
    'Cache-Control': 'no-store, max-age=0', // No cache for random questions
};

/**
 * GET /api/game/question
 *
 * Fetches a question (sentence) and returns it with 4 language options.
 */
export async function GET(request: NextRequest) {
    try {
        const levelParam = request.nextUrl.searchParams.get('level') || 'easy';

        // Validate query params
        const parsed = QuerySchema.safeParse({ level: levelParam });
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid level parameter. Must be: easy, medium, or hard.' },
                { status: 400, headers: CACHE_HEADERS }
            );
        }

        const { level } = parsed.data;

        // Get question from QuestionService
        const question = await QuestionService.getQuestion(level as Difficulty);

        // Generate 4 options (1 correct + 3 distractors)
        const options = generateOptions(question.correctLanguage, 4);

        // Get the English name for the correct answer
        const correctLanguageName = getLanguageNameEn(question.correctLanguage);

        return NextResponse.json(
            {
                sentence: question.sentence,
                options: options.map((opt) => ({
                    code: opt.code,
                    name: opt.name,
                    nameEn: opt.nameEn,
                })),
                correctLanguageCode: question.correctLanguage,
                correctLanguageName,
            },
            { headers: CACHE_HEADERS }
        );
    } catch (error) {
        console.error('Error fetching question:', error);

        const errorMessage =
            error instanceof Error ? error.message : 'An unexpected error occurred';
        const status = errorMessage.includes('No sentences found') ? 404 : 500;

        return NextResponse.json(
            { error: errorMessage },
            { status, headers: CACHE_HEADERS }
        );
    }
}
