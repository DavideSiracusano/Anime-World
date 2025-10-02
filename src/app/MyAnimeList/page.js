"use client";
import React from "react";
import { useState, useEffect } from "react";
import CardAnime from "@/components/molecules/CardAnime";
import FetchNews from "@/components/organisms/FetchNews";

function AnimeList() {
  const [favorites, setFavorites] = useState([]);

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

  if (favorites.length === 0) {
    return (
      <p className="text-center text-4xl font-bold my-4">
        non ci sono anime preferiti
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-4xl font-bold my-4">La Mia AnimeList</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((card) => (
          <CardAnime
            key={card.mal_id}
            card={card}
            addToFavorites={() => togglePersonalFavorite(card)}
            isFavorite={favorites.some((fav) => fav.mal_id === card.mal_id)}
          />
        ))}
      </div>
    </div>
  );
}

export default AnimeList;
