"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardAnime from "@/components/molecules/CardAnime";
import SearchAnime from "@/components/organisms/SearchAnime";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

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
        <div className="toast toast-top toast-center">
          <div className={`alert alert-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Skeleton durante il caricamento */}
      {loading && (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 m-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Stack spacing={1} key={idx} className="p-4 bg-gray-800 rounded-lg">
              <Skeleton variant="rectangular" width="100%" height={288} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </Stack>
          ))}
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
