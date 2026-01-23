import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'LanGuess - Language Guessing Game',
    description: 'Test your language recognition skills! Guess the language of sentences from around the world.',
    keywords: ['language', 'game', 'quiz', 'learning', 'polyglot'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen w-full font-sans text-gray-900 antialiased" suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
