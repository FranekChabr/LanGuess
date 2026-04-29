import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Connection pooling configuration for better performance
// In production, connections are reused instead of creating new ones
const globalForDb = globalThis as unknown as {
    queryClient: ReturnType<typeof postgres> | undefined;
};

// Reuse connection in development to prevent exhausting connections during HMR
const queryClient =
    globalForDb.queryClient ??
    postgres(connectionString, {
        max: 10, // Maximum connections in pool
        idle_timeout: 20, // Close idle connections after 20 seconds
        connect_timeout: 10, // Timeout for new connections
        prepare: false, // Disable prepared statements for edge compatibility
    });

if (process.env.NODE_ENV !== 'production') {
    globalForDb.queryClient = queryClient;
}

export const db = drizzle(queryClient, { schema });

// Export schema for use in other files
export { schema };
