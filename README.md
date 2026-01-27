# 🌍 LanGuess

Gra w zgadywanie języków. Dostajesz zdanie - zgadujesz jaki to język.

## Jak odpalić

### 1. Sklonuj repo
```bash
git clone <url-repo>
cd LanGuess
```

### 2. Odpal bazę danych (Docker)
```bash
docker run -d \
  --name languess-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=languess \
  -p 5432:5432 \
  postgres:16
```

### 3. Ustaw zmienne środowiskowe
```bash
cp .env.example .env
```

Plik `.env` powinien mieć:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/languess"
NEXTAUTH_SECRET=jakis-losowy-tekst-12345
NEXTAUTH_URL=http://localhost:3000
QUESTION_SOURCE=local
```

### 4. Zainstaluj zależności
```bash
npm install
```

### 5. Stwórz tabele w bazie
```bash
npx drizzle-kit push
```

### 6. Dodaj przykładowe dane
```bash
npx tsx src/db/seed.ts
npx tsx src/db/seed-achievements.ts ## ten tu skurwysyn achievements nie dziala bo wgl achievementsy n dzialaja jak cos xd! 
```

### 7. Odpal!
```bash
npm run dev
```

Otwórz http://localhost:3000

---

## Struktura

```
src/
├── app/           # Strony (Next.js App Router)
│   ├── login/     # Logowanie/rejestracja
│   ├── home/      # Menu główne
│   ├── game/      # Rozgrywka
│   └── api/       # Endpointy backendu
├── components/    # Komponenty UI
├── db/            # Schemat bazy (Drizzle)
└── lib/           # Helpery
```

## Technologie

- **Next.js 16** - fullstack framework      # muli nwm czemu
- **Drizzle ORM** - dostęp do bazy
- **PostgreSQL** - baza danych
- **NextAuth.js** - autentykacja
- **Tailwind CSS** - stylowanie
### jd kx
