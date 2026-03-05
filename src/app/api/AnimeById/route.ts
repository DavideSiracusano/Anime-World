import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "ID anime richiesto" }), {
      status: 200,
    });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_ID_ANIME;

  const response = await fetch(`${apiUrl}${id}`);
  const data = await response.json();

  return new Response(JSON.stringify(data), { status: 200 });
}
