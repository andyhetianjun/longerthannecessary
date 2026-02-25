# URL Elongator™

Why shorten links when you can make them **unreasonably long**?

A Next.js app that takes any URL and turns it into an absurdly long redirect link — because sometimes you just want to make someone's day slightly worse.

## How It Works

Paste a URL, pick a severity mode, and get back a deeply nested redirect link that resolves back to the original destination.

### Modes

| Mode | Path Segments | Approx. URL Length |
|------|--------------|-------------------|
| Mildly Annoying | 70 | ~1,500 chars |
| You're a bad person. | 110 | ~2,500 chars |
| Bruh | 180 | ~4,000+ chars |

Meme and Nuclear modes also append UTM tracking params (`utm_source=destiny`, `utm_medium=regret`, `utm_campaign=bad-decisions`) to the destination URL.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript

## Project Structure

```
src/
├── app/
│   ├── api/elongate/route.ts     # POST endpoint — validates URL, generates long slug
│   ├── go/[...slug]/route.ts     # Catch-all route — resolves slug back to destination
│   └── page.tsx                  # UI with mode selector and character count
├── lib/
│   ├── elongate.ts               # Slug generation + URL sanitization logic
│   └── store.ts                  # In-memory slug → URL store
```

## Getting Started

```bash
git clone https://github.com/andyhetianjun/longerthannecessary.git
cd longerthannecessary
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Known Limitations

- Links are stored in-memory and reset on server restart. A KV store (e.g. Vercel KV, Redis) would add persistence.