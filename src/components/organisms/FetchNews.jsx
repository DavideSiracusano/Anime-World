"use client";
import { useState, useEffect } from "react";
import CardAnime from "../molecules/CardAnime";
import SearchAnime from "./SearchAnime";

function FetchNews() {
  const API_TOP_ANIME = process.env.NEXT_PUBLIC_API_TOP_ANIME;

  const [loading, setLoading] = useState(true);
  const [topAnime, setTopAnime] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if (!API_TOP_ANIME) {
      console.error("Errore: API_TOP_ANIME non definita!");
      setLoading(false);
      return;
    }

    fetch(API_TOP_ANIME)
      .then((response) => {
        if (!response.ok) throw new Error(`Errore fetch: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setTopAnime(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (card) => {
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

  // Determina quali anime mostrare: filtrati o top anime
  const animeToDisplay = filteredAnime.length > 0 ? filteredAnime : topAnime;

  return (
    <div>
      <SearchAnime onSearchResults={setFilteredAnime} />
      {loading && <p>Loading...</p>}

      {!loading && (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 m-5">
          {animeToDisplay.map((card) => (
            <CardAnime
              key={card.mal_id}
              card={card}
              addToFavorites={() => toggleFavorite(card)}
              isFavorite={favorites.some((fav) => fav.mal_id === card.mal_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FetchNews;
