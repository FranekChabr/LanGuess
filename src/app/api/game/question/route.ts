import { NextRequest, NextResponse } from 'next/server';
import { QuestionService } from '@/lib/question-service';
import { generateOptions, getLanguageName } from '@/lib/languages';
import { z } from 'zod';
import type { Difficulty } from '@/db/schema';

// Game levels - these map to difficulty combinations
export type GameLevel = 'easy' | 'medium' | 'hard' | 'intermediate' | 'expert';

// Query params validation - created once, reused
const QuerySchema = z.object({
    level: z.enum(['easy', 'medium', 'hard', 'intermediate', 'expert']).default('easy'),
    excludedLanguages: z.string().optional(), // comma-separated language codes
    excludedSentenceIds: z.string().optional(), // comma-separated ids
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
        const excludedParam = request.nextUrl.searchParams.get('excludedLanguages') || '';
        const excludedIdsParam = request.nextUrl.searchParams.get('excludedSentenceIds') || '';

        // Validate query params
        const parsed = QuerySchema.safeParse({ 
            level: levelParam, 
            excludedLanguages: excludedParam, 
            excludedSentenceIds: excludedIdsParam 
        });
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid parameters.' },
                { status: 400, headers: CACHE_HEADERS }
            );
        }

        const { level, excludedLanguages, excludedSentenceIds } = parsed.data;
        
        // Parse excluded languages into array
        const excludedArray = excludedLanguages 
            ? excludedLanguages.split(',').filter(code => code.trim())
            : [];

        // Parse excluded sentence IDs into array of numbers
        const excludedIdsArray = excludedSentenceIds
            ? excludedSentenceIds.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id))
            : [];

        // Get question from QuestionService (supports mixed difficulty levels)
        const question = await QuestionService.getQuestionByGameLevel(level as GameLevel, excludedArray, excludedIdsArray);

        // Generate 4 options (1 correct + 3 distractors)
        const options = generateOptions(question.correctLanguage, 4, level);

        // Get the Polish name for the correct answer
        const correctLanguageName = getLanguageName(question.correctLanguage);

        return NextResponse.json(
            {
                id: question.id,
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
