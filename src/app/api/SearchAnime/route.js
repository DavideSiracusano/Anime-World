// fetch lato server per CORS

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ data: [] }), { status: 200 });
  }

  const response = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`
  );
  const data = await response.json();

  return new Response(JSON.stringify(data), { status: 200 });
}
