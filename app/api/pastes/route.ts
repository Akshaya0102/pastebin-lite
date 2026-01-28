import { kv } from "@/lib/kv";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.content || typeof body.content !== "string" || !body.content.trim()) {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  const ttl =
    body.ttl_seconds !== undefined ? Number(body.ttl_seconds) : null;
  const maxViews =
    body.max_views !== undefined ? Number(body.max_views) : null;

  if ((ttl !== null && ttl < 1) || (maxViews !== null && maxViews < 1)) {
    return Response.json({ error: "Invalid constraints" }, { status: 400 });
  }

  const id = nanoid();
  const now = Date.now();

  await kv.set(`paste:${id}`, {
    content: body.content,
    createdAt: now,
    expiresAt: ttl ? now + ttl * 1000 : null,
    maxViews,
    views: 0,
  });

  return Response.json(
    {
      id,
      url: `/p/${id}`,
    },
    { status: 201 }
  );
}
