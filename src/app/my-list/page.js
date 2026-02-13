"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardAnime from "@/components/molecules/CardAnime";
import SearchAnime from "@/components/organisms/SearchAnime";
import { favoriteService } from "@/services/api";

export default function AnimeList() {
  const router = useRouter();

  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carica i favoriti dal database
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoriteService.getFavorites();
      if (response.success) {
        // Trasforma i dati dal DB nella struttura attesa da CardAnime
        const transformedFavorites = response.data.map((fav) => ({
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
        }));
        setFavorites(transformedFavorites);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Errore nel caricamento dei favoriti:", error);
      // Se il token non è valido, redirige al login
      if (error.message.includes("401") || error.message.includes("403")) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Carica i favoriti al mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const handleCardClick = (card) => {
    router.push(`/anime/${card.mal_id}`);
  };

  // Aggiunge o rimuove dai preferiti
  const togglePersonalFavorite = async (card) => {
    try {
      const isFavorite = favorites.some((fav) => fav.mal_id === card.mal_id);

      if (isFavorite) {
        // Rimuovi dai preferiti
        await favoriteService.removeFavorite(card.mal_id);
        setFavorites(favorites.filter((fav) => fav.mal_id !== card.mal_id));
        setToast({
          message: "Rimosso dai preferiti",
          type: "error",
        });
      } else {
        // Aggiungi ai preferiti
        await favoriteService.addFavorite(
          card.mal_id,
          card.title,
          card.images?.jpg?.image_url,
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
        message: "Errore nell'aggiornamento",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen m-5">
        <p className="text-center text-xl text-gray-400 mb-4">
          Effettua il login per visualizzare i tuoi anime preferiti
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg"
        >
          Vai al Login
        </button>
      </div>
    );
  }

  return (
    <div className="topics-page min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      {/* Toast Notification */}
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
      <div className="flex flex-col items-center m-5">
        <SearchAnime
          onSearchResults={(results) => {
            setLoading(true);
            setSearchResults([]);
            setTimeout(() => {
              setSearchResults(results);
              setLoading(false);
            }, 500);
          }}
        />

        {loading && (
          <div>
            <span className="loading loading-spinner text-primary"></span>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Risultati della ricerca</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
              {searchResults.map((card) => (
                <CardAnime
                  key={card.mal_id}
                  card={card}
                  addToFavorites={() => togglePersonalFavorite(card)}
                  isFavorite={favorites.some(
                    (fav) => fav.mal_id === card.mal_id,
                  )}
                  seeDetails={() => handleCardClick(card)}
                />
              ))}
            </div>
          </>
        )}

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
    </div>
  );
}
