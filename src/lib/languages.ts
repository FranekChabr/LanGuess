/**
 * Available languages for the LanGuess game.
 * Used for generating distractors and validating answers.
 */
export const AVAILABLE_LANGUAGES = [
    { code: 'pl', name: 'Polski', nameEn: 'Polish', family: 'slowianskie', difficulty: 'easy' },
    { code: 'en', name: 'Angielski', nameEn: 'English', family: 'germanskie', difficulty: 'easy' },
    { code: 'de', name: 'Niemiecki', nameEn: 'German', family: 'germanskie', difficulty: 'easy' },
    { code: 'ja', name: 'Japoński', nameEn: 'Japanese', family: 'japońska', difficulty: 'easy' },
    { code: 'ko', name: 'Koreański', nameEn: 'Korean', family: 'koreańska', difficulty: 'medium' },
    { code: 'zh', name: 'Chiński', nameEn: 'Chinese', family: 'sino-tybetański', difficulty: 'easy' },
    { code: 'es', name: 'Hiszpański', nameEn: 'Spanish', family: 'latino', difficulty: 'easy' },
    { code: 'fr', name: 'Francuski', nameEn: 'French', family: 'latino', difficulty: 'easy' },
    { code: 'it', name: 'Włoski', nameEn: 'Italian', family: 'latino', difficulty: 'easy' },
    { code: 'pt', name: 'Portugalski', nameEn: 'Portuguese', family: 'latino', difficulty: 'easy' },
    { code: 'ru', name: 'Rosyjski', nameEn: 'Russian', family: 'slowianskie', difficulty: 'easy' },
    { code: 'uk', name: 'Ukraiński', nameEn: 'Ukrainian', family: 'slowianskie', difficulty: 'medium' },
    { code: 'ar', name: 'Arabski', nameEn: 'Arabic', family: 'semicki', difficulty: 'easy' },
    { code: 'hi', name: 'Hindi', nameEn: 'Hindi', family: 'Indoaryjski', difficulty: 'medium' },
    { code: 'th', name: 'Tajski', nameEn: 'Thai', family: 'tai-kadai', difficulty: 'medium' },
    { code: 'vi', name: 'Wietnamski', nameEn: 'Vietnamese', family: 'austroazjatycki', difficulty: 'medium' },
    { code: 'nl', name: 'Niderlandzki', nameEn: 'Dutch', family: 'germanskie', difficulty: 'medium' },
    { code: 'sv', name: 'Szwedzki', nameEn: 'Swedish', family: 'germanskie', difficulty: 'easy' },
    { code: 'fi', name: 'Fiński', nameEn: 'Finnish', family: 'ugrofinskie', difficulty: 'medium' },
    { code: 'cs', name: 'Czeski', nameEn: 'Czech', family: 'slowianskie', difficulty: 'medium' },
    { code: 'tr', name: 'Turecki', nameEn: 'Turkish', family: 'inne', difficulty: 'easy' },
    { code: 'el', name: 'Grecki', nameEn: 'Greek', family: 'inne', difficulty: 'easy' },
    { code: 'he', name: 'Hebrajski', nameEn: 'Hebrew', family: 'semicki', difficulty: 'medium' },
    { code: 'id', name: 'Indonezyjski', nameEn: 'Indonesian', family: 'austronezyjski', difficulty: 'medium' },
    { code: 'da', name: 'Duński', nameEn: 'Danish', family: 'germanskie', difficulty: 'medium' },
    { code: 'no', name: 'Norweski', nameEn: 'Norwegian', family: 'germanskie', difficulty: 'medium' },
    { code: 'sk', name: 'Słowacki', nameEn: 'Slovak', family: 'slowianskie', difficulty: 'medium' },
    { code: 'bg', name: 'Bułgarski', nameEn: 'Bulgarian', family: 'slowianskie', difficulty: 'medium' },
    { code: 'ro', name: 'Rumuński', nameEn: 'Romanian', family: 'latino', difficulty: 'medium' },
    { code: 'hu', name: 'Węgierski', nameEn: 'Hungarian', family: 'ugrofinskie', difficulty: 'medium' },
    { code: 'lt', name: 'Litewski', nameEn: 'Lithuanian', family: 'baltyckie', difficulty: 'medium' },
    { code: 'lv', name: 'Łotewski', nameEn: 'Latvian', family: 'baltyckie', difficulty: 'medium' },
    { code: 'fa', name: 'Perski', nameEn: 'Persian', family: 'Indoaryjski', difficulty: 'medium' },
    { code: 'tl', name: 'Filipiński', nameEn: 'Filipino', family: 'austronezyjski', difficulty: 'medium' },
    { code: 'ur', name: 'Urdu', nameEn: 'Urdu', family: 'Indoaryjski', difficulty: 'medium' },
    { code: 'bn', name: 'Bengalski', nameEn: 'Bengali', family: 'Indoaryjski', difficulty: 'medium' },
    { code: 'ms', name: 'Malajski', nameEn: 'Malay', family: 'austronezyjski', difficulty: 'medium' },
    { code: 'si', name: 'Syngaleski', nameEn: 'Sinhala', family: 'drawidyjski', difficulty: 'medium' },
    { code: 'ka', name: 'Gruziński', nameEn: 'Georgian', family: 'kartwelska', difficulty: 'medium' },
    { code: 'sr', name: 'Serbski', nameEn: 'Serbian', family: 'slowianskie', difficulty: 'medium' },
    { code: 'et', name: 'Estonski', nameEn: 'Estonian', family: 'ugrofinskie', difficulty: 'medium' },
    { code: 'is', name: 'Islandzki', nameEn: 'Icelandic', family: 'germanskie', difficulty: 'hard' },
    { code: 'lb', name: 'Luksemburski', nameEn: 'Luxembourgish', family: 'germanskie', difficulty: 'hard' },
    { code: 'ga', name: 'Irlandzki', nameEn: 'Irish', family: 'celtycki', difficulty: 'hard' },
    { code: 'cy', name: 'Walijski', nameEn: 'Welsh', family: 'celtycki', difficulty: 'hard' },
    { code: 'ca', name: 'Kataloński', nameEn: 'Catalan', family: 'latino', difficulty: 'hard' },
    { code: 'mn', name: 'Mongolski', nameEn: 'Mongolian', family: 'mongolska', difficulty: 'hard' },
    { code: 'rom', name: 'Romski', nameEn: 'Romani', family: 'inne', difficulty: 'hard' },
    { code: 'eu', name: 'Baskijski', nameEn: 'Basque', family: 'inne', difficulty: 'hard' },
    { code: 'sq', name: 'Albański', nameEn: 'Albanian', family: 'inne', difficulty: 'hard' },
    { code: 'bs', name: 'Bośniacki', nameEn: 'Bosnian', family: 'slowianskie', difficulty: 'hard' },
    { code: 'hr', name: 'Chorwacki', nameEn: 'Croatian', family: 'slowianskie', difficulty: 'hard' },
    { code: 'sl', name: 'Słoweński', nameEn: 'Slovenian', family: 'slowianskie', difficulty: 'hard' },
    { code: 'mk', name: 'Macedoński', nameEn: 'Macedonian', family: 'slowianskie', difficulty: 'hard' },
    { code: 'be', name: 'Białoruski', nameEn: 'Belarusian', family: 'slowianskie', difficulty: 'hard' },
    { code: 'tk', name: 'Turkmeński', nameEn: 'Turkmen', family: 'trukijski', difficulty: 'hard' },
    { code: 'ky', name: 'Kirgiski', nameEn: 'Kyrgyz', family: 'trukijski', difficulty: 'hard' },
    { code: 'tg', name: 'Tadżycki', nameEn: 'Tajik', family: 'Indoaryjski', difficulty: 'hard' },
    { code: 'uz', name: 'Uzbecki', nameEn: 'Uzbek', family: 'trukijski', difficulty: 'hard' },
    { code: 'lo', name: 'Laotański', nameEn: 'Lao', family: 'tai-kadai', difficulty: 'hard' },
    { code: 'kk', name: 'Kazachski', nameEn: 'Kazakh', family: 'trukijski', difficulty: 'hard' },
    { code: 'my', name: 'Birmański', nameEn: 'Burmese', family: 'sino-tybetański', difficulty: 'hard' },
    { code: 'hy', name: 'Ormiański', nameEn: 'Armenian', family: 'inne', difficulty: 'hard' },
    { code: 'ne', name: 'Nepalski', nameEn: 'Nepali', family: 'Indoaryjski', difficulty: 'hard' },
    { code: 'km', name: 'Khmerski', nameEn: 'Khmer', family: 'austroazjatycki', difficulty: 'hard' },
    { code: 'az', name: 'Azerbejdżański', nameEn: 'Azerbaijani', family: 'trukijski', difficulty: 'hard' },
] as const;

export type LanguageCode = (typeof AVAILABLE_LANGUAGES)[number]['code'];

export interface Language {
    code: string;
    name: string;
    nameEn: string;
    family: string;
    difficulty: string;
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
 * @param gameLevel - The current game level (e.g. 'easy', 'intermediate')
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
            family: 'unknown',
            difficulty: 'easy' // default placeholder
        };
        return [...distractors, placeholder].sort(() => Math.random() - 0.5);
    }

    let distractors: Language[] = [];

    if (gameLevel === 'easy') {
        const easyLanguages = AVAILABLE_LANGUAGES.filter(
            (lang) => lang.difficulty === 'easy' && lang.code !== correctLanguageCode
        );
        const shuffledEasy = [...easyLanguages].sort(() => Math.random() - 0.5);
        distractors = shuffledEasy.slice(0, totalOptions - 1);
        
        // Failsafe in case there are not enough easy languages
        if (distractors.length < totalOptions - 1) {
            const fallback = generateDistractors(correctLanguageCode, (totalOptions - 1) - distractors.length);
            distractors = [...distractors, ...fallback];
        }
    } else if (gameLevel === 'intermediate') {
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
