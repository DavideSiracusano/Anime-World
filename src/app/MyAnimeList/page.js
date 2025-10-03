"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardAnime from "@/components/molecules/CardAnime";
import SearchAnime from "@/components/organisms/SearchAnime";

function AnimeList() {
  const router = useRouter();

  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // nuovo stato per caricamento
  const [toast, setToast] = useState(null);

  const handleCardClick = (card) => {
    router.push(`/anime/${card.mal_id}`);
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
  }, []);

  const togglePersonalFavorite = (card) => {
    const isFavorite = favorites.some((fav) => fav.mal_id === card.mal_id);
    const newFavorites = isFavorite
      ? favorites.filter((fav) => fav.mal_id !== card.mal_id)
      : [...favorites, card];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    // mostra il toast
    setToast({
      message: isFavorite ? "Rimosso dai preferiti" : "Aggiunto ai preferiti",
      type: isFavorite ? "error" : "success",
    });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col items-center m-5">
      <SearchAnime
        onSearchResults={(results) => {
          setLoading(true);
          setSearchResults([]);
          setTimeout(() => {
            setSearchResults(results);
            setLoading(false);
          }, 500); // simula caricamento
        }}
      />

      {/* Toast */}
      {toast && (
        <div className="toast toast-top toast-center" data-theme="light">
          {toast.type === "success" && (
            <div className="alert alert-success">
              <span>{toast.message}</span>
            </div>
          )}
          {toast.type === "error" && (
            <div className="alert alert-error">
              <span>{toast.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Skeleton durante il caricamento */}
      {loading && (
        <div>
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {/* Risultati della ricerca */}
      {!loading && searchResults.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Risultati della ricerca</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {searchResults.map((card) => (
              <CardAnime
                key={card.mal_id}
                card={card}
                addToFavorites={() => togglePersonalFavorite(card)}
                isFavorite={favorites.some((fav) => fav.mal_id === card.mal_id)}
                seeDetails={() => handleCardClick(card)}
              />
            ))}
          </div>
        </>
      )}

      {/* Preferiti */}
      {!loading &&
        (favorites.length === 0 ? (
          <p className="text-center text-xl text-gray-400">
            Non ci sono anime preferiti
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((card) => (
              <CardAnime
                key={card.mal_id}
                card={card}
                addToFavorites={() => togglePersonalFavorite(card)}
                isFavorite={true}
                seeDetails={() => handleCardClick(card)}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

export default AnimeList;
