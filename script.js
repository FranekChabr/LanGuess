const fs = require('fs');

const dataTxt = fs.readFileSync('c:\\Users\\Jarek\\Desktop\\dododania.txt', 'utf-8');
const sentencesJsonPath = 'c:\\Users\\Jarek\\LanGuess\\src\\data\\sentences.json';
const sentences = JSON.parse(fs.readFileSync(sentencesJsonPath, 'utf-8'));

// create a map of language codes to their existing properties
const languageMap = {};
sentences.forEach(s => {
    if (!languageMap[s.languageCode]) {
        languageMap[s.languageCode] = {
            languageCode: s.languageCode,
            difficulty: s.difficulty,
            languageFamily: s.languageFamily,
            maxId: 0
        };
    }
    if (s.id > languageMap[s.languageCode].maxId) {
        languageMap[s.languageCode].maxId = s.id;
    }
});

const nameToCode = {
    "Polski": "pl",
    "Rosyjski": "ru",
    "Niemiecki": "de",
    "Francuski": "fr",
    "Angielski": "en",
    "Chiński": "zh",
    "Hiszpański": "es",
    "Portugalski": "pt",
    "Grecki": "el",
    "Turecki": "tr",
    "Włoski": "it",
    "Arabski": "ar",
    "Japoński": "ja",
    "Szwedzki": "sv",
    "Duński": "da",
    "Norweski": "no",
    "Niderlandzki": "nl",
    "Czeski": "cs",
    "Słowacki": "sk",
    "Ukraiński": "uk",
    "Bułgarski": "bg",
    "Rumuński": "ro",
    "Fiński": "fi",
    "Węgierski": "hu",
    "Litewski": "lt",
    "Łotewski": "lv",
    "Koreański": "ko",
    "Wietnamski": "vi",
    "Perski": "fa",
    "Tajski": "th",
    "Filipiński": "tl",
    "Urdu": "ur",
    "Bengalski": "bn",
    "Hindi": "hi",
    "Malajski": "ms",
    "Syngaleski": "si",
    "Indonezyjski": "id",
    "Hebrajski": "he",
    "Gruziński": "ka",
    "Serbski": "sr",
    "Estoński": "et",
    "Białoruski": "be",
    "Turkmeński": "tk",
    "Kirgiski": "ky",
    "Tadżycki": "tg",
    "Uzbecki": "uz",
    "Laotański": "lo",
    "Kazachski": "kk",
    "Birmański": "my",
    "Ormiański": "hy",
    "Nepalski": "ne",
    "Khmerski": "km",
    "Azerski": "az",
    "Islandzki": "is",
    "Luksemburski": "lb",
    "Irlandzki": "ga",
    "Walijski": "cy",
    "Kataloński": "ca",
    "Mongolski": "mn",
    "Romski": "rom",
    "Baskijski": "eu",
    "Albański": "sq",
    "Macedoński": "mk",
    "Bośniacki": "bs",
    "Chorwacki": "hr",
    "Słoweński": "sl"
};

let currentLangCode = null;
const lines = dataTxt.split('\n').map(l => l.trim()).filter(l => l.length > 0);

for (const line of lines) {
    const langMatch = line.match(/^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+) \(/);
    if (langMatch && nameToCode[langMatch[1]]) {
        currentLangCode = nameToCode[langMatch[1]];
    } else if (currentLangCode && languageMap[currentLangCode]) {
        sentences.push({
            id: ++languageMap[currentLangCode].maxId,
            content: line,
            languageCode: currentLangCode,
            difficulty: languageMap[currentLangCode].difficulty,
            languageFamily: languageMap[currentLangCode].languageFamily
        });
    }
}

fs.writeFileSync(sentencesJsonPath, JSON.stringify(sentences, null, 2));
console.log('Done!');
