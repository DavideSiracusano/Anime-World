"use client";
import { useState } from "react";

export default function SearchAnime({ onSearchResults }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query) {
      onSearchResults([]); // Resetta i risultati se la query è vuota
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/SearchAnime?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      onSearchResults(data.data || []); // Invia i risultati al padre
    } catch (error) {
      console.error(error);
      onSearchResults([]); // In caso di errore, resetta i risultati
    }
    setLoading(false);
  };

  const handleClear = () => {
    setQuery("");
    onSearchResults([]); // Resetta i risultati quando si cancella la ricerca
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

        {/* button che permette di cancellare la ricerca rendering condizionale */}
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
