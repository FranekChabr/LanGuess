/**
 * Available languages for the LanGuess game.
 * Used for generating distractors and validating answers.
 */
export const AVAILABLE_LANGUAGES = [
    { code: 'pl', name: 'Polski', nameEn: 'Polish' },
    { code: 'en', name: 'English', nameEn: 'English' },
    { code: 'de', name: 'Deutsch', nameEn: 'German' },
    { code: 'ja', name: '日本語', nameEn: 'Japanese' },
    { code: 'ko', name: '한국어', nameEn: 'Korean' },
    { code: 'zh', name: '中文', nameEn: 'Chinese' },
    { code: 'es', name: 'Español', nameEn: 'Spanish' },
    { code: 'fr', name: 'Français', nameEn: 'French' },
    { code: 'it', name: 'Italiano', nameEn: 'Italian' },
    { code: 'pt', name: 'Português', nameEn: 'Portuguese' },
    { code: 'ru', name: 'Русский', nameEn: 'Russian' },
    { code: 'uk', name: 'Українська', nameEn: 'Ukrainian' },
    { code: 'ar', name: 'العربية', nameEn: 'Arabic' },
    { code: 'hi', name: 'हिन्दी', nameEn: 'Hindi' },
    { code: 'th', name: 'ไทย', nameEn: 'Thai' },
    { code: 'vi', name: 'Tiếng Việt', nameEn: 'Vietnamese' },
    { code: 'nl', name: 'Nederlands', nameEn: 'Dutch' },
    { code: 'sv', name: 'Svenska', nameEn: 'Swedish' },
    { code: 'fi', name: 'Suomi', nameEn: 'Finnish' },
    { code: 'cs', name: 'Čeština', nameEn: 'Czech' },
    { code: 'tr', name: 'Türkçe', nameEn: 'Turkish' },
    { code: 'el', name: 'Ελληνικά', nameEn: 'Greek' },
    { code: 'he', name: 'עברית', nameEn: 'Hebrew' },
    { code: 'id', name: 'Bahasa Indonesia', nameEn: 'Indonesian' },
] as const;

export type LanguageCode = (typeof AVAILABLE_LANGUAGES)[number]['code'];

export interface Language {
    code: string;
    name: string;
    nameEn: string;
}

/**
 * Get language info by code
 */
export function getLanguageByCode(code: string): Language | undefined {
    return AVAILABLE_LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Get language name (in English) by code
 */
export function getLanguageNameEn(code: string): string {
    const lang = getLanguageByCode(code);
    return lang?.nameEn ?? code;
}

/**
 * Generate random distractors (incorrect language options)
 * @param correctLanguageCode - The correct language code to exclude
 * @param count - Number of distractors to generate (default 3)
 * @returns Array of language objects (distractors only, not including correct answer)
 */
export function generateDistractors(
    correctLanguageCode: string,
    count: number = 3
): Language[] {
    // Filter out the correct language
    const otherLanguages = AVAILABLE_LANGUAGES.filter(
        (lang) => lang.code !== correctLanguageCode
    );

    // Shuffle and take the required count
    const shuffled = [...otherLanguages].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
}

/**
 * Generate all options (correct + distractors) in random order
 * @param correctLanguageCode - The correct language code
 * @param totalOptions - Total number of options (default 4)
 * @returns Array of language objects in random order
 */
export function generateOptions(
    correctLanguageCode: string,
    totalOptions: number = 4
): Language[] {
    const correctLanguage = getLanguageByCode(correctLanguageCode);

    if (!correctLanguage) {
        // If correct language not found in our list, create a placeholder
        const distractors = generateDistractors(correctLanguageCode, totalOptions - 1);
        const placeholder: Language = {
            code: correctLanguageCode,
            name: correctLanguageCode,
            nameEn: correctLanguageCode,
        };
        return [...distractors, placeholder].sort(() => Math.random() - 0.5);
    }

    const distractors = generateDistractors(correctLanguageCode, totalOptions - 1);

    // Combine correct answer with distractors and shuffle
    return [correctLanguage, ...distractors].sort(() => Math.random() - 0.5);
}
