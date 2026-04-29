// src/db/seed.ts

import { config } from 'dotenv';
// Load from .env since .env.local might not exist
config({ path: '.env' });
config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { db } from './index';
import { sentences } from './schema';

const jsonPath = path.join(process.cwd(), 'src/data/sentences.json');
const SAMPLE_SENTENCES = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

async function main() {
    console.log('🌱 Rozpoczynam seedowanie...');

    try {
        // Wyczyść tabelę przed dodaniem nowych danych
        await db.delete(sentences);
        console.log('🗑️ Wyczyszczono starą zawartość tabeli sentences');

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
