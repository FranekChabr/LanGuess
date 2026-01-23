import levenshtein from 'fast-levenshtein';

export interface FuzzyMatchResult {
    isMatch: boolean;
    typoDetected: boolean;
    distance: number;
    similarity: number;
}

/**
 * Perform fuzzy matching between user input and target answer.
 * Uses Levenshtein distance for typo tolerance.
 *
 * @param input - User's input string
 * @param target - Correct answer string
 * @param tolerance - Maximum allowed character distance (default 2)
 * @returns FuzzyMatchResult with match status and details
 */
export function fuzzyMatch(
    input: string,
    target: string,
    tolerance: number = 2
): FuzzyMatchResult {
    const normalizedInput = input.toLowerCase().trim();
    const normalizedTarget = target.toLowerCase().trim();

    // Calculate Levenshtein distance
    const distance = levenshtein.get(normalizedInput, normalizedTarget);

    // Calculate similarity percentage
    const maxLength = Math.max(normalizedInput.length, normalizedTarget.length);
    const similarity = maxLength === 0 ? 100 : ((maxLength - distance) / maxLength) * 100;

    // Determine if it's a match (within tolerance)
    const isMatch = distance <= tolerance;

    // Typo detected if there's some distance but still within tolerance
    const typoDetected = distance > 0 && distance <= tolerance;

    return {
        isMatch,
        typoDetected,
        distance,
        similarity: Math.round(similarity * 100) / 100, // Round to 2 decimal places
    };
}

/**
 * Check if input matches target with percentage-based similarity threshold.
 *
 * @param input - User's input string
 * @param target - Correct answer string
 * @param minSimilarity - Minimum similarity percentage (default 85)
 * @returns FuzzyMatchResult
 */
export function fuzzyMatchByPercentage(
    input: string,
    target: string,
    minSimilarity: number = 85
): FuzzyMatchResult {
    const normalizedInput = input.toLowerCase().trim();
    const normalizedTarget = target.toLowerCase().trim();

    const distance = levenshtein.get(normalizedInput, normalizedTarget);
    const maxLength = Math.max(normalizedInput.length, normalizedTarget.length);
    const similarity = maxLength === 0 ? 100 : ((maxLength - distance) / maxLength) * 100;

    const isMatch = similarity >= minSimilarity;
    const typoDetected = similarity < 100 && similarity >= minSimilarity;

    return {
        isMatch,
        typoDetected,
        distance,
        similarity: Math.round(similarity * 100) / 100,
    };
}
