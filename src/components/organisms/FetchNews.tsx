"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardAnime from "../molecules/CardAnime";
import SearchAnime from "./SearchAnime";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { favoriteService } from "@/services/api";

interface AnimeData {
  mal_id: number;
  title: string;
  images?: {
    jpg?: {
      image_url: string;
    };
  };
  episodes?: number | null;
  status?: string;
  genres?: Array<{ name: string }>;
  year?: number | null;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

interface FavoriteData {
  mal_id: number;
  title: string;
  image: string;
}

export default function FetchNews() {
  const API_TOP_ANIME = process.env.NEXT_PUBLIC_API_TOP_ANIME;
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [topAnime, setTopAnime] = useState<AnimeData[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<AnimeData[]>([]);
  const [favorites, setFavorites] = useState<AnimeData[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await favoriteService.getFavorites();
        if (response.success) {
          const transformedFavorites = response.data.map(
            (fav: FavoriteData) => ({
              mal_id: fav.mal_id,
              title: fav.title,
              images: {
                jpg: {
                  image_url: fav.image,
                },
              },
              episodes: 0,
              status: "Favorito",
              genres: [],
            }),
          );
          setFavorites(transformedFavorites);
        }
      } catch (error) {
        console.error("Errore nel caricamento dei preferiti:", error);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (!API_TOP_ANIME) return;

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
  }, [API_TOP_ANIME]);

  const toggleFavorite = async (card: AnimeData) => {
    try {
      const isFavorite = favorites.some((fav) => fav.mal_id === card.mal_id);

      if (isFavorite) {
        await favoriteService.removeFavorite(card.mal_id);
        setFavorites(favorites.filter((fav) => fav.mal_id !== card.mal_id));
        setToast({
          message: "Rimosso dai preferiti",
          type: "error",
        });
      } else {
        await favoriteService.addFavorite(
          card.mal_id,
          card.title,
          card.images?.jpg?.image_url || "",
        );
        setFavorites([...favorites, card]);
        setToast({
          message: "Aggiunto ai preferiti",
          type: "success",
        });
      }
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Errore nell'aggiornamento dei preferiti:", error);
      setToast({
        message:
          "Non è stato possibile aggiornare i preferiti, login potrebbe essere scaduto",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleCardClick = (card: AnimeData) => {
    router.push(`/anime/${card.mal_id}`);
  };

  const animeToDisplay = filteredAnime.length > 0 ? filteredAnime : topAnime;

  return (
    <div>
      <SearchAnime onSearchResults={setFilteredAnime} />

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
