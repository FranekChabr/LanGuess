import { NextRequest, NextResponse } from 'next/server';
import { fuzzyMatch } from '@/lib/fuzzy-match';
import { getLanguageNameEn } from '@/lib/languages';
import { z } from 'zod';

// Request body validation
const SubmitAnswerSchema = z.object({
    userAnswer: z.string().min(1, 'User answer is required'),
    correctAnswer: z.string().min(1, 'Correct answer is required'),
    mode: z.enum(['normal', 'hard']).default('normal'),
});

/**
 * POST /api/game/submit-answer
 * 
 * Validates user's answer against the correct answer.
 * In 'hard' mode, uses fuzzy matching to allow minor typos.
 * 
 * Request body:
 *   - userAnswer: string (user's typed answer)
 *   - correctAnswer: string (correct language code or name)
 *   - mode: 'normal' | 'hard' (default: 'normal')
 * 
 * Response:
 *   - isCorrect: boolean
 *   - correctAnswer: string (the correct answer for display)
 *   - typoDetected: boolean (true if answer was accepted despite typos)
 *   - distance?: number (Levenshtein distance, only in hard mode)
 *   - similarity?: number (percentage similarity, only in hard mode)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const parsed = SubmitAnswerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { userAnswer, correctAnswer, mode } = parsed.data;

        // Get the English name for the correct answer (in case a code was provided)
        const correctAnswerName = getLanguageNameEn(correctAnswer) || correctAnswer;

        if (mode === 'hard') {
            // Hard mode: use fuzzy matching with Levenshtein distance
            // Tolerance is adaptive based on word length:
            // - Short words (<=5 chars): tolerance 1
            // - Medium words (6-10 chars): tolerance 2
            // - Long words (>10 chars): tolerance 3
            const wordLength = correctAnswerName.length;
            let tolerance: number;

            if (wordLength <= 5) {
                tolerance = 1;
            } else if (wordLength <= 10) {
                tolerance = 2;
            } else {
                tolerance = 3;
            }

            const result = fuzzyMatch(userAnswer, correctAnswerName, tolerance);

            return NextResponse.json({
                isCorrect: result.isMatch,
                correctAnswer: correctAnswerName,
                typoDetected: result.typoDetected,
                distance: result.distance,
                similarity: result.similarity,
            });
        }

        // Normal mode: exact match (case-insensitive)
        const normalizedUser = userAnswer.toLowerCase().trim();
        const normalizedCorrect = correctAnswerName.toLowerCase().trim();
        const isExactMatch = normalizedUser === normalizedCorrect;

        // Also accept the language code as valid answer
        const isCodeMatch = normalizedUser === correctAnswer.toLowerCase();

        return NextResponse.json({
            isCorrect: isExactMatch || isCodeMatch,
            correctAnswer: correctAnswerName,
            typoDetected: false,
        });
    } catch (error) {
        console.error('Error validating answer:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
