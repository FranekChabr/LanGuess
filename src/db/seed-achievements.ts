import { config } from 'dotenv';
config({ path: '.env' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { achievements } from './schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const queryClient = postgres(connectionString);
const db = drizzle(queryClient);

interface NewAchievement {
    id: string;
    name: string;
    description: string;
    xpReward: number;
}

/**
 * Seed data for achievements table.
 * Run with: npx tsx src/db/seed-achievements.ts
 */
const ACHIEVEMENTS_SEED: NewAchievement[] = [
    {
        id: 'first_game',
        name: 'Pierwsze kroki',
        description: 'Ukończ swoją pierwszą grę',
        xpReward: 50,
    },
    {
        id: 'perfect_game',
        name: 'Idealnie!',
        description: 'Odpowiedz poprawnie na wszystkie pytania w grze z co najmniej 5 pytaniami',
        xpReward: 100,
    },
    {
        id: 'level_5',
        name: 'Wschodząca gwiazda',
        description: 'Osiągnij 5 poziom',
        xpReward: 150,
    },
    {
        id: 'level_10',
        name: 'Ekspert językowy',
        description: 'Osiągnij 10 poziom',
        xpReward: 300,
    },
    {
        id: 'xp_1000',
        name: 'Łowca PD',
        description: 'Zdobądź 1000 PD',
        xpReward: 100,
    },
    {
        id: 'xp_5000',
        name: 'Mistrz PD',
        description: 'Zdobądź 5000 PD',
        xpReward: 250,
    },
    {
        id: 'games_10',
        name: 'Zapalony gracz',
        description: 'Zagraj w 10 gier',
        xpReward: 75,
    },
    {
        id: 'games_50',
        name: 'Językowy maniak',
        description: 'Zagraj w 50 gier',
        xpReward: 200,
    },
];

async function seedAchievements() {
    console.log('🌱 Seeding achievements...');

    try {
        // Upsert achievements (insert or update on conflict)
        for (const achievement of ACHIEVEMENTS_SEED) {
            await db
                .insert(achievements)
                .values(achievement)
                .onConflictDoUpdate({
                    target: achievements.id,
                    set: {
                        name: achievement.name,
                        description: achievement.description,
                        xpReward: achievement.xpReward,
                    },
                });
            console.log(`  ✅ ${achievement.id}: ${achievement.name}`);
        }

        console.log('\n✨ Achievements seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding achievements:', error);
        process.exit(1);
    }

    process.exit(0);
}

seedAchievements();
