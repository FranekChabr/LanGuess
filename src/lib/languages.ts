/**
 * Available languages for the LanGuess game.
 * Used for generating distractors and validating answers.
 */
export const AVAILABLE_LANGUAGES = [
    { code: 'pl', name: 'Polski', nameEn: 'Polish' },
    { code: 'en', name: 'Angielski', nameEn: 'English' },
    { code: 'de', name: 'Niemiecki', nameEn: 'German' },
    { code: 'ja', name: 'Japoński', nameEn: 'Japanese' },
    { code: 'ko', name: 'Koreański', nameEn: 'Korean' },
    { code: 'zh', name: 'Chiński', nameEn: 'Chinese' },
    { code: 'es', name: 'Hiszpański', nameEn: 'Spanish' },
    { code: 'fr', name: 'Francuski', nameEn: 'French' },
    { code: 'it', name: 'Włoski', nameEn: 'Italian' },
    { code: 'pt', name: 'Portugalski', nameEn: 'Portuguese' },
    { code: 'ru', name: 'Rosyjski', nameEn: 'Russian' },
    { code: 'uk', name: 'Ukraiński', nameEn: 'Ukrainian' },
    { code: 'ar', name: 'Arabski', nameEn: 'Arabic' },
    { code: 'hi', name: 'Hindi', nameEn: 'Hindi' },
    { code: 'th', name: 'Tajski', nameEn: 'Thai' },
    { code: 'vi', name: 'Wietnamski', nameEn: 'Vietnamese' },
    { code: 'nl', name: 'Niderlandzki', nameEn: 'Dutch' },
    { code: 'sv', name: 'Szwedzki', nameEn: 'Swedish' },
    { code: 'fi', name: 'Fiński', nameEn: 'Finnish' },
    { code: 'cs', name: 'Czeski', nameEn: 'Czech' },
    { code: 'tr', name: 'Turecki', nameEn: 'Turkish' },
    { code: 'el', name: 'Grecki', nameEn: 'Greek' },
    { code: 'he', name: 'Hebrajski', nameEn: 'Hebrew' },
    { code: 'id', name: 'Indonezyjski', nameEn: 'Indonesian' },
    { code: 'da', name: 'Duński', nameEn: 'Danish' },
    { code: 'no', name: 'Norweski', nameEn: 'Norwegian' },
    { code: 'sk', name: 'Słowacki', nameEn: 'Slovak' },
    { code: 'bg', name: 'Bułgarski', nameEn: 'Bulgarian' },
    { code: 'ro', name: 'Rumuński', nameEn: 'Romanian' },
    { code: 'hu', name: 'Węgierski', nameEn: 'Hungarian' },
    { code: 'lt', name: 'Litewski', nameEn: 'Lithuanian' },
    { code: 'lv', name: 'Łotewski', nameEn: 'Latvian' },
    { code: 'fa', name: 'Perski', nameEn: 'Persian' },
    { code: 'tl', name: 'Filipiński', nameEn: 'Filipino' },
    { code: 'ur', name: 'Urdu', nameEn: 'Urdu' },
    { code: 'bn', name: 'Bengalski', nameEn: 'Bengali' },
    { code: 'ms', name: 'Malajski', nameEn: 'Malay' },
    { code: 'si', name: 'Syngaleski', nameEn: 'Sinhala' },
    { code: 'ka', name: 'Gruziński', nameEn: 'Georgian' },
    { code: 'sr', name: 'Serbski', nameEn: 'Serbian' },
    { code: 'et', name: 'Estonski', nameEn: 'Estonian' },
    { code: 'is', name: 'Islandzki', nameEn: 'Icelandic' },
    { code: 'lb', name: 'Luksemburski', nameEn: 'Luxembourgish' },
    { code: 'ga', name: 'Irlandzki', nameEn: 'Irish' },
    { code: 'cy', name: 'Walijski', nameEn: 'Welsh' },
    { code: 'ca', name: 'Kataloński', nameEn: 'Catalan' },
    { code: 'mn', name: 'Mongolski', nameEn: 'Mongolian' },
    { code: 'rom', name: 'Romski', nameEn: 'Romani' },
    { code: 'eu', name: 'Baskijski', nameEn: 'Basque' },
    { code: 'sq', name: 'Albański', nameEn: 'Albanian' },
    { code: 'bs', name: 'Bośniacki', nameEn: 'Bosnian' },
    { code: 'hr', name: 'Chorwacki', nameEn: 'Croatian' },
    { code: 'sl', name: 'Słoweński', nameEn: 'Slovenian' },
    { code: 'mk', name: 'Macedoński', nameEn: 'Macedonian' },
    { code: 'be', name: 'Białoruski', nameEn: 'Belarusian' },
    { code: 'tk', name: 'Turkmeński', nameEn: 'Turkmen' },
    { code: 'ky', name: 'Kirgiski', nameEn: 'Kyrgyz' },
    { code: 'tg', name: 'Tadżycki', nameEn: 'Tajik' },
    { code: 'uz', name: 'Uzbecki', nameEn: 'Uzbek' },
    { code: 'lo', name: 'Laotański', nameEn: 'Lao' },
    { code: 'kk', name: 'Kazachski', nameEn: 'Kazakh' },
    { code: 'my', name: 'Birmański', nameEn: 'Burmese' },
    { code: 'hy', name: 'Ormiański', nameEn: 'Armenian' },
    { code: 'ne', name: 'Nepalski', nameEn: 'Nepali' },
    { code: 'km', name: 'Khmerski', nameEn: 'Khmer' },
    { code: 'az', name: 'Azerbejdżański', nameEn: 'Azerbaijani' },
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
