import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "25";

  const apiUrl = process.env.NEXT_PUBLIC_API_TOP_ANIME;

  const response = await fetch(`${apiUrl}?page=${page}&limit=${limit}`);
  const data = await response.json();

  return new Response(JSON.stringify(data), { status: 200 });
}
