"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardAnime from "../molecules/CardAnime";
import SearchAnime from "./SearchAnime";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function FetchNews() {
  const API_TOP_ANIME = process.env.NEXT_PUBLIC_API_TOP_ANIME;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [topAnime, setTopAnime] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
  }, []);

  useEffect(() => {
    if (!API_TOP_ANIME) return setLoading(false);

    fetch(API_TOP_ANIME)
      .then((res) => res.json())
      .then((data) => {
        setTopAnime(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (card) => {
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

  const handleCardClick = (card) => {
    router.push(`/anime/${card.mal_id}`);
  };

  const animeToDisplay = filteredAnime.length > 0 ? filteredAnime : topAnime;

  return (
    <div>
      <SearchAnime onSearchResults={setFilteredAnime} />

      {/* Toast */}
      {toast && (
        <div
          className="toast toast-sticky toast-top toast-center z-50"
          data-theme="light"
        >
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

      {loading ? (
        // Skeleton grid
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 m-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Stack spacing={1} key={idx} className="p-4 bg-gray-800 rounded-lg">
              <Skeleton variant="rectangular" width="100%" height={288} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </Stack>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 m-5">
          {animeToDisplay.map((card) => (
            <CardAnime
              key={card.mal_id}
              card={card}
              addToFavorites={() => toggleFavorite(card)}
              isFavorite={favorites.some((fav) => fav.mal_id === card.mal_id)}
              seeDetails={() => handleCardClick(card)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FetchNews;
