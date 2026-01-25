'use client';

import React, { useMemo } from 'react';

// Representative characters from different languages
const CHARACTERS = [
  'A', 'Ø', 'Ñ', '汉', 'あ', '가', 'Ж', 'α', 'ع', 'א', 'अ', 'ก', 'ა', 'Ա',
  'B', 'Å', 'Ç', '字', 'い', '나', 'Д', 'β', 'ב', 'आ', 'ბ', 'Բ', 'Ö', 'ß',
  'C', 'Ä', '爱', 'う', '다', 'И', 'γ', 'ג', 'イ', 'გ', 'Գ', 'Æ', 'Þ', 'Ł',
  'D', 'É', '語', 'え', '라', 'П', 'δ', 'ד', 'ウ', 'დ', 'Դ', 'Ø', 'Ð', 'Ś',
];

// Seeded random for consistent rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Shuffle array using Fisher-Yates with seeded random
function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface FloatingChar {
  char: string;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

function generateFloatingChars(cols: number, rows: number, seed: number): FloatingChar[] {
  const chars: FloatingChar[] = [];
  const count = cols * rows;

  // Shuffle characters and pick unique ones (no repeats)
  const shuffledChars = shuffleArray(CHARACTERS, seed);

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    // Evenly spaced grid
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;

    chars.push({
      // Use unique character from shuffled array (wraps if needed)
      char: shuffledChars[i % shuffledChars.length],
      x: col * cellWidth + cellWidth / 2,
      y: row * cellHeight + cellHeight / 2,
      rotation: Math.floor(seededRandom(seed + i * 7) * 30 - 15),
      // Negative delay makes animation start mid-cycle (no jump on load)
      delay: -(seededRandom(seed + i * 13) * 4),
    });
  }

  return chars;
}

export function SidebarBackground() {
  // 3 columns × 10 rows = 30 evenly distributed characters
  const chars = useMemo(() => generateFloatingChars(3, 10, 42), []);

  return (
    <>
      <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(var(--rotation)); }
                    50% { transform: translateY(-18px) rotate(var(--rotation)); }
                }
                .floating-char {
                    animation: float 4s ease-in-out infinite;
                    animation-delay: var(--delay);
                }
            `}</style>
      <div className="absolute inset-0 overflow-hidden bg-transparent z-0 pointer-events-none select-none">
        {chars.map((item, i) => (
          <span
            key={i}
            className="floating-char absolute text-white/25 font-bold text-2xl"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              '--rotation': `${item.rotation}deg`,
              '--delay': `${item.delay}s`,
            } as React.CSSProperties}
          >
            {item.char}
          </span>
        ))}
      </div>
    </>
  );
}
