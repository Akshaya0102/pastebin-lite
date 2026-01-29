import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.content) {
    return Response.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  const id = nanoid(8);
  const now = Date.now();

  await kv.set(`paste:${id}`, {
    content: body.content,
    createdAt: now,
  });

  return Response.json({
    id,
    url: `/p/${id}`,
  });
}

