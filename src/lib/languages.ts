/**
 * Available languages for the LanGuess game.
 * Used for generating distractors and validating answers.
 */
export const AVAILABLE_LANGUAGES = [
    { code: 'pl', name: 'Polski', nameEn: 'Polish', family: 'slowianskie' },
    { code: 'en', name: 'Angielski', nameEn: 'English', family: 'germanskie' },
    { code: 'de', name: 'Niemiecki', nameEn: 'German', family: 'germanskie' },
    { code: 'ja', name: 'Japoński', nameEn: 'Japanese', family: 'japońska' },
    { code: 'ko', name: 'Koreański', nameEn: 'Korean', family: 'koreańska' },
    { code: 'zh', name: 'Chiński', nameEn: 'Chinese', family: 'sino-tybetański' },
    { code: 'es', name: 'Hiszpański', nameEn: 'Spanish', family: 'latino' },
    { code: 'fr', name: 'Francuski', nameEn: 'French', family: 'latino' },
    { code: 'it', name: 'Włoski', nameEn: 'Italian', family: 'latino' },
    { code: 'pt', name: 'Portugalski', nameEn: 'Portuguese', family: 'latino' },
    { code: 'ru', name: 'Rosyjski', nameEn: 'Russian', family: 'slowianskie' },
    { code: 'uk', name: 'Ukraiński', nameEn: 'Ukrainian', family: 'slowianskie' },
    { code: 'ar', name: 'Arabski', nameEn: 'Arabic', family: 'semicki' },
    { code: 'hi', name: 'Hindi', nameEn: 'Hindi', family: 'Indoaryjski' },
    { code: 'th', name: 'Tajski', nameEn: 'Thai', family: 'tai-kadai' },
    { code: 'vi', name: 'Wietnamski', nameEn: 'Vietnamese', family: 'austroazjatycki' },
    { code: 'nl', name: 'Niderlandzki', nameEn: 'Dutch', family: 'germanskie' },
    { code: 'sv', name: 'Szwedzki', nameEn: 'Swedish', family: 'germanskie' },
    { code: 'fi', name: 'Fiński', nameEn: 'Finnish', family: 'ugrofinskie' },
    { code: 'cs', name: 'Czeski', nameEn: 'Czech', family: 'slowianskie' },
    { code: 'tr', name: 'Turecki', nameEn: 'Turkish', family: 'inne' },
    { code: 'el', name: 'Grecki', nameEn: 'Greek', family: 'inne' },
    { code: 'he', name: 'Hebrajski', nameEn: 'Hebrew', family: 'semicki' },
    { code: 'id', name: 'Indonezyjski', nameEn: 'Indonesian', family: 'austronezyjski' },
    { code: 'da', name: 'Duński', nameEn: 'Danish', family: 'germanskie' },
    { code: 'no', name: 'Norweski', nameEn: 'Norwegian', family: 'germanskie' },
    { code: 'sk', name: 'Słowacki', nameEn: 'Slovak', family: 'slowianskie' },
    { code: 'bg', name: 'Bułgarski', nameEn: 'Bulgarian', family: 'slowianskie' },
    { code: 'ro', name: 'Rumuński', nameEn: 'Romanian', family: 'latino' },
    { code: 'hu', name: 'Węgierski', nameEn: 'Hungarian', family: 'ugrofinskie' },
    { code: 'lt', name: 'Litewski', nameEn: 'Lithuanian', family: 'baltyckie' },
    { code: 'lv', name: 'Łotewski', nameEn: 'Latvian', family: 'baltyckie' },
    { code: 'fa', name: 'Perski', nameEn: 'Persian', family: 'Indoaryjski' },
    { code: 'tl', name: 'Filipiński', nameEn: 'Filipino', family: 'austronezyjski' },
    { code: 'ur', name: 'Urdu', nameEn: 'Urdu', family: 'Indoaryjski' },
    { code: 'bn', name: 'Bengalski', nameEn: 'Bengali', family: 'Indoaryjski' },
    { code: 'ms', name: 'Malajski', nameEn: 'Malay', family: 'austronezyjski' },
    { code: 'si', name: 'Syngaleski', nameEn: 'Sinhala', family: 'drawidyjski' },
    { code: 'ka', name: 'Gruziński', nameEn: 'Georgian', family: 'kartwelska' },
    { code: 'sr', name: 'Serbski', nameEn: 'Serbian', family: 'slowianskie' },
    { code: 'et', name: 'Estonski', nameEn: 'Estonian', family: 'ugrofinskie' },
    { code: 'is', name: 'Islandzki', nameEn: 'Icelandic', family: 'germanskie' },
    { code: 'lb', name: 'Luksemburski', nameEn: 'Luxembourgish', family: 'germanskie' },
    { code: 'ga', name: 'Irlandzki', nameEn: 'Irish', family: 'celtycki' },
    { code: 'cy', name: 'Walijski', nameEn: 'Welsh', family: 'celtycki' },
    { code: 'ca', name: 'Kataloński', nameEn: 'Catalan', family: 'latino' },
    { code: 'mn', name: 'Mongolski', nameEn: 'Mongolian', family: 'mongolska' },
    { code: 'rom', name: 'Romski', nameEn: 'Romani', family: 'inne' },
    { code: 'eu', name: 'Baskijski', nameEn: 'Basque', family: 'inne' },
    { code: 'sq', name: 'Albański', nameEn: 'Albanian', family: 'inne' },
    { code: 'bs', name: 'Bośniacki', nameEn: 'Bosnian', family: 'slowianskie' },
    { code: 'hr', name: 'Chorwacki', nameEn: 'Croatian', family: 'slowianskie' },
    { code: 'sl', name: 'Słoweński', nameEn: 'Slovenian', family: 'slowianskie' },
    { code: 'mk', name: 'Macedoński', nameEn: 'Macedonian', family: 'slowianskie' },
    { code: 'be', name: 'Białoruski', nameEn: 'Belarusian', family: 'slowianskie' },
    { code: 'tk', name: 'Turkmeński', nameEn: 'Turkmen', family: 'trukijski' },
    { code: 'ky', name: 'Kirgiski', nameEn: 'Kyrgyz', family: 'trukijski' },
    { code: 'tg', name: 'Tadżycki', nameEn: 'Tajik', family: 'Indoaryjski' },
    { code: 'uz', name: 'Uzbecki', nameEn: 'Uzbek', family: 'trukijski' },
    { code: 'lo', name: 'Laotański', nameEn: 'Lao', family: 'tai-kadai' },
    { code: 'kk', name: 'Kazachski', nameEn: 'Kazakh', family: 'trukijski' },
    { code: 'my', name: 'Birmański', nameEn: 'Burmese', family: 'sino-tybetański' },
    { code: 'hy', name: 'Ormiański', nameEn: 'Armenian', family: 'inne' },
    { code: 'ne', name: 'Nepalski', nameEn: 'Nepali', family: 'Indoaryjski' },
    { code: 'km', name: 'Khmerski', nameEn: 'Khmer', family: 'austroazjatycki' },
    { code: 'az', name: 'Azerbejdżański', nameEn: 'Azerbaijani', family: 'trukijski' },
] as const;

