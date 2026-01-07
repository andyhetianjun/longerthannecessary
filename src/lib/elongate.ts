export function sanitizeUrl(input: string): string | null {
  try {
    const u = new URL(input);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function makeLongSlug(options?: { segments?: number; segmentLen?: number }) {
  const segments = options?.segments ?? 80;
  const segmentLen = options?.segmentLen ?? 18;

  const words = [
    "this", "link", "didnt", "need", "to", "be", "this", "long",
    "but", "here", "we", "are", "utm", "regret", "medium", "pain",
    "campaign", "bad-decisions", "why", "reading", "still"
  ];

  const randWord = () => words[Math.floor(Math.random() * words.length)];

  const randChunk = (n: number) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let s = "";
    for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  };

  const parts: string[] = [];
  for (let i = 0; i < segments; i++) {
    const w = randWord();
    const pad = randChunk(Math.max(6, segmentLen - w.length - 1));
    parts.push(`${w}-${pad}`);
  }

  const unique = crypto.randomUUID().replaceAll("-", "");
  parts.push(`unique-${unique}`);

  return parts.join("/");
}

export function addMemeQueryParams(target: string) {
  const u = new URL(target);
  u.searchParams.set("utm_source", "destiny");
  u.searchParams.set("utm_medium", "regret");
  u.searchParams.set("utm_campaign", "bad-decisions");
  return u.toString();
}
