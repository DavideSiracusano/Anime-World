"use client";
import React from "react";
import { useState, useEffect } from "react";
import CardAnime from "@/components/molecules/CardAnime";
import SearchAnime from "@/components/organisms/SearchAnime";

function AnimeList() {
  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const togglePersonalFavorite = (card) => {
    const isFavorite = favorites.some((fav) => fav.mal_id === card.mal_id);
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.mal_id !== card.mal_id);
      alert("Rimosso dai preferiti");
    } else {
      newFavorites = [...favorites, card];
      alert("Aggiunto ai preferiti");
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  return (
    <div className="flex flex-col items-center m-5">
      {/* Componente di ricerca */}
      <SearchAnime onSearchResults={setSearchResults} />

      {/* Risultati della ricerca */}
      {searchResults.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Risultati della ricerca</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {searchResults.map((card) => (
              <CardAnime
                key={card.mal_id}
                card={card}
                addToFavorites={() => togglePersonalFavorite(card)}
                isFavorite={favorites.some((fav) => fav.mal_id === card.mal_id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Preferiti */}
      {favorites.length === 0 ? (
        <p className="text-center text-xl text-gray-800">
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AnimeList;
