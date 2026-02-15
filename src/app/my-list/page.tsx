"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardAnime from "@/components/molecules/CardAnime";
import SearchAnime from "@/components/organisms/SearchAnime";
import { favoriteService } from "@/services/api";

interface FavoriteData {
  mal_id: number;
  title: string;
  image: string;
}

interface CardData {
  mal_id: number;
  title: string;
  images?: {
    jpg?: {
      image_url: string;
    };
  };
  episodes?: number;
  status?: string;
  genres?: Array<{ name: string }>;
  year?: number;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

export default function AnimeList() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<CardData[]>([]);
  const [searchResults, setSearchResults] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoriteService.getFavorites();
      if (response.success) {
        const transformedFavorites: CardData[] = response.data.map(
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
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error("Errore nel caricamento dei favoriti:", error);
      if (error.message.includes("401") || error.message.includes("403")) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const toggleFavorite = async (card: CardData) => {
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
      console.error("Errore:", error);
      setToast({
        message: "Errore nell'aggiornamento dei preferiti",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleCardClick = (card: CardData) => {
    router.push(`/anime/${card.mal_id}`);
  };

  const animeToDisplay = searchResults.length > 0 ? searchResults : favorites;

  if (!isAuthenticated && !loading) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-red-500">
          Devi essere loggato per visualizzare la tua lista di anime 😡.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-4">La Mia Lista</h1>
      <SearchAnime onSearchResults={setSearchResults} />

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
        <p className="text-center">Caricamento topics...</p>
      ) : animeToDisplay.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          Nessun anime nella tua lista.
        </p>
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
