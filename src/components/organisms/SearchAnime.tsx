"use client";

import { useState, useRef, useEffect } from "react";

interface SearchAnimeProps {
  onSearchResults: (results: any[]) => void;
}

export default function SearchAnime({ onSearchResults }: SearchAnimeProps) {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Pulisce il debounce precedente
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Se la query è vuota o troppo corta, resetta risultati
    if (!query || query.trim().length < 3) {
      onSearchResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=20`,
          { signal: controller.signal },
        );

        clearTimeout(timeoutId);

        const data = await res.json();

        if (data.status === 504) {
          setError(
            "MyAnimeList non è raggiungibile. Riprova tra qualche secondo.",
          );
          onSearchResults([]);
          return;
        }

        if (!data.data) {
          setError("Nessun risultato trovato.");
          onSearchResults([]);
          return;
        }

        setError(null);
        onSearchResults(data.data || []);
      } catch (err) {
        console.error("Errore nella ricerca:", err);
        setError("Errore nella ricerca");
        onSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 3500); // debounce 3.5 secondi per evitare rate limiting

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, onSearchResults]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // La ricerca è già gestita dal debounce
  };

  const handleClear = () => {
    setQuery("");
    onSearchResults([]);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cerca un anime"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-4 py-2 w-64"
        />
        <button type="submit" className="bg-blue-600 px-4 text-white rounded">
          🔍
        </button>

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-500 text-white px-4 rounded"
          >
            🗑️
          </button>
        )}
      </form>

      {loading && <p>Ricerca in corso...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
