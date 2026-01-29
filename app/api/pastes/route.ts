import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.content) {
    return new Response(
      JSON.stringify({ error: "Content required" }),
      { status: 400 }
    );
  }

  const id = nanoid(8);

  await kv.set(`paste:${id}`, {
    content: body.content,
    createdAt: Date.now(),
  });

  return new Response(
    JSON.stringify({
      id,
      url: `/p/${id}`,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}



