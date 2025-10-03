// src/app/api/trace/route.js per proxy (intermediario) con trace.moe
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { image } = body;

    const res = await fetch("https://api.trace.moe/search?cutBorders", {
      method: "POST",
      headers: { "Content-Type": "image/jpeg" },
      body: Buffer.from(image, "base64"),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Errore da trace.moe" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
