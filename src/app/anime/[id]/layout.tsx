import { ReactNode } from "react";
import type { Metadata } from "next";

interface AnimeLayoutParams {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: AnimeLayoutParams): Promise<Metadata> {
  const { id } = params;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!res.ok) throw new Error("Failed to fetch anime");

    const data = await res.json();
    const anime = data.data;

    return {
      title: `${anime.title} - My AnimeWorld`,
      description:
        anime.synopsis?.substring(0, 160) ||
        `Dettagli completi su ${anime.title}`,
      keywords: `${anime.title}, anime, dettagli`,
    };
  } catch (error) {
    return {
      title: "Dettagli Anime - My AnimeWorld",
      description: "Consulta i dettagli dell'anime",
    };
  }
}

interface AnimeLayoutProps {
  children: ReactNode;
}

export default function AnimeLayout({ children }: AnimeLayoutProps) {
  return <>{children}</>;
}
