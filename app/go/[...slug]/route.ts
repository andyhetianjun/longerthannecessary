import { store } from "@/lib/store";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string[] }> | { slug: string[] } }
) {
  const params = await Promise.resolve(ctx.params);
  const key = (params.slug ?? []).join("/");

  const target = store.get(key);

  if (!target) {
    return new Response(
      `This link was so long it got lost.\n\n(404: mapping not found)`,
      { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  return Response.redirect(target, 302);
}
