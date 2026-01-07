import { store } from "@/lib/store";
import { sanitizeUrl, makeLongSlug, addMemeQueryParams } from "@/lib/elongate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const rawUrl = body?.url;
  const mode = body?.mode ?? "meme"; // "normal" | "meme" | "nuclear"

  if (typeof rawUrl !== "string") {
    return Response.json({ error: "Missing url" }, { status: 400 });
  }

  const clean = sanitizeUrl(rawUrl);
  if (!clean) {
    return Response.json({ error: "Invalid URL (must be http/https)" }, { status: 400 });
  }

  const target = mode === "meme" || mode === "nuclear" ? addMemeQueryParams(clean) : clean;

  const slug =
    mode === "nuclear"
      ? makeLongSlug({ segments: 180, segmentLen: 22 })
      : mode === "meme"
        ? makeLongSlug({ segments: 110, segmentLen: 20 })
        : makeLongSlug({ segments: 70, segmentLen: 18 });

  store.set(slug, target);

  const origin = new URL(req.url).origin;
  return Response.json({ elongated: `${origin}/go/${slug}` });
}
