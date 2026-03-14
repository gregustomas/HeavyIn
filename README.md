# HeavyIn

**Connect through sweat. Share the grind.**

[heavyin.vercel.app](https://heavy-in.vercel.app)

HeavyIn is a fitness platform for athletes who want to build, share, and discover workout plans. Currently in MVP.

---

## Features

- **Workout Builder** – Create structured training plans with exercises, sets, reps and notes
- **Feed** – Discover workouts from other athletes
- **Profiles** – Public profile with your training history
- **Authentication** – Email/password and Google sign-in
- **Search** – Find athletes by username

---

## Stack

- **Next.js 16** – App Router, server components
- **Firebase** – Auth + Firestore
- **Tailwind CSS v4** + shadcn/ui
- **Zod** – Form validation

---

## Getting Started

```bash
git clone https://github.com/gregustomas/heavyin.git
cd heavyin
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
```

```bash
npm run dev
```

---

> "Don't just lift heavy, be HeavyIn."
