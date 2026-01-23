import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// XP thresholds for each level
// Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, etc.
function calculateLevel(totalXp: number): { level: number; currentXp: number; xpForNextLevel: number } {
    const xpThresholds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000];

    let level = 1;
    for (let i = 1; i < xpThresholds.length; i++) {
        if (totalXp >= xpThresholds[i]) {
            level = i + 1;
        } else {
            break;
        }
    }

    const currentLevelXp = xpThresholds[level - 1] || 0;
    const nextLevelXp = xpThresholds[level] || xpThresholds[xpThresholds.length - 1] + 1000;

    return {
        level,
        currentXp: totalXp - currentLevelXp,
        xpForNextLevel: nextLevelXp - currentLevelXp,
    };
}

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const levelInfo = calculateLevel(user.totalXp);

        return NextResponse.json({
            totalXp: user.totalXp,
            level: levelInfo.level,
            currentXp: levelInfo.currentXp,
            xpForNextLevel: levelInfo.xpForNextLevel,
            gamesPlayed: user.gamesPlayed,
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
