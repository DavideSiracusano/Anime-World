import { NextRequest, NextResponse } from "next/server";

interface TraceRequest {
  image: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: TraceRequest = await req.json();
    const { image } = body;

    const res = await fetch("https://api.trace.moe/search?cutBorders", {
      method: "POST",
      headers: { "Content-Type": "image/jpeg" },
      body: Buffer.from(image, "base64"),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Errore da trace.moe" },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
