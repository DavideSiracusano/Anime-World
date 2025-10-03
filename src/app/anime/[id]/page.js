"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function AnimePage() {
  const { id } = useParams();
  const API_ID_ANIME = process.env.NEXT_PUBLIC_API_ID_ANIME;
  const ANIME_API = `${API_ID_ANIME}${id}`;
  const NEWS_API = `${API_ID_ANIME}${id}/news`;

  const [anime, setAnime] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [error, setError] = useState(null);

  // Fetch info anime
  useEffect(() => {
    if (!id) return;
    const fetchAnime = async () => {
      setLoadingAnime(true);
      try {
        const res = await fetch(ANIME_API);
        if (!res.ok) throw new Error(`Errore fetch anime: ${res.status}`);
        const data = await res.json();
        setAnime(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAnime(false);
      }
    };
    fetchAnime();
  }, [id]);

  // Fetch news
  useEffect(() => {
    if (!id) return;
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const res = await fetch(NEWS_API);
        if (!res.ok) throw new Error(`Errore fetch news: ${res.status}`);
        const data = await res.json();
        setNews(data.data || []);
      } catch (err) {
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
      {/* INFO ANIME */}
      {anime && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {anime.title_english || anime.title}
          </h1>
          <h2 className="text-lg font-semibold mb-2">{`Rank ⭐: ${anime.rank}`}</h2>
          <h3 className="text-lg font-semibold mb-2">{`Voto: ${anime.score} (votato da ${anime.scored_by} utenti)`}</h3>
          <p className="text-gray-500 mb-4">{anime.synopsis}</p>

          {/* Trailer */}
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

      {/* NEWS ANIME */}
      <h2 className="text-2xl font-bold mb-4">News</h2>
      {news.length === 0 && (
        <p className="text-gray-400">Nessuna news trovata.</p>
      )}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <div
            key={item.mal_id}
            className="bg-gray-800 text-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>

            {item.images?.jpg?.image_url && (
              <img
                src={item.images.jpg.image_url}
                alt={item.title}
                className="w-full rounded mb-2 object-cover"
              />
            )}

            <p className="text-sm mb-2">
              Autore:{" "}
              <a
                href={item.author_url}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                {item.author_name}
              </a>
            </p>

            <p className="text-sm mb-2">
              Pubblicata: {new Date(item.date).toLocaleDateString()}
            </p>

            <p className="text-sm mb-2">Commenti: {item.comments}</p>

            <a
              href={item.url}
              target="_blank"
              className="text-blue-400 hover:underline font-semibold"
            >
              Leggi news completa
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
