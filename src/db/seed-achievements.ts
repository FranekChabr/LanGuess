import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from './index';
import { achievements, type NewAchievement } from './schema';

/**
 * Seed data for achievements table.
 * Run with: npx tsx src/db/seed-achievements.ts
 */
const ACHIEVEMENTS_SEED: NewAchievement[] = [
    {
        id: 'first_game',
        name: 'First Steps',
        description: 'Complete your first game',
        xpReward: 50,
    },
    {
        id: 'perfect_game',
        name: 'Perfect!',
        description: 'Get all answers correct in a game with at least 5 questions',
        xpReward: 100,
    },
    {
        id: 'level_5',
        name: 'Rising Star',
        description: 'Reach level 5',
        xpReward: 150,
    },
    {
        id: 'level_10',
        name: 'Language Expert',
        description: 'Reach level 10',
        xpReward: 300,
    },
    {
        id: 'xp_1000',
        name: 'XP Hunter',
        description: 'Earn 1,000 total XP',
        xpReward: 100,
    },
    {
        id: 'xp_5000',
        name: 'XP Master',
        description: 'Earn 5,000 total XP',
        xpReward: 250,
    },
    {
        id: 'games_10',
        name: 'Dedicated Player',
        description: 'Play 10 games',
        xpReward: 75,
    },
    {
        id: 'games_50',
        name: 'Language Addict',
        description: 'Play 50 games',
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
