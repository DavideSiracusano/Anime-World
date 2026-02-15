"use client";

import { useState } from "react";

interface SearchAnimeProps {
  onSearchResults: (results: any[]) => void;
}

export default function SearchAnime({ onSearchResults }: SearchAnimeProps) {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query) {
      onSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/SearchAnime?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      onSearchResults(data.data || []);
    } catch (error) {
      console.error(error);
      onSearchResults([]);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setQuery("");
    onSearchResults([]);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cerca un anime"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-4 py-2 w-40"
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

      {loading && <p>Loading...</p>}
    </div>
  );
}
