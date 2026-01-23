// src/db/seed.ts

import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from './index';
import { sentences } from './schema';

const SAMPLE_SENTENCES = [
    // EASY
    { content: 'To jest bardzo proste zdanie.', languageCode: 'pl', difficulty: 'easy' },
    { content: 'This is a very simple sentence.', languageCode: 'en', difficulty: 'easy' },
    { content: 'Das ist ein sehr einfacher Satz.', languageCode: 'de', difficulty: 'easy' },
    { content: 'Esta es una frase muy simple.', languageCode: 'es', difficulty: 'easy' },
    { content: 'Cest une phrase très simple.', languageCode: 'fr', difficulty: 'easy' },

    // MEDIUM
    { content: 'Wczoraj poszedłem do sklepu i kupiłem dwa jabłka.', languageCode: 'pl', difficulty: 'medium' },
    { content: 'Yesterday I went to the store and bought two apples.', languageCode: 'en', difficulty: 'medium' },
    { content: 'Gestern bin ich in den Laden gegangen und habe zwei Äpfel gekauft.', languageCode: 'de', difficulty: 'medium' },
    { content: 'Ayer fui a la tienda y compré dos manzanas.', languageCode: 'es', difficulty: 'medium' },

    // HARD
    { content: 'Niespodziewane konsekwencje decyzji geopolitycznych są trudne do przewidzenia.', languageCode: 'pl', difficulty: 'hard' },
    { content: 'The unexpected consequences of geopolitical decisions are difficult to predict.', languageCode: 'en', difficulty: 'hard' },
];

async function main() {
    console.log('🌱 Rozpoczynam seedowanie...');

    try {
        // Opcjonalnie: Wyczyść tabelę przed dodaniem (odkomentuj jeśli chcesz)
        // await db.delete(sentences);

        // Wstaw dane w pętli lub batchu
        for (const sent of SAMPLE_SENTENCES) {
            await db.insert(sentences).values({
                content: sent.content,
                languageCode: sent.languageCode,
                difficulty: sent.difficulty as 'easy' | 'medium' | 'hard',
            });
        }

        console.log('✅ Seedowanie zakończone sukcesem!');
    } catch (err) {
        console.error('❌ Błąd podczas seedowania:', err);
    } finally {
        process.exit(0);
    }
}

main();