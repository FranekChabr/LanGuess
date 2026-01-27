
import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { name, image } = body;

        // Validation - at least one field must be present
        if (!name && !image) {
            return new NextResponse('Missing fields', { status: 400 });
        }

        // Prepare update object
        const updateData: { name?: string; image?: string } = {};
        if (name && name.trim().length > 0) updateData.name = name.trim();
        if (image && image.trim().length > 0) updateData.image = image.trim();

        // Update database
        await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true, ...updateData });
    } catch (error) {
        console.error('[USER_UPDATE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
