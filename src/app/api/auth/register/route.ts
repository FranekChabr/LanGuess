import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email i hasło są wymagane' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 255) {
            return NextResponse.json(
                { error: 'Email jest zbyt długi (maks. 255 znaków)' },
                { status: 400 }
            );
        }
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Nieprawidłowy format email' },
                { status: 400 }
            );
        }

        // Validate password
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Hasło musi mieć minimum 8 znaków' },
                { status: 400 }
            );
        }
        if (!/[A-Z]/.test(password)) {
            return NextResponse.json(
                { error: 'Hasło musi zawierać co najmniej jedną wielką literę' },
                { status: 400 }
            );
        }
        if (!/\d/.test(password)) {
            return NextResponse.json(
                { error: 'Hasło musi zawierać co najmniej jedną cyfrę' },
                { status: 400 }
            );
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return NextResponse.json(
                { error: 'Hasło musi zawierać co najmniej jeden znak specjalny' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Użytkownik o tym emailu już istnieje' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const [newUser] = await db
            .insert(users)
            .values({
                email,
                name: email.split('@')[0],
                password: hashedPassword,
                totalXp: 0,
                playerLevel: 1,
                gamesPlayed: 0,
            })
            .returning({ id: users.id, email: users.email, name: users.name });

        return NextResponse.json(
            { message: 'Konto utworzone pomyślnie', user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd serwera' },
            { status: 500 }
        );
    }
}
