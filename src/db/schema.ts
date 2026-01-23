import {
    pgTable,
    text,
    timestamp,
    integer,
    boolean,
    real,
    uuid,
    serial,
    primaryKey,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';

// ============================================================================
// ENUMS
// ============================================================================

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);

// ============================================================================
// NEXTAUTH TABLES
// ============================================================================

export const users = pgTable('users', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique().notNull(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    image: text('image'),
    password: text('password'), // hashed password for credentials auth
    // Game fields extension
    totalXp: integer('total_xp').default(0).notNull(),
    playerLevel: integer('player_level').default(1).notNull(),
    gamesPlayed: integer('games_played').default(0).notNull(),
});

export const accounts = pgTable(
    'accounts',
    {
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccountType>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('provider_account_id').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable('sessions', {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
    'verification_tokens',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);

// ============================================================================
// GAME LOGIC TABLES
// ============================================================================

export const gameSessions = pgTable('game_sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    difficulty: text('difficulty').notNull(), // 'easy' | 'medium' | 'hard'
    totalScore: integer('total_score').notNull(),
    questionsCount: integer('questions_count').notNull(),
    finishedAt: timestamp('finished_at', { mode: 'date' }).defaultNow(),
});

export const gameRounds = pgTable('game_rounds', {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
        .notNull()
        .references(() => gameSessions.id, { onDelete: 'cascade' }),
    targetLanguage: text('target_language').notNull(),
    sentence: text('sentence').notNull(),
    userAnswer: text('user_answer'),
    isCorrect: boolean('is_correct'),
    timeTaken: real('time_taken'), // in seconds (float)
});

export const achievements = pgTable('achievements', {
    id: text('id').primaryKey(), // slug: 'first_win', 'polyglot_10', etc.
    name: text('name').notNull(),
    description: text('description'),
    xpReward: integer('xp_reward').default(0).notNull(),
});

export const userAchievements = pgTable(
    'user_achievements',
    {
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        achievementId: text('achievement_id')
            .notNull()
            .references(() => achievements.id, { onDelete: 'cascade' }),
        unlockedAt: timestamp('unlocked_at', { mode: 'date' }).defaultNow(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.achievementId] }),
    })
);

export const sentences = pgTable('sentences', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    languageCode: text('language_code').notNull(),
    difficulty: difficultyEnum('difficulty').notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    gameSessions: many(gameSessions),
    userAchievements: many(userAchievements),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one, many }) => ({
    user: one(users, {
        fields: [gameSessions.userId],
        references: [users.id],
    }),
    rounds: many(gameRounds),
}));

export const gameRoundsRelations = relations(gameRounds, ({ one }) => ({
    gameSession: one(gameSessions, {
        fields: [gameRounds.gameId],
        references: [gameSessions.id],
    }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
    userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
    user: one(users, {
        fields: [userAchievements.userId],
        references: [users.id],
    }),
    achievement: one(achievements, {
        fields: [userAchievements.achievementId],
        references: [achievements.id],
    }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type GameSession = typeof gameSessions.$inferSelect;
export type NewGameSession = typeof gameSessions.$inferInsert;

export type GameRound = typeof gameRounds.$inferSelect;
export type NewGameRound = typeof gameRounds.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;

export type Sentence = typeof sentences.$inferSelect;
export type NewSentence = typeof sentences.$inferInsert;

export type Difficulty = 'easy' | 'medium' | 'hard';
