"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Anime {
  title_english?: string;
  title: string;
  rank: number;
  score: number;
  scored_by: number;
  synopsis: string;
  trailer?: {
    embed_url: string;
  };
  episodes?: number | null;
  duration?: string;
  type?: string;
  [key: string]: any;
}

interface News {
  mal_id: number;
  title: string;
  date: string;
  author_username: string;
  forum_url: string;
  images?: {
    jpg?: {
      image_url: string;
    };
  };
  excerpt: string;
}

export default function AnimePage() {
  const { id } = useParams();
  const API_ID_ANIME = process.env.NEXT_PUBLIC_API_ID_ANIME;
  const ANIME_API = `${API_ID_ANIME}${id}`;
  const NEWS_API = `${API_ID_ANIME}${id}/news`;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [loadingAnime, setLoadingAnime] = useState<boolean>(true);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAnime = async () => {
      setLoadingAnime(true);
      try {
        const res = await fetch(ANIME_API);
        if (!res.ok) throw new Error(`Errore fetch anime: ${res.status}`);
        const data = await res.json();
        setAnime(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingAnime(false);
      }
    };
    fetchAnime();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const res = await fetch(NEWS_API);
        if (!res.ok) throw new Error(`Errore fetch news: ${res.status}`);
        const data = await res.json();
        setNews(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loadingAnime || loadingNews)
    return <p className="text-center mt-6">Caricamento...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-6">Errore: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {anime && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {anime.title_english || anime.title}
          </h1>
          <h2 className="text-lg font-semibold mb-2">{`Rank ⭐: ${anime.rank}`}</h2>
          <h3 className="text-lg font-semibold mb-2">{`Voto: ${anime.score} (votato da ${anime.scored_by} utenti)`}</h3>
          <p className="text-gray-500 mb-4">{anime.synopsis}</p>

          {anime.trailer?.embed_url && (
            <div className="mb-4">
              <iframe
                src={anime.trailer.embed_url}
                title="Trailer Anime"
                className="w-full h-64 md:h-96 rounded-lg"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <p className="text-sm text-gray-400">
            Episodi: {anime.episodes || "N/D"} | Durata:{" "}
            {anime.duration || "N/D"} | Tipo: {anime.type || "N/D"}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">News</h2>
      {news.length === 0 && (
        <p className="text-gray-400">Nessuna news trovata.</p>
      )}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <div key={item.mal_id} className="bg-gray-800 rounded-lg p-4">
            {item.images?.jpg?.image_url && (
              <img
                src={item.images.jpg.image_url}
                alt={item.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{item.excerpt}</p>
            <p className="text-xs text-gray-500 mb-2">
              Di {item.author_username} -{" "}
              {new Date(item.date).toLocaleDateString("it-IT")}
            </p>
            <a
              href={item.forum_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              Leggi di più
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