export type LanguageCode = (typeof AVAILABLE_LANGUAGES)[number]['code'];

export interface Language {
    code: string;
    name: string;
    nameEn: string;
    family: string;
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
 * Get language name (in Polish) by code
 */
export function getLanguageName(code: string): string {
    const lang = getLanguageByCode(code);
    return lang?.name ?? code;
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
 * @param gameLevel - The current game level (e.g. 'intermediate')
 * @returns Array of language objects in random order
 */
export function generateOptions(
    correctLanguageCode: string,
    totalOptions: number = 4,
    gameLevel?: string
): Language[] {
    const correctLanguage = getLanguageByCode(correctLanguageCode);

    if (!correctLanguage) {
        // If correct language not found in our list, create a placeholder
        const distractors = generateDistractors(correctLanguageCode, totalOptions - 1);
        const placeholder: Language = {
            code: correctLanguageCode,
            name: correctLanguageCode,
            nameEn: correctLanguageCode,
            family: 'unknown'
        };
        return [...distractors, placeholder].sort(() => Math.random() - 0.5);
    }

    let distractors: Language[] = [];

    if (gameLevel === 'intermediate') {
        const familyLanguages = AVAILABLE_LANGUAGES.filter(
            (lang) => lang.family === correctLanguage.family && lang.code !== correctLanguageCode
        );
        const otherFamilyLanguages = AVAILABLE_LANGUAGES.filter(
            (lang) => lang.family !== correctLanguage.family && lang.code !== correctLanguageCode
        );

        // Wybieramy max 2 języki z tej samej rodziny (jeśli są)
        const shuffledFamily = [...familyLanguages].sort(() => Math.random() - 0.5);
        const familyDistractors = shuffledFamily.slice(0, 2);

        // Uzupełniamy pozostałe miejsce dobierając języki z innej rodziny
        const remainingSpots = totalOptions - 1 - familyDistractors.length;
        const shuffledOthers = [...otherFamilyLanguages].sort(() => Math.random() - 0.5);
        const otherDistractors = shuffledOthers.slice(0, remainingSpots);

        distractors = [...familyDistractors, ...otherDistractors];
    } else {
        distractors = generateDistractors(correctLanguageCode, totalOptions - 1);
    }

    // Combine correct answer with distractors and shuffle
    return [correctLanguage, ...distractors].sort(() => Math.random() - 0.5);
}
